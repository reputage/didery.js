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

import { parseSignatureHeader,
    getHistory,
    postHistory,
    getBlobs,
    postBlobs,
    putBlobs,
    getRelays,
    postRelays,
    putRelays,
    deleteRelays,
    getErrors } from "./helping";

// ================================================== //
//                       MAIN                         //
// ================================================== //

console.log(parseSignatureHeader('signer="Y5xTb0_jTzZYrf5SSEK2f3LSLwIwhOX7GEj6YfRWmGViKAesa08UkNWukUkPGuKuu-EAH5U-sdFPPboBAsjRBw=="; current="Xhh6WWGJGgjU5V-e57gj4HcJ87LLOhQr2Sqg5VToTSg-SI1W3A8lgISxOjAI5pa2qnonyz3tpGvC2cmf1VTpBg=="'));
console.log(postHistory("http://127.0.0.1:8080/",
    'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="',
    {
        "id": "did:dad:Qt27fThWoNZsa88VrTkep6H-4HA8tr54sHON1vWl6FE=",
        "changed" : "2000-01-01T00:00:00+00:00",
        "signer": 0,
        "signers":
            [
                "Qt27fThWoNZsa88VrTkep6H-4HA8tr54sHON1vWl6FE=",
                "Xq5YqaL6L48pf0fu7IUhL0JRaU2_RxFP0AL43wYn148=",
            ]
    }));
console.log(getHistory("http://127.0.0.1:8080/"));
console.log(postBlobs("http://127.0.0.1:8080/",
    'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="',
    {
        "blob": "AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCgo9yjuKHHNJZFi0QD9K6Vpt6fP0XgXlj8z_4D-7s3CcYmuoWAh6NVtYaf_GWw_2sCrHBAA2mAEsml3thLmu50Dw",
        "changed": "2000-01-01T00:00:00+00:00",
        "id": "did:dad:Qt27fThWoNZsa88VrTkep6H-4HA8tr54sHON1vWl6FE="
    }));
console.log(putBlobs("http://127.0.0.1:8080/",
    'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg=="',
    {
        "blob": "AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCgo9yjuKHHNJZFi0QD9K6Vpt6fP0XgXlj8z_4D-7s3CcYmuoWAh6NVtYaf_GWw_2sCrHBAA2mAEsml3thLmu50Dw",
        "changed": "2001-01-01T00:00:00+00:00",
        "id": "did:dad:Qt27fThWoNZsa88VrTkep6H-4HA8tr54sHON1vWl6FE="
    },
    "did:dad:Qt27fThWoNZsa88VrTkep6H-4HA8tr54sHON1vWl6FE="));
console.log(getBlobs("http://127.0.0.1:8080/"));
console.log(postRelays("http://127.0.0.1:8080/",
    {
        "changed": "2000-01-01T00:00:00+00:00",
        "host_address": "127.0.0.1",
        "main": true,
        "name": "alpha",
        "port": "7541"
    }));
console.log(deleteRelays("http://127.0.0.1:8080", "affa1c5ad6634ed3bc2d19c46152b96b"));
console.log(getRelays("http://127.0.0.1:8080/"));
console.log(getErrors("http://127.0.0.1:8080/"));

// ================================================== //
//                        EOF                         //
// ================================================== //