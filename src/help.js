// ================================================== //
//                        HELP                        //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited: 06/30/2018                            //
// Last Edited By: Brady Hammond                      //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import "babel-polyfill";
import {batchGetEvent, batchGetHistory, batchPostHistory, batchPutHistory} from "./batch";
const _sodium = require('libsodium-wrappers');
const fileSaver = require('file-saver');
const moment = require('moment');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

Object.compare = function (obj1, obj2) {
    /** Compares two JavaScript objects.
     *
     * @param {Object} obj1 - First JavaScript object to be compared.
     * @param {Object} obj2 - Second JavaScript object to be compared.
     *
     * @return {boolean} - Returns true if objects are the same, otherwise returns false.
     */
    for (let p in obj1) {
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

        switch (typeof (obj1[p])) {
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
                break;
            case 'function':
                if ((typeof (obj2[p]) === 'undefined') ||
                    (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
                break;
            default:
                if (obj1[p] !== obj2[p]) return false;
        }
    }

    for (let p in obj2) {
        if (typeof (obj1[p]) === 'undefined') return false;
    }
    return true;
};

// ================================================== //

export function concatenateUint8Arrays(...arrays) {
    /** Concatenates two or more Uint8Arrays.
     *
     * @param {Uint8Array} arrays - Two or more Uint8Arrays.
     *
     * @return {Uint8Array} - Concatenated Uint8Array.
     */
    let totalLength = 0;
    for (let array of arrays) {
        totalLength += array.length;
    }

    let result = new Uint8Array(totalLength);
    let offset = 0;
    for (let array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }

    return result;
}

// ================================================== //

export function stringToBytes(str) {
    /** Converts a string to a byte array.
     *
     * @param {string} str - String to be converted.
     *
     * @return {Uint8Array} - Byte array derived from given string.
     */
    let ch, st, re = [];
    for (let i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push( ch & 0xFF );
            ch = ch >> 8;
        }
        while ( ch );
        re = re.concat( st.reverse() );
    }
    return new Uint8Array(re);
}

// ================================================== //

export function parseSignatureHeader(signature) {
    /** Returns object of fields and values parsed from signature which is the value portion of a Signature header.
     *
     * Signature header has the format:
     *  Signature: headervalue
     *
     * Where headervalue has the format:
     *  tag = "signature"
     *      or
     *  tag = "signature"; tag = "signature"; ...
     *
     * "tag" is the name of a field in the body of the request whose value is a DID from which the public key for the
     * signature can be obtained. If the same tag appears multiple times then only the last occurrence is returned.
     * Each signature value is a doubly quoted string that contains the actual signature in Base64 url safe format. By
     * default the signatures are EdDSA (Ed25519) which are 88 characters long (with two trailing pad bytes) that
     * represent 64 byte EdDSA signatures. An optional tag name = "kind" with values "EdDSA" or "Ed25519" may be present
     * that specifies the type of signature. All signatures within the header must be of the same kind.
     *
     * @param {string} signature - String of signature to be parsed.
     *
     * @return {Object} - Object with format:
     *  {
     *    "String of parsed tag": "String of parsed value",
     *    ...
     *  }
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

            let result = clause.split(/=(.+)/);

            if (result.length < 2) {
                throw new Error("Signature formatted incorrectly");
            }
            tag = result[0];
            value = result[1];

            tag = tag.trim();
            if (!tag) {
                return;
            }
            value = value.trim();
            if (!(value.startsWith('\"') || value.startsWith('\''))) {
                return;
            }

            if (!(value.endsWith('\"') || value.endsWith('\''))) {
                return;
            }

            if (value.length < 3) {
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

export function checkConsensus(data, level=1.0) {
    /** Compares entries in an array to verify consensus.
     *
     * @param {Array} data - Array of data entries to compare.
     * @param {float} level - Optional float for minimal level of consensus (between 0 and 1).
     *
     * @return {boolean} - Returns true if consensus is reached or false if consensus percentage falls below the
     * supplied level.
     */
    if (data.length < 1) {
        throw new Error("No comparable data found");
    }

    if (level > 1 || level < 0) {
        throw new Error("Level must be between 0 and 1");
    }

    let unique = data.filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length !== 1) {
        let mostFrequent = 0;
        let type = "";
        if (typeof data[0] === 'object') {
            type = "object";
        }
        else if (typeof data[0] === 'function') {
            type = "function";
        }
        else {
            type = "primitive"
        }
        for (let i=0; i < unique.length; i++) {
            let frequency = 0;
            for (let j=0; j < data.length; j++) {
                if (type === "object") {
                    if (Object.compare(unique[i], data[j])) {
                        frequency++;
                    }
                }
                else if (type === "primitive") {
                    if (unique[i] === data[j]) {
                        frequency++;
                    }
                }
                else {
                    throw new TypeError("Primitive or object expected");
                }
            }
            if (frequency > mostFrequent) {
                mostFrequent = frequency;
            }
        }

        let consensus = mostFrequent / data.length;
        return (consensus >= level);
    }
    else {
        return true;
    }
}

