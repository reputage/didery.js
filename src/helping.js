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
    /* Hits the GET history endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        did - Optional string of did (used to retrieve a single history entry)
     */
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
    /* Hits the POST history endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        signature - String of signature for signature header (format of 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to pe posted to server
     */
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
    /* Hits the POST history endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        signature - String of signature for signature header (format of 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(response => response.json());
}

export function getBlobs(baseURL, did="") {
    /* Hits the GET blobs endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        did - Optional string of did (used to retrieve a single history entry)
     */
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
            serverResponse = obj;
        }
        return serverResponse;
    });
}

export function postBlobs(baseURL, signature, data) {
    /* Hits the POST blobs endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        signature - String of signature for signature header (format of 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/blob";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json());
}

export function putBlobs(baseURL, signature, data, did) {
    /* Hits the PUT blobs endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        signature - String of signature for signature header (format of 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
        did - String of did of blob to be edited
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/blob/" + did;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(response => response.json());
}

export function getRelays(baseURL) {
    /* Hits the GET relays endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
     */
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
            serverResponse = obj;
        }
        return serverResponse;
    });
}

export function postRelays(baseURL, data) {
    /* Hits the POST relays endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        data - JSON of data to be posted to server
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json());
}

export function putRelays(baseURL, data, uid) {
    /* Hits the PUT relays endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        data - JSON of data to be posted to server
        uid - String of uid of relay to be edited
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay/" + uid;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(response => response.json());
}

export function deleteRelays(baseURL, uid) {
    /* Hits the DELETE relays endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        uid - String of uid of relay to be edited
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay/" + uid;
    return fetch(fullURL, {
        method: 'DELETE'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
    }).then(function(obj) {
        return obj;
    });
}

export function getErrors(baseURL) {
    /* Hits the GET errors endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
     */
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