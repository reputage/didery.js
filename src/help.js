// ================================================== //
//                        HELP                        //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited: 06/12/2018                            //
// Last Edited By: Brady Hammond                      //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import {getHistory, putHistory} from "./api";
import {batchPostHistory, batchPutHistory} from "./batch";
const _sodium = require('libsodium-wrappers');
const moment = require('moment');
const fileSaver = require('file-saver');
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

export async function keyInceptionEvent(options={}) {
    /* Performs a key inception event. On inception two keys pairs are given (either manually
    input or automatically generated). The first key pair represents the current key
    which can be used to sign documents. The second key pair represents the pre-rotated
    key which will replace the current key on a rotation event. After an inception event
    there are options to automatically post the key history to didery servers, save the
    current key (in base64), and show the pre-rotated key(in base64).

        Parameters:
        currentSeed - Optional seed (byte array) for current key pair generation
        preRotatedSeed - Optional seed (byte array) for pre-rotated key pair generation
        currentKeyPair - Optional array with the current private key (byte array) and current public key (byte array)
        [private, public]
        preRotatedKeyPair - Optional array with the pre-rotated key (byte array) and pre-rotated public key (byte array)
        [private, public]
        post - Optional boolean for posting to server or not
        urls - Optional array of server URLs
        saveCurrent - Optional boolean for saving current private key or not
        savePreRotated - Optional boolean for saving pre-rotated private key or not
        storageCurrent - Optional current private key storage location string; Accepted values include "local",
        "session" or "download"
        preRotatedStorage - Optional pre-rotated private key storage location string; Accepted values include "local",
        "session" or "download"
        showCurrent - Optional boolean for showing the current key or not
        showPreRotated - Optional boolean for showing the pre-rotated key or not
    */
    let currentSeed = options.currentSeed || [];
    let preRotatedSeed = options.preRotatedSeed || [];
    let currentKeyPair = options.currentKeyPair || [];
    let preRotatedKeyPair = options.preRotatedKeyPair || [];
    let post = options.post || false;
    let urls = options.urls || ["http://127.0.0.1:8080/"];
    let saveCurrent = options.saveCurrent || false;
    let savePreRotated = options.savePreRotated || false;
    let storageCurrent = options.storageCurrent || "local";
    let storagePreRotated = options.storagePreRotated || "local";
    let showCurrent = options.showCurrent || false;
    let showPreRotated = options.showPreRotated || false;

    if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        currentKeyPair = await generateKeyPair(currentSeed);
        preRotatedKeyPair = await generateKeyPair(preRotatedSeed);
    }

    else if (!(currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        console.error("Missing Current Key Pair: Either supply both a current key pair and a pre-rotated key pair " +
                    "or supply neither to generate new keys.");
        return;
    }

    else if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        !(preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        console.error("Missing Pre-rotated Key Pair: Either supply both a current key pair and a pre-rotated key pair " +
            "or supply neither to generate new keys.");
        return;
    }

    else if ((currentKeyPair.length !== 2 || preRotatedKeyPair.length !== 2)) {
        console.error("Invalid Key Pairs: A key pair must be an array with the both the private and public keys. They " +
                    "follow the format [private key, public key].");
        return ;
    }

    else if ((currentKeyPair[0] instanceof Uint8Array !== true || currentKeyPair[0].length !== 64)) {
        console.error("Invalid Key Pairs: The current private key must be a byte array of length 64.");
        return;
    }

    else if ((currentKeyPair[1] instanceof Uint8Array !== true || currentKeyPair[1].length !== 32)) {
        console.error("Invalid Key Pairs: The current public key must be a byte array of length 32.");
        return;
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        console.error("Invalid Key Pairs: The pre-rotated private key must be a byte array of length 64.");
        return;
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[1].length !== 32)) {
        console.error("Invalid Key Pairs: The pre-rotated public key must be a byte array of length 32.");
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

        await batchPostHistory(signature, body, urls).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error(error);
            throw error;
        });
    }

    if (saveCurrent === true) {
        let key = await toBase64(currentKeyPair[0]);
        if (storageCurrent.toLowerCase() === "local") {
            localStorage.setItem("CurrentPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storageCurrent.toLowerCase() === "session") {
            sessionStorage.setItem("CurrentPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else if (storageCurrent.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "CurrentPrivateKey.txt");
                console.log("Key saved to downloaded file CurrentPrivateKey.txt");
            }

            catch (error) {
                console.error("Could Not Download Key File: " + error + ".");
                throw "Could Not Download Key File: " + error + ".";
            }
        }

        else {
            console.error("Invalid Storage Location.");
            throw "Invalid Storage Location"
        }
    }

    if (savePreRotated === true) {
        let key = await toBase64(preRotatedKeyPair[0]);
        if (storagePreRotated.toLowerCase() === "local") {
            localStorage.setItem("PreRotatedPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storagePreRotated.toLowerCase() === "session") {
            sessionStorage.setItem("PreRotatedPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else if (storagePreRotated.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "PreRotatedPrivateKey.txt");
                console.log("Key saved to downloaded file PreRotatedPrivateKey.txt");
            }

            catch (error) {
                console.error("Could Not Download Key File: " + error + ".");
                throw "Could Not Download Key File: " + error + "."
            }
        }

        else {
            console.error("Invalid Storage Location.");
            throw "Invalid Storage Location."
        }
    }

    if (showCurrent === true) {
        let pkey = await toBase64(currentKeyPair[0]);
        alert("Please save your current private key in a secure location:\n\n" + pkey);
    }

    if (showPreRotated === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]);
        /*m.render(document.body,
            m("div", {class: "ui tiny modal"},
                m("div", {class: "ui header"}, "Pre-Rotated Key"),
                m("div", {class: "content"},
                    m("div", {class: "container"},
                        m("p", "Please save this pre-rotated key in a secure location:"),
                        m("p", {style: "word-wrap: break-word"},
                            m("b", pkey)))),
                m("div", {class: "actions"},
                    m("div", {class: "ui green ok button"}, "OK"))));

        $('.ui.tiny.modal').modal({
            // Removes key from DOM
            onHide: function(){
                $('.container').remove();

            }
        }).modal('show');*/

        alert("Please save your pre-rotated private key in a secure location:\n\n" + pkey);
    }

    return [currentKeyPair, preRotatedKeyPair];
}