// ================================================== //

export function getConsensus(data, level=0.0) {
    /** Compares entries in an array to verify consensus.
     *
     * @param {Array} data - Array of data entries to compare.
     * @param {float} level - Optional float for minimal level of consensus (between 0 and 1).
     *
     * @return {Object} or {primitive} - Returns most frequent data entry if consensus level is reached, otherwise
     * throws an error.
     */
    if (data.length < 1) {
        throw new Error("No comparable data found");
    }

    if (level > 1 || level < 0) {
        throw new Error("Level must be between 0 and 1");
    }

    let unique = data.filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length !== 1) {
        let mostFrequent = "";
        let highestFrequency = 0;
        let type = "";
        if (typeof data[0] === 'object') {
            type = "object";
        }
        else if (typeof data[0] === 'function') {
            type = "function";
        }
        else {
            type = "primitive"
        }
        for (let i=0; i < unique.length; i++) {
            let frequency = 0;
            for (let j=0; j < data.length; j++) {
                if (type === "object") {
                    if (Object.compare(unique[i], data[j])) {
                        frequency++;
                    }
                }
                else if (type === "primitive") {
                    if (unique[i] === data[j]) {
                        frequency++;
                    }
                }
                else {
                    throw new TypeError("Primitive or object expected");
                }
            }
            if (frequency > highestFrequency) {
                highestFrequency = frequency;
                mostFrequent = unique[i];
            }
        }

        let consensus = highestFrequency / data.length;
        if (consensus < level) {
            throw new Error("Consensus unreached");
        }
        else {
            return mostFrequent;
        }
    }
    else {
        return data[0];
    }
}

// ================================================== //

export async function makeDid(vk, method="dad") {
    /** Creates and returns DID from bytes vk.
     *
     * @param {Uint8Array} vk - 32 byte verifier key from EdDSA (Ed25519) key pair.
     *
     * @return {string} - DID string.
     */
    await _sodium.ready;
    const sodium = _sodium;

    try {
        let vk64u = sodium.to_base64(vk, sodium.base64_variants.URLSAFE);
        return `did:${method}:${vk64u}`;
    }

    catch (error) {
        throw error;
    }
}

// ================================================== //

export function extractDidParts(did, method="dad") {
    /** Parses and returns the key string from a DID. Raises an error if parsing fails.
     *
     * @param {string} did - DID string to be parsed.
     * @param {string} method - Optional string of DID method.
     *
     * @return {string} - Key string from DID.
     */
    let parts = did.split(":");
    if (parts.length !== 3) {
        throw new Error("Invalid DID value");
    }

    if (parts[0] !== "did") {
        throw new Error("Invalid DID identifier");
    }

    if (parts[1] !== method) {
        throw new Error("Invalid DID method");
    }

    return parts[2];
}

// ================================================== //

