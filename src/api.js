// ================================================== //
//                        API                         //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/04/2018                                //
// Last Edited: 06/30/2018                            //
// Last Edited By: Brady Hammond                      //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

export function getHistory(baseURL="http://127.0.0.1:8080/", did="") {
    /** Hits the GET history endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} baseURL - Optional string of server's base URL.
     * @param {string} did - Optional string of DID (used to retrieve a single history entry).
     *
     * @return {string} or {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history";
    if (did !== "") {
        fullURL += "/" + did;
    }

    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No history found.";
        }
        else if(obj.hasOwnProperty("data")) {
            serverResponse = obj.data;
        }
        else {
            serverResponse = obj;
        }
        return serverResponse;
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function postHistory(signature, data, baseURL="http://127.0.0.1:8080/") {
    /** Hits the POST history endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} signature - String of signature for signature header (format of
     * 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";').
     * @param {Object} data - JSON of data to pe posted to server.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function putHistory(signature, data, did, baseURL="http://127.0.0.1:8080/") {
    /** Hits the PUT history endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} signature - String of signature for signature header (format of
     * 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";
     * rotation="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";').
     * @param {Object} data - JSON of data to pe posted to server.
     * @param {string} did - String of DID.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history/" + did;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function deleteHistory(signature, data, did, baseURL="http://127.0.0.1:8080/") {
    /** Hits the DELETE history endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} signature - String of signature for signature header (format of
     * 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="';).
     * @param {Object} data - JSON of verification data.
     * @param {string} did - String of DID.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history/" + did;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'DELETE'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function getBlobs(baseURL="http://127.0.0.1:8080/", did="") {
    /** Hits the GET blobs endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} baseURL - Optional string of server's base URL.
     * @param {string} did - Optional string of DID (used to retrieve a single blob entry).
     *
     * @return {string} or {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/blob";
    if (did !== "") {
        fullURL += "/" + did;
    }

    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No blobs found.";
        }
        else {
            serverResponse = obj;
        }
        return serverResponse;
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function postBlobs(signature, data, baseURL="http://127.0.0.1:8080/") {
    /** Hits the POST blobs endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} signature - String of signature for signature header (format of
     * 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";').
     * @param {Object} data - JSON of data to be posted to server.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/blob";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function putBlobs(signature, data, did, baseURL="http://127.0.0.1:8080/") {
    /** Hits the PUT blobs endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} signature - String of signature for signature header (format of
     * 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";').
     * @param {Object} data - JSON of data to be posted to server.
     * @param {string} baseURL - Optional string of server's base URL.
     * @param {string} did - String of DID of blob to be edited.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/blob/" + did;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function getRelays(baseURL="http://127.0.0.1:8080/") {
    /** Hits the GET relays endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {string} or {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay";
    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No relays found.";
        }
        else {
            serverResponse = obj;
        }
        return serverResponse;
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function postRelays(data, baseURL="http://127.0.0.1:8080/") {
    /** Hits the POST relays endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {Object} data - JSON of data to be posted to server.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay";
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function putRelays(data, uid, baseURL="http://127.0.0.1:8080/") {
    /** Hits the PUT relays endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {Object} data - JSON of data to be posted to server.
     * @param {string} uid - String of uid of relay to be edited.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay/" + uid;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function deleteRelays(uid, baseURL="http://127.0.0.1:8080/") {
    /** Hits the DELETE relays endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} uid - String of uid of relay to be deleted.
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/relay/" + uid;
    return fetch(fullURL, {
        method: 'DELETE'
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(obj) {
        return obj;
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

export function getErrors(baseURL="http://127.0.0.1:8080/") {
    /** Hits the GET errors endpoint of a didery server and returns the result of the ensuing promise.
     *
     * @param {string} baseURL - Optional string of server's base URL.
     *
     * @return {string} or {Object} - Result of a fetch operation.
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/errors";
    let serverResponse = "Could not retrieve server response.";
    return fetch(fullURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(obj) {
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            serverResponse = "No errors found.";
        }
        else {
            serverResponse = obj.data;
        }
        return serverResponse;
    }).catch(function(error) {
        let message = 'There has been a problem with a fetch operation: ' + error.message;
        console.error(message);
        throw message;
    });
}

// ================================================== //

//export async function subscribeHistory(baseURL="http://127.0.0.1:8080", did="") {
    /** Subscribes to history server sent events from a didery server.
     *
     * @param {string} baseURL - Optional string of server's base URL.
     * @param {string} did - Optional string of DID (used to subscribe to a single key history).
     */
    /*let fullURL = baseURL.replace(/\/$/, "") + "/stream/history";
    if (did !== "") {
        fullURL += "/" + did;
    }

    let eventSource = new EventSource(fullURL);
    eventSource.onopen = function() {
        console.log("Starting subscription to " + fullURL + ".");
    };

    eventSource.onmessage = function(e) {
        console.log(e.data);
    };

    eventSource.onerror = function(e) {
        e = e || event;
        switch( e.target.readyState ){
            case EventSource.CONNECTING:
                console.log("Reconnecting to " + fullURL + ".");
                break;
            case EventSource.CLOSED:
                console.error("Connection failed.");
                throw new Error("Connection to " + fullURL + " failed.");
        }
    };
}*/

// ================================================== //
//                        EOF                         //
// ================================================== //