// ================================================== //

export async function keyRotationEvent(oldCurrentKey, newCurrentKey, did, options={}) {
    /* Performs a key rotation event. On rotation the previous pre-rotated key becomes the
    new current key and a new pre-rotated key is produced (either manually input or automatically
    generated). After an rotation event there are options to automatically update the key history
    to didery servers, save the new current key (in base64), and show the new pre-rotated
    key(in base64).

        Parameters:
        oldCurrentKey - Byte array of retiring current private key
        newCurrentKey - Byte array of new current key (old pre-rotated key)
        did - DID associated with key history
        seed - Optional seed (byte array) for key generation
        preRotatedKeyPair - Optional array with the pre-rotated key (byte array) and pre-rotated public key (byte array)
        [private, public]
        post - Optional boolean for posting to server or not
        urls - Optional array of server URLs
        saveCurrent - Optional boolean for saving current private key or not
        savePreRotated - Optional boolean for saving pre-rotated private key or not
        storageCurrent - Optional current private key storage location string; Accepted values include "local",
        "session" or "download"
        storagePreRotated - Optional pre-rotated private key storage location string; Accepted values include "local",
        "session" or "download"
        showCurrent - Optional boolean for showing the current key or not
        showPreRotated - Optional boolean for showing the pre-rotated key or not
    */
    let seed = options.seed || [];
    let preRotatedKeyPair = options.preRotatedKeyPair || [];
    let post = options.post || false;
    let urls = options.urls || ["http://127.0.0.1:8080/"];
    let saveCurrent = options.saveCurrent || false;
    let savePreRotated = options.savePreRotated || false;
    let storageCurrent = options.storageCurrent || "local";
    let storagePreRotated = options.storagePreRotated || "local";
    let showCurrent = options.showCurrent || false;
    let showPreRotated = options.showPreRotated || false;

    if (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0) {
        preRotatedKeyPair = await generateKeyPair(seed);
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        console.error("Invalid Key Pairs: The pre-rotated private key must be a byte array of length 64.");
        return;
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 32)) {
        console.error("Invalid Key Pairs: The pre-rotated public key must be a byte array of length 32.");
        return;
    }

    let history = await getHistory(urls[0], did);
    let body = history.history;
    if (post === true) {
        let prkSigner = await toBase64(preRotatedKeyPair[1]);
        body.changed = moment().format();
        body.signer += 1;
        body.signers.push(prkSigner);

        let oldSignature = await signResource(JSON.stringify(body), oldCurrentKey);
        let newSignature = await signResource(JSON.stringify(body), newCurrentKey);
        let signature = "signer=\"" + newSignature + "\"; rotation=\"" + oldSignature + "\"";

        await batchPutHistory(signature, body, did, urls).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error(error);
            throw error;
        });
    }

    if (saveCurrent === true) {
        let key = await toBase64(newCurrentKey);
        if (storageCurrent.toLowerCase() === "local") {
            localStorage.setItem("CurrentPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storageCurrent.toLowerCase() === "session") {
            sessionStorage.setItem("CurrentPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else if (storageCurrent.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "CurrentPrivateKey.txt");
                console.log("Key saved to downloaded file CurrentPrivateKey.txt");
            }

            catch (error) {
                console.error("Could Not Download Key File: " + error + ".");
            }
        }

        else {
            console.error("Invalid Storage Location.");
        }
    }

    if (savePreRotated === true) {
        let key = await toBase64(preRotatedKeyPair[0]);
        if (storagePreRotated.toLowerCase() === "local") {
            localStorage.setItem("PreRotatedPrivateKey", key);
            console.log("Key saved to local storage.");
        }

        else if (storagePreRotated.toLowerCase() === "session") {
            sessionStorage.setItem("PreRotatedPrivateKey", key);
            console.log("Key saved to session storage.");
        }

        else if (storagePreRotated.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "PreRotatedPrivateKey.txt");
                console.log("Key saved to downloaded file PreRotatedPrivateKey.txt");
            }

            catch (error) {
                console.error("Could Not Download Key File: " + error + ".");
            }
        }

        else {
            console.error("Invalid Storage Location.");
        }
    }

    if (showCurrent === true) {
        let pkey = await toBase64(newCurrentKey);
        alert("Please save your current private key in a secure location:\n\n" + pkey);
    }

    if (showPreRotated === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]);
        /*m.render(document.body,
            m("div", {class: "ui tiny modal"},
                m("div", {class: "ui header"}, "Pre-Rotated Key"),
                m("div", {class: "content"},
                    m("div", {class: "container"},
                        m("p", "Please save this pre-rotated key in a secure location:"),
                        m("p", {style: "word-wrap: break-word"},
                            m("b", pkey)))),
                m("div", {class: "actions"},
                    m("div", {class: "ui green ok button"}, "OK"))));

        $('.ui.tiny.modal').modal({
            // Removes key from DOM
            onHide: function(){
                $('.container').remove();

            }
        }).modal('show');*/

        alert("Please save your pre-rotated private key in a secure location:\n\n" + pkey);
    }

    return preRotatedKeyPair;
}
// ================================================== //
//                        EOF                         //
// ================================================== //