export async function generateKeyPair(seed=[]) {
    /** Uses libsodium to generate an ed25519 key pair.
     *
     * @param {Uint8Array} or {string} seed - Optional byte array or string of seed.
     *
     * @return {Array} - An array of format: [privateKey, publicKey].
     */
    await _sodium.ready;
    const sodium = _sodium;

    if (seed === undefined || seed.length === 0) {
        let uint8buffer = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);
        seed = new Uint8Array(uint8buffer, 0, 32);
    }

    try {
        let keypair = sodium.crypto_sign_seed_keypair(seed);
        return [keypair.privateKey, keypair.publicKey];
    }

    catch (error) {
        throw error;
    }
    /*let seedBuffer = libsodium.sodium_malloc(libsodium.crypto_sign_SEEDBYTES);
    if (seed === undefined || seed.length === 0) {
        libsodium.randombytes_buf(seedBuffer);
    }

    else {
        if (typeof seed === "string") {
            seed = stringToBytes(seed);
        }

        seedBuffer = Buffer.from(seed);
    }

    try {
        let publicBuffer = libsodium.sodium_malloc(libsodium.crypto_sign_PUBLICKEYBYTES);
        let secretBuffer = libsodium.sodium_malloc(libsodium.crypto_sign_SECRETKEYBYTES);
        libsodium.crypto_sign_seed_keypair(publicBuffer, secretBuffer, seedBuffer);
        let privateKey = new Uint8Array(secretBuffer);
        let publicKey = new Uint8Array(publicBuffer);
        return [privateKey, publicKey];
    }

    catch (error) {
        throw error;
    }*/
}


// ================================================== //

export async function signResource(resource, sk) {
    /** Signs a resource with a private key.
     *
     * @param {string} resource - Stringified resource to be signed.
     * @param {Uint8Array} or {string} sk - Byte array or un-encoded string of private key.
     *
     * @return {string} - Base64 encoded signature string.
     */
    await _sodium.ready;
    const sodium = _sodium;

    try {
        let sig = sodium.crypto_sign(resource, sk);
        sig = sig.slice(0, 64);

        return sodium.to_base64(sig, sodium.base64_variants.URLSAFE);
    }

    catch (error) {
        throw error;
    }
}

// ================================================== //

export async function verify(signature, message, vk) {
    /** Checks if signature of message can be verified with verification key vk.
     *
     * @param {Uint8Array} signature - Byte array of signature.
     * @param {string} message - Message string.
     * @param {Uint8Array} vk - Byte array of verification key.
     *
     * @return {boolean} - Returns true if message signature can be verified against the verification key, otherwise
     * raises an error.
     */
    await _sodium.ready;
    const sodium = _sodium;

    let msg = stringToBytes(message);
    try {
        let signedResource = concatenateUint8Arrays(signature, msg);
        if ( sodium.crypto_sign_open(signedResource, vk)){
            return true;
        }
    }

    catch (error) {
        throw error;
    }
}

// ================================================== //

export async function verify64u(signature, message, vk) {
    /** Checks if base64 encoded signature of message can be verified with base64 encoded verification key vk.
     *
     * @param {string} signature - Base64 encoded string of resource signature.
     * @param {string} message - Message string.
     * @param {string} vk - Base64 encoded string of verification key.
     *
     * @return {boolean} - Returns true if message signature can be verified against the verification key, otherwise
     * returns false.
     */
    let sig = await fromBase64(signature).catch(function (error) {
        throw error;
    });

    let verkey = await fromBase64(vk, 1).catch(function (error) {
        throw error;
    });

    return await verify(sig, message, verkey).catch(function (error) {
        throw error;
    });
}

// ================================================== //

export async function toBase64(key) {
    /** Converts a byte array to a unicode base64 url-file safe string.
     *
     * @param {Uint8Array} key - Byte array of key.
     *
     * @return {string} - Unicode Base64 encoded key string.
     */
    await await _sodium.ready;
    const sodium = _sodium;

    try {
        return sodium.to_base64(key, sodium.base64_variants.URLSAFE);
    }

    catch (error) {
        throw error;
    }
}

// ================================================== //

