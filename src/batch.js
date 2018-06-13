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