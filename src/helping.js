// ================================================== //
//                      HELPING                       //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import { postHistory } from "./api";
const _sodium = require('libsodium-wrappers');
const moment = require('moment');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

export function parseSignatureHeader(signature) {
    /* Returns object of fields and values parsed from signature
    which is the value portion of a Signature header.

    Signature header has format:
        Signature: headervalue

    Where headervalue has format:
        tag = "signature"
            or
        tag = "signature"; tag = "signature"; ...

    "tag" is the name of a field in the body of the request whose value
    is a DID from which the public key for the signature can be obtained.
    If the same tag appears multiple times then only the last occurrence is returned.
    Each signature value is a doubly quoted string that contains the actual signature
    in Base64 url safe format. By default the signatures are EdDSA (Ed25519)
    which are 88 characters long (with two trailing pad bytes) that represent
    64 byte EdDSA signatures

    An option tag name = "kind" with values "EdDSA"  "Ed25519" may be present
    that specifies the type of signature. All signatures within the header
    must be of the same kind.

        The two tag fields currently supported are "did" and "signer"
    */
    let sigs = {};

    if (signature) {
        let clauses = signature.split(";");
        clauses.forEach(function (clause) {
            clause = clause.trim();
            let tag = "";
            let value = "";
            if (!clause) {
                return;
            }
            try {
                let result = clause.split(/=(.+)/);
                tag = result[0];
                value = result[1];
            }
            catch (error) {
                return;
            }
            tag = tag.trim();
            if (!tag) {
                return;
            }
            value = value.trim();
            if ((!value.startsWith('"')) || (!value.endsWith('"')) || (value.length < 3)) {
                return;
            }
            value = value.slice(1, -1);
            value = value.trim();
            sigs[tag] = value;
        });

        return sigs;
    }
}

// ================================================== //

export async function makeDID(vk, method="dad") {
    /* Creates and returns DID from byutes vk.

        Parameters:
        vk - 32 byte verifier key from EdDSA (Ed25519) key pair
    */
    await _sodium.ready;
    const sodium = _sodium;

    let vk64u = sodium.to_base64(vk, sodium.base64_variants.URLSAFE);
    return `did:${method}:${vk64u}`;
}

// ================================================== //

export async function generateKeyPair(seed=[]) {
    /* Uses libsodium to generate an ed25519 key pair. Returns an array with
    [privateKey, publicKey].

        Paramters:
        seed - Optional byte array seed
    */
    await _sodium.ready;
    const sodium = _sodium;

    if (seed === undefined || seed.length === 0) {
        let uint8buffer = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);
        seed = new Uint8Array(uint8buffer, 0, 32);
    }

    let keypair;
    keypair = sodium.crypto_sign_seed_keypair(seed);

    return [keypair.privateKey, keypair.publicKey];
}


// ================================================== //

export async function signResource(resource, sk) {
    await _sodium.ready;
    const sodium = _sodium;

    let sig = sodium.crypto_sign(resource, sk);
    sig = sig.slice(0, 64);

    return sodium.to_base64(sig, sodium.base64_variants.URLSAFE);
}

// ================================================== //


export async function toBase64(key) {
    /* Converts a byte array to a unicode base64 url-file safe string

        Parameters:
        key - Byte array
    */
    await await _sodium.ready;
    const sodium = _sodium;

    return sodium.to_base64(key, sodium.base64_variants.URLSAFE);
}

// ================================================== //

export async function fromBase64(key64u) {
    /* Converts a unicode base64 url-file safe string to a byte array

        Parameters:
        key64u - Unicode base64 string
    */
    await await _sodium.ready;
    const sodium = _sodium;

    return sodium.from_base64(key64u);
}

// ================================================== //

export async function keyInceptionEvent(seed=[], post=true, baseURL="http://127.0.0.1:8080/", save=true, storage="local") {
    /* Generates a public private key pair. Optionally, posts it to a didery server
    and saves the private key in storage.

        Parameters:
        seed - Optional seed for key generation
        post - Boolean for posting to server or not
        baseURL - String of server URL
        save - Boolean for saving private key or not
        storage - Private key storage location accepted values include "local", "session"
        or a file path.
    */

    let keypair = await generateKeyPair(seed);
    if (post === true) {
        let did = await makeDID(keypair[1]);
        let signer = await toBase64(keypair[1]);
        let body = {
            "id": did,
            "changed": moment().format(),
            "signer": 0,
            "signers": [signer, signer]
        };

        let signature = await signResource(JSON.stringify(body), keypair[0]);
        signature = "signer=\"" + signature + "\"";
        try {
            let response = await postHistory(baseURL, signature, body);
            console.log(response);
        }

        catch (error) {
            console.log("Could not post to server: " + error + ".");
        }
    }

    if (save === true) {
        if (storage.toLowerCase() === "local") {
            localStorage.setItem("dideryPrivateKey", keypair[0]);
            console.log("Key saved to local storage.");
        }

        else if (storage.toLowerCase() === "session") {
            sessionStorage.setItem("dideryPrivateKey", keypair[0]);
            console.log("Key saved to session storage.");
        }

        else {
            try {
                let blob = new Blob([keypair[0]], {type: "text/plain;charset=utf-8"});
                if (storage.endsWith(".txt")) {
                    saveAs(blob, storage);
                    console.log("Key saved to " + storage + ".");
                }

                else if (storage.endsWith("/")) {
                    storage = storage + "dideryPrivateKey.txt";
                    saveAs(blob, storage);
                    console.log("Key saved to " + storage + ".");
                }

                else {
                    storage = storage + "/dideryPrivateKey.txt";
                    saveAs(blob, storage + "/dideryPrivateKey.txt");
                    console.log("Key saved to " + storage + ".");
                }
            }
            
            catch (error) {
                console.log("Could not save key to local file: " + error + ".");
            }
        }
    }

    return keypair;
}

// ================================================== //
//                        EOF                         //
// ================================================== //