export async function fromBase64(key64u, padding=2) {
    /** Converts a unicode base64 url-file safe string to a byte array.
     *
     * @param {string} key64u - Unicode base64 encoded key string.
     * @param {int} padding - Integer of padding length.
     *
     * @return {Uint8Array} - Byte array of key.
     */
    await await _sodium.ready;
    const sodium = _sodium;

    key64u = key64u.substring(0, key64u.length - padding);

    try {
        return sodium.from_base64(key64u);
    }

    catch (error) {
        throw error;
    }
}

// ================================================== //

export async function keyInceptionEvent(options={}) {
    /** Performs a key inception event.
     *
     * On inception two keys pairs are given (either manually input or automatically generated). The first key pair
     * represents the current key which can be used to sign data. The second key pair represents the pre-rotated
     * key which will replace the current key on a rotation event. After an inception event there are options for
     * managing the newly created keys.
     *
     * @param {Uint8Array} options.currentSeed - Optional seed for current key pair generation.
     * @param {Uint8Array} options.preRotatedSeed - Optional seed for pre-rotated key pair generation.
     * @param {Array} options.currentKeyPair - Optional array with the current private key (byte array) and current
     * public key (byte array): [private, public].
     * @param {Array} options.preRotatedKeyPair - Optional array with the pre-rotated private key (byte array) and
     * pre-rotated public key (byte array): [private, public].
     * @param {boolean} options.post - Optional boolean for posting to server or not.
     * @param {Array} options.urls - Optional array of server URLs (comma separated strings).
     * @param {boolean} options.saveCurrent - Optional boolean for saving current private key or not.
     * @param {boolean} options.savePreRotated - Optional boolean for saving pre-rotated private key or not.
     * @param {boolean} options.saveDid - Optional boolean for saving DID or not.
     * @param {string} options.storageCurrent - Optional current private key storage location string; Accepted values
     * include "local", "session" or "download".
     * @param {string} options.preRotatedStorage - Optional pre-rotated private key storage location string; Accepted
     * values include "local", "session" or "download".
     * @param {string} options.storageDid - Optional DID storage location string; Accepted values include "local",
     * "session" or "download".
     * @param {boolean} options.showCurrent - Optional boolean for showing the current key or not.
     * @param {boolean} options.showPreRotated - Optional boolean for showing the pre-rotated key or not.
     * @param {boolean} options.showDid - Optional boolean for showing the did or not.
     *
     * @return {Array} - Array of current key pair and pre-rotated key pair: [current, pre-rotated].
     */
    let currentSeed = options.currentSeed || [];
    let preRotatedSeed = options.preRotatedSeed || [];
    let currentKeyPair = options.currentKeyPair || [];
    let preRotatedKeyPair = options.preRotatedKeyPair || [];
    let post = options.post || false;
    let urls = options.urls || ["http://127.0.0.1:8080/"];
    let saveCurrent = options.saveCurrent || false;
    let savePreRotated = options.savePreRotated || false;
    let saveDid = options.saveDid || false;
    let storageCurrent = options.storageCurrent || "local";
    let storagePreRotated = options.storagePreRotated || "local";
    let storageDid = options.storageDid || "local";
    let showCurrent = options.showCurrent || false;
    let showPreRotated = options.showPreRotated || false;
    let showDid = options.showDid || false;

    if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        currentKeyPair = await generateKeyPair(currentSeed).catch(function (error) {
            throw error;
        });
        preRotatedKeyPair = await generateKeyPair(preRotatedSeed).catch(function (error) {
            throw error;
        });
    }

    else if (!(currentKeyPair === undefined || currentKeyPair.length === 0) &&
        (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        preRotatedKeyPair = await generateKeyPair(preRotatedSeed).catch(function (error) {
            throw error;
        });
    }

    else if ((currentKeyPair === undefined || currentKeyPair.length === 0) &&
        !(preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0)) {
        currentKeyPair = await generateKeyPair(currentSeed).catch(function (error) {
            throw error;
        });
    }

    else if ((currentKeyPair.length !== 2 || preRotatedKeyPair.length !== 2)) {
        throw new Error("Invalid key pairs");
    }

    else if ((currentKeyPair[0] instanceof Uint8Array !== true || currentKeyPair[0].length !== 64)) {
        throw new Error("Invalid current private key");
    }

    else if ((currentKeyPair[1] instanceof Uint8Array !== true || currentKeyPair[1].length !== 32)) {
        throw new Error("Invalid current public key");
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        throw new Error("Invalid pre-rotated private key");
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[1].length !== 32)) {
        throw new Error("Invalid pre-rotated public key");
    }

    let did = await makeDid(currentKeyPair[1]);

    if (post === true) {
        let ckSigner = await toBase64(currentKeyPair[1]).catch(function (error) {
            throw error;
        });
        let prkSigner = await toBase64(preRotatedKeyPair[1]).catch(function (error) {
            throw error;
        });
        let body = {
            "id": did,
            "changed": moment().format(),
            "signer": 0,
            "signers": [ckSigner, prkSigner]
        };

        let signature = await signResource(JSON.stringify(body), currentKeyPair[0]).catch(function (error) {
            throw error;
        });
        signature = "signer=\"" + signature + "\";";

        await batchPostHistory(signature, body, urls).catch(function (error) {
            throw error;
        });
    }

    if (saveCurrent === true) {
        let key = await toBase64(currentKeyPair[0]).catch(function (error) {
            throw error;
        });
        if (storageCurrent.toLowerCase() === "local") {
            localStorage.setItem("CurrentPrivateKey", key);
        }

        else if (storageCurrent.toLowerCase() === "session") {
            sessionStorage.setItem("CurrentPrivateKey", key);
        }

        else if (storageCurrent.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "CurrentPrivateKey.txt");
            }

            catch (error) {
                throw error;
            }
        }

        else {
            throw new Error("Invalid storage location");
        }
    }

    if (savePreRotated === true) {
        let key = await toBase64(preRotatedKeyPair[0]).catch(function (error) {
            throw error;
        });
        if (storagePreRotated.toLowerCase() === "local") {
            localStorage.setItem("PreRotatedPrivateKey", key);
        }

        else if (storagePreRotated.toLowerCase() === "session") {
            sessionStorage.setItem("PreRotatedPrivateKey", key);
        }

        else if (storagePreRotated.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "PreRotatedPrivateKey.txt");
            }

            catch (error) {
                throw error;
            }
        }

        else {
            throw new Error("Invalid storage location");
        }
    }

    if (saveDid === true) {
        if (storageDid.toLowerCase() === "local") {
            localStorage.setItem("DID", did);
        }

        else if (storageDid.toLowerCase() === "session") {
            sessionStorage.setItem("DID", did);
        }

        else if (storageDid.toLowerCase() === "download") {
            try {
                let blob = new Blob([did], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "DID.txt");
            }

            catch (error) {
                throw error;
            }
        }

        else {
            throw new Error("Invalid storage location");
        }
    }

    if (showCurrent === true) {
        let pkey = await toBase64(currentKeyPair[0]).catch(function (error) {
            throw error;
        });
        alert("Please save your current private key in a secure location:\n\n" + pkey);
    }

    if (showPreRotated === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]).catch(function (error) {
            throw error;
        });
        alert("Please save your pre-rotated private key in a secure location:\n\n" + pkey);
    }


    if (showDid === true) {
        alert("Please save your DID in a secure location:\n\n" + did);
    }

    return [currentKeyPair, preRotatedKeyPair];
}

