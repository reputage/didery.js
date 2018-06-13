// ================================================== //
//                        API                         //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/04/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

export function getHistory(baseURL="http://127.0.0.1:8080/", did="") {
    /* Hits the GET history endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        did - Optional string of did (used to retrieve a single history entry)
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
    }).catch(function(error) {
        console.log('There has been a problem with a fetch operation: ', error.message);
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
    });
}

// ================================================== //

export function postHistory(signature, data, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function putHistory(signature, data, did, baseURL="http://127.0.0.1:8080/") {
    /* Hits the POST history endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        signature - String of signature for signature header (format of 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
     */
    let fullURL = baseURL.replace(/\/$/, "") + "/history/" + did;
    return fetch(fullURL, {
        body: JSON.stringify(data),
        headers: {
            'signature': signature,
            'content-type': 'application/json'
        },
        method: 'PUT'
    }).then(response => response.json());
}

// ================================================== //

export function getBlobs(baseURL="http://127.0.0.1:8080/", did="") {
    /* Hits the GET blobs endpoint of a didery server and returns the result of the
    ensuing promise.

        Parameters:
        baseURL - String of server's base URL
        did - Optional string of did (used to retrieve a single history entry)
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

// ================================================== //

export function postBlobs(signature, data, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function putBlobs(signature, data, did, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function getRelays(baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function postRelays(data, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function putRelays(data, uid, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function deleteRelays(uid, baseURL="http://127.0.0.1:8080/") {
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

// ================================================== //

export function getErrors(baseURL="http://127.0.0.1:8080/") {
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