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

import {getHistory, postHistory, putHistory} from "./api";
const _sodium = require('libsodium-wrappers');
const moment = require('moment');
const m = require('mithril');

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
    /* Signs a resource with a private key.

        Parameters:
        resource - Stringified resource to be signed
        sk - Byte array of private key

    */
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

export async function fromBase64(key64u, padding=true) {
    /* Converts a unicode base64 url-file safe string to a byte array

        Parameters:
        key64u - Unicode base64 string
    */
    await await _sodium.ready;
    const sodium = _sodium;

    if (padding === true) {
        key64u = key64u.substring(0, key64u.length -2);
    }

    return sodium.from_base64(key64u);
}

// ================================================== //

export async function keyInceptionEvent(seed=[],
                                        currentKeyPair=[],
                                        preRotatedKeyPair=[],
                                        post=true,
                                        baseURL="http://127.0.0.1:8080/",
                                        save=true,
                                        storage="local",
                                        show=true) {
    /* Performs a key inception event. On inception two keys pairs are given (either manually
    input or automatically generated). The first key pair represents the current key
    which can be used to sign documents. The second key pair represents the pre-rotated
    key which will replace the current key on a rotation event. After an inception event
    there are options to automatically post the key history to a didery server, save the
    current key (in base64), and show the pre-rotated key(in base64).

        Parameters:
        seed - Optional seed (byte array) for key generation
        currentKeyPair - Optional array with the current private key (byte array) and current public key (byte array)
        [private, public]
        preRotatedKeyPair - Optional array with the pre-rotated key (byte array) and pre-rotated public key (byte array)
        [private, public]
        post - Optional boolean for posting to server or not
        baseURL - Optional string of server URL
        save - Optional boolean for saving private key or not
        storage - Optional private key storage location string; Accepted values include "local", "session"
        or a file path
        show - Optional boolean for showing the pre-rotated key or not
    */

    if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        currentKeyPair = await generateKeyPair(seed);
        preRotatedKeyPair = await generateKeyPair(seed);
    }

    else if (!(currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        console.log("Missing current key pair: Either supply both a current key pair and a pre-rotated key pair " +
                    "or supply neither to generate new keys.");
        return;
    }

    else if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        !(preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        console.log("Missing pre-rotated key pair: Either supply both a current key pair and a pre-rotated key pair " +
            "or supply neither to generate new keys.");
        return;
    }

    else if ((currentKeyPair.length !== 2 || preRotatedKeyPair.length !== 2)) {
        console.log("Invalid key pairs: A key pair must be an array with the both the private and public keys. They " +
                    "follow the format [private key, public key].");
        return;
    }

    else if ((currentKeyPair[0] instanceof Uint8Array !== true || currentKeyPair[0].length !== 64)) {
        console.log("Invalid key pairs: The current private key must be a byte array of length 64.");
        return;
    }

    else if ((currentKeyPair[1] instanceof Uint8Array !== true || currentKeyPair[0].length !== 32)) {
        console.log("Invalid key pairs: The current public key must be a byte array of length 32.");
        return;
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        console.log("Invalid key pairs: The pre-rotated private key must be a byte array of length 64.");
        return;
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 32)) {
        console.log("Invalid key pairs: The pre-rotated public key must be a byte array of length 32.");
        return;
    }

    if (post === true) {
        let did = await makeDID(currentKeyPair[1]);
        let ckSigner = await toBase64(currentKeyPair[1]);
        let prkSigner = await toBase64(preRotatedKeyPair[1]);
        let body = {
            "id": did,
            "changed": moment().format(),
            "signer": 0,
            "signers": [ckSigner, prkSigner]
        };

        let signature = await signResource(JSON.stringify(body), currentKeyPair[0]);
        signature = "signer=\"" + signature + "\"";
        try {
            let response = await postHistory(signature, body, baseURL);
            console.log(response);
        }

        catch (error) {
            console.log("Could not post to server: " + error + ".");
        }
    }

    if (save === true) {
        let key = await toBase64(currentKeyPair[0]);
        if (storage.toLowerCase() === "local") {
            localStorage.setItem("dideryPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storage.toLowerCase() === "session") {
            sessionStorage.setItem("dideryPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else {
            try {
                let blob = new Blob(key, {type: "text/plain;charset=utf-8"});
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

    if (show === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]);
        m.render(document.body,
            m("div", {class: "ui tiny modal"},
                m("div", {class: "ui header"}, "Pre-Rotated Key"),
                m("div", {class: "content"},
                    m("p", "Please save this pre-rotated key in a secure location:"),
                    m("p", {style: "word-wrap: break-word"},
                        m("b", pkey))),
                m("div", {class: "actions"},
                    m("div", {class: "ui green ok button"}, "OK"))));

        $('.ui.tiny.modal').modal({
            // Removes key from DOM
            onHide: function(){
                $('.content').remove();

            }
        }).modal('show');
    }

    return [currentKeyPair, preRotatedKeyPair];
}

// ================================================== //

export async function keyRotationEvent(retiringKey,
                                       newKey,
                                       did,
                                       seed=[],
                                       preRotatedKeyPair=[],
                                       post=true,
                                       baseURL="http://127.0.0.1:8080/",
                                       save=true,
                                       storage="local",
                                       show=true) {
    /* Generates a public private key pair. Optionally, posts it to a didery server
    and saves the private key in storage.

        Parameters:
        oldCurrentKey - Byte array of retiring current private key
        newCurrentKey - Byte array of new current key (old pre-rotated key)
        did - DID associated with key history
        seed - Optional seed (byte array) for key generation
        preRotatedKeyPair - Optional array with the pre-rotated key (byte array) and pre-rotated public key (byte array)
        [private, public]
        post - Optional boolean for posting to server or not
        baseURL - Optional string of server URL
        save - Optional boolean for saving new private key or not
        storage - Optional private key storage location string; Accepted values include "local", "session"
        or a file path
        show - Optional boolean for showing the pre-rotated key or not
    */

    if (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0) {
        preRotatedKeyPair = await generateKeyPair(seed);
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        console.log("Invalid key pairs: The pre-rotated private key must be a byte array of length 64.");
        return;
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 32)) {
        console.log("Invalid key pairs: The pre-rotated public key must be a byte array of length 32.");
        return;
    }

    let history = await getHistory(baseURL, did);
    let body = history.history;
    if (post === true) {
        let prkSigner = await toBase64(preRotatedKeyPair[1]);
        body.changed = moment().format();
        body.signer += 1;
        body.signers.push(prkSigner);

        let oldSignature = await signResource(JSON.stringify(body), retiringKey);
        let newSignature = await signResource(JSON.stringify(body), newKey);
        let signature = "signer=\"" + newSignature + "\"; rotation=\"" + oldSignature + "\"";
        try {
            let response = await putHistory(signature, body, did, baseURL);
            console.log(response);
        }

        catch (error) {
            console.log("Could not post to server: " + error + ".");
        }
    }

    if (save === true) {
        let key = await toBase64(newKey);
        if (storage.toLowerCase() === "local") {
            localStorage.setItem("dideryPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storage.toLowerCase() === "session") {
            sessionStorage.setItem("dideryPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else {
            try {
                let blob = new Blob(key, {type: "text/plain;charset=utf-8"});
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

    if (show === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]);
        m.render(document.body,
            m("div", {class: "ui tiny modal"},
                m("div", {class: "ui header"}, "New Pre-Rotated Key"),
                m("div", {class: "content"},
                    m("p", "Please save this new pre-rotated key in a secure location:"),
                    m("p", {style: "word-wrap: break-word"},
                        m("b", pkey))),
                m("div", {class: "actions"},
                    m("div", {class: "ui green ok button"}, "OK"))));

        $('.ui.tiny.modal').modal({
            // Removes key from DOM
            onHide: function(){
                $('.content').remove();

            }
        }).modal('show');
    }

    return preRotatedKeyPair;
}
// ================================================== //
//                        EOF                         //
// ================================================== //