// ================================================== //

export async function keyRotationEvent(currentKey, preRotatedKey, did, options={}) {
    /** Performs a key rotation event.
     * On rotation the previous pre-rotated key becomes the new current key and a new pre-rotated key is created
     * (either manually input or automatically generated). After an rotation event there are options are options for
     * managing the new current and pre-rotated keys.
     *
     * @param {Uint8Array} currentKey - Byte array of retiring current private key.
     * @param {Uint8Array} preRotatedKey - Byte array of new current key (old pre-rotated key).
     * @param {string} did - DID associated with key history.
     * @param {Uint8Array} options.seed - Optional seed for key generation.
     * @param options.preRotatedKeyPair - Optional array with the pre-rotated key (byte array) and pre-rotated public
     * key (byte array): [private, public].
     * @param {boolean} options.post - Optional boolean for posting to server or not.
     * @param {float} options.consensus - Optional float for consensus level of key history.
     * @param {Array} options.urls - Optional array of server URLs (comma separated strings).
     * @param {boolean} options.saveCurrent - Optional boolean for saving current private key or not.
     * @param {boolean} options.savePreRotated - Optional boolean for saving pre-rotated private key or not.
     * @param {string} options.storageCurrent - Optional current private key storage location string; Accepted values
     * include "local", "session" or "download".
     * @param {string} options.storagePreRotated - Optional pre-rotated private key storage location string; Accepted
     * values include "local", "session" or "download".
     * @param {boolean} options.showCurrent - Optional boolean for showing the current key or not.
     * @param {boolean} options.showPreRotated - Optional boolean for showing the pre-rotated key or not.
     *
     * @return {Array} - Array of pre-rotated key pair: [privateKey, publicKey].
     */
    let seed = options.seed || [];
    let preRotatedKeyPair = options.preRotatedKeyPair || [];
    let post = options.post || false;
    let consensus = options.consensus || 1.0;
    let urls = options.urls || ["http://127.0.0.1:8080/"];
    let saveCurrent = options.saveCurrent || false;
    let savePreRotated = options.savePreRotated || false;
    let storageCurrent = options.storageCurrent || "local";
    let storagePreRotated = options.storagePreRotated || "local";
    let showCurrent = options.showCurrent || false;
    let showPreRotated = options.showPreRotated || false;

    if (preRotatedKeyPair === undefined || preRotatedKeyPair.length === 0) {
        preRotatedKeyPair = await generateKeyPair(seed).catch(function (error) {
            throw error;
        });
    }

    else if ((preRotatedKeyPair[0] instanceof Uint8Array !== true || preRotatedKeyPair[0].length !== 64)) {
        throw new Error("Invalid pre-rotated private key");
    }

    else if ((preRotatedKeyPair[1] instanceof Uint8Array !== true || preRotatedKeyPair[1].length !== 32)) {
        throw new Error("Invalid pre-rotated public key");
    }

    if (post === true) {
        let prkSigner = await toBase64(preRotatedKeyPair[1]).catch(function (error) {
            throw error;
        });

        let history = {};
        await batchGetHistory(urls, did).then(function (response) {
            history = getConsensus(response, consensus);
        }).catch(function (error) {
            throw error;
        });

        let body = history.history;
        body.changed = moment().format();
        body.signer += 1;
        body.signers.push(prkSigner);

        let oldSignature = await signResource(JSON.stringify(body), currentKey).catch(function (error) {
            throw error;
        });
        let newSignature = await signResource(JSON.stringify(body), preRotatedKey).catch(function (error) {
            throw error;
        });
        let signature = "signer=\"" + oldSignature + "\"; rotation=\"" + newSignature + "\";";

        await batchPutHistory(signature, body, did, urls).catch(function (error) {
            throw error;
        });
    }

    if (saveCurrent === true) {
        let key = await toBase64(preRotatedKey).catch(function (error) {
            throw error;
        });
        if (storageCurrent.toLowerCase() === "local") {
            localStorage.setItem("CurrentPrivateKey", key);
        }

        else if (storageCurrent.toLowerCase() === "session") {
            sessionStorage.setItem("CurrentPrivateKey", key);
        }

        else if (storageCurrent.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "CurrentPrivateKey.txt");
            }

            catch (error) {
                throw error;
            }
        }

        else {
            throw new Error("Invalid storage location");
        }
    }

    if (savePreRotated === true) {
        let key = await toBase64(preRotatedKeyPair[0]).catch(function (error) {
            throw error;
        });
        if (storagePreRotated.toLowerCase() === "local") {
            localStorage.setItem("PreRotatedPrivateKey", key);
        }

        else if (storagePreRotated.toLowerCase() === "session") {
            sessionStorage.setItem("PreRotatedPrivateKey", key);
        }

        else if (storagePreRotated.toLowerCase() === "download") {
            try {
                let blob = new Blob([key], {type: "text/plain;charset=utf-8"});
                fileSaver.saveAs(blob, "PreRotatedPrivateKey.txt");
            }

            catch (error) {
                throw error;
            }
        }

        else {
            throw new Error("Invalid storage location");
        }
    }

    if (showCurrent === true) {
        let pkey = await toBase64(preRotatedKey).catch(function (error) {
            throw error;
        });
        alert("Please save your current private key in a secure location:\n\n" + pkey);
    }

    if (showPreRotated === true) {
        let pkey = await toBase64(preRotatedKeyPair[0]).catch(function (error) {
            throw error;
        });
        alert("Please save your pre-rotated private key in a secure location:\n\n" + pkey);
    }

    return preRotatedKeyPair;
}

