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

export function getHistory(baseURL, did="") {
    let fullURL = baseURL.replace(/\/$/, "") + "/history";
    if (did != "") {
        fullURL += "/" + did;
    }

    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No history found.";
        }
        else {
            serverResponse = obj.data;
        }
        return serverResponse;
    });
}

export function postHistory(baseURL, signature, data) {
    let fullURL = baseURL.replace(/\/$/, "") + "/history";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json());
}

export function putHistory() {

}

export function getBlobs(baseURL, did="") {
    let fullURL = baseURL.replace(/\/$/, "") + "/blob";
    if (did != "") {
        fullURL += "/" + did;
    }

    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No blobs found.";
        }
        else {
            serverResponse = obj.data;
        }
        return serverResponse;
    });
}

export function postBlobs() {}
export function putBlobs() {}

export function getRelays(baseURL) {
    let fullURL = baseURL.replace(/\/$/, "") + "/relay";
    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No relays found.";
        }
        else {
            serverResponse = obj.data;
        }
        return serverResponse;
    });
}

export function postRelays() {}
export function putRelays() {}
export function deleteRelays() {}

export function getErrors(baseURL) {
    let fullURL = baseURL.replace(/\/$/, "") + "/errors";
    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No errors found.";
        }
        else {
            serverResponse = obj.data;
        }
        return serverResponse;
    });
}

// ================================================== //
//                        EOF                         //
// ================================================== //