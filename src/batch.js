// ================================================== //
//                        API                         //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 06/12/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import * as api from './api';

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

export async function batchGetHistory(urls, did="") {
    /* Hits the GET history endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        did - Optional string of did (used to retrieve a single history entry)
    */
    let responses = [];
    urls.forEach(async(url) =>{
        api.getHistory(url, did).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchPostHistory(signature, data, urls) {
    /* Hits the POST history endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        signature - String of signature for signature header (format of
        'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to pe posted to server
    */
    let responses = [];
    urls.forEach(async(url) =>{
        api.postHistory(signature, data, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchPutHistory(signature, data, did, urls) {
    /* Hits the POST history endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        signature - String of signature for signature header (format of
        'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";
        rotation="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.putHistory(signature, data, did, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchGetBlobs(urls, did="") {
    /* Hits the GET blobs endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        did - Optional string of did (used to retrieve a single history entry)
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.getBlobs(url, did).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchPostBlobs(signature, data, urls) {
    /* Hits the POST blobs endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        signature - String of signature for signature header (format of
        'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.postBlobs(signature, data, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchPutBlobs(signature, data, did, urls) {
    /* Hits the PUT blobs endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        signature - String of signature for signature header (format of
        'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="')
        data - JSON of data to be posted to server
        did - String of did of blob to be edited
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.putBlobs(signature, data, did, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchGetRelays(urls) {
    /* Hits the GET relays endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
    */
    let responses = [];
    urls.forEach(async(url) =>{
        api.getRelays(url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export async function batchPostRelays(data, urls) {
    /* Hits the POST relays endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        data - JSON of data to be posted to server
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.postRelays(data, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export function batchPutRelays(data, uid, urls) {
    /* Hits the PUT relays endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        data - JSON of data to be posted to server
        uid - String of uid of relay to be edited
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.putRelays(data, uid, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export function batchDeleteRelays(uid, urls) {
    /* Hits the DELETE relays endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
        uid - String of uid of relay to be edited
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.deleteRelays(uid, url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //

export function batchGetErrors(urls) {
    /* Hits the GET errors endpoint of multiple didery servers and returns the result of the
    ensuing promises.

        Parameters:
        urls - array of server urls
    */
    let responses = [];
    urls.forEach(async(url) => {
        api.getErrors(url).then(function(response) {
            responses.push(response);
        });
    });

    return responses;
}

// ================================================== //
//                        EOF                         //
// ================================================== //