// ================================================== //

export async function keyRevocationEvent(currentKey, preRotatedKey, did, options={}) {
    /** Performs a key rotation event.
     * On revocation the keys are rotated twice to null keys. Revocations are automatically posted to given servers.
     * Keys are no longer usable after a revocation event.
     *
     * @param {Uint8Array} currentKey - Byte array of retiring current private key.
     * @param {Uint8Array} preRotatedKey - Byte array of new current key (old pre-rotated key).
     * @param {string} did - DID associated with key history.
     * @param {float} options.consensus - Optional float for consensus level of key history.
     * @param {Array} options.urls - Optional array of server URLs (comma separated strings).
     *
     * @return {boolean} - Boolean of whether or not the revocation succeeded.
     */
    let consensus = options.consensus || 1.0;
    let urls = options.urls || ["http://127.0.0.1:8080/"];

    let prkSigner = null;

    let history = {};
    await batchGetHistory(urls, did).then(function (response) {
        history = getConsensus(response, consensus);
    }).catch(function (error) {
        throw error;
    });

    let body = history.history;
    body.changed = moment().format();
    body.signer += 2;
    body.signers.push(prkSigner);

    let oldSignature = await signResource(JSON.stringify(body), currentKey).catch(function (error) {
        throw error;
    });
    let newSignature = await signResource(JSON.stringify(body), preRotatedKey).catch(function (error) {
        throw error;
    });
    let signature = "signer=\"" + oldSignature + "\"; rotation=\"" + newSignature + "\";";

    await batchPutHistory(signature, body, did, urls).catch(function (error) {
        throw error;
    });

    return true;
}

// ================================================== //

export async function verifyEvents(urls=["http://127.0.0.1:8080/"], did="") {
    /** Verifies the events from one or more servers.
     *
     * @param {Array} urls - Array of server urls (comma separated strings).
     * @param {string} did - Optional string of did (used to retrieve a single history entry),
     *
     * @return {Array} - Array of results from fetch operations.
     */
    let events = await batchGetEvent(urls, did);
    for (let i=0; i < events.length; i++) {
        let eventGroup = JSON.parse(events[i]);
        for (let j=0; j < eventGroup.length; j++) {
            let message = JSON.stringify(eventGroup[j].event);
            if (eventGroup[j].signatures.hasOwnProperty("rotation")) {
                let pkIndex = eventGroup[j].event.signer;
                let pk1 = eventGroup[j].event.signers[pkIndex];
                let pk2 = eventGroup[j].event.signers[pkIndex-1];
                let result = await verify64u(eventGroup[j].signatures.rotation, message, pk1);
                if (result) {
                    let result = await verify64u(eventGroup[j].signatures.signer, message, pk2);
                    if (!result) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            else {
                let pkIndex = eventGroup[j].event.signer;
                let pk = eventGroup[j].event.signers[pkIndex];
                let result = await verify64u(eventGroup[j].signatures.signer, message, pk);
                if (!result) {
                    return false;
                }
            }
        }
    }
    return true;
}

// ================================================== //
//                        EOF                         //
// ================================================== //