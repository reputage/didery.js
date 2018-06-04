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
    getRelays,
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
                "Xq5YqaL6L48pf0fu7IUhL0JRaU2_RxFP0AL43wYn148="
            ]
    }
    ));
console.log(getHistory("http://127.0.0.1:8080/"));
console.log(getBlobs("http://127.0.0.1:8080/"));
console.log(getRelays("http://127.0.0.1:8080/"));
console.log(getErrors("http://127.0.0.1:8080/"));

// ================================================== //
//                        EOF                         //
// ================================================== //