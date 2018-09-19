// ================================================== //
//                     API TEST                       //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 07/03/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import {
    getHistory,
    postHistory,
    putHistory,
    deleteHistory,
    getBlobs,
    postBlobs,
    putBlobs,
    getRelays,
    postRelays,
    putRelays,
    deleteRelays,
    getErrors,
    signResource} from "../src/index";
const assert = require('assert');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

it('Test getHistory', async function() {
    /** Tests the getHistory function. */
    let url = "http://127.0.0.1:8080/";
    let history = await getHistory(url);
    let expected = "No history found.";
    assert.equal(history, expected);

    let data = {
        "id": "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
        "changed": "2018-07-16T14:19:00-06:00",
        "signer": 0,
        "signers": ["-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=", "P7SqWvnWK4VBcIBpxB-T0HLhqTePqTonxbhQEqmNI0E="]
    };
    let signature = "signer=\"j1clLcRGnHkO_JOnJF_iqWxYPmvl19p73e6PhNK0l4X_ZDhu7TSEbR-N-IV5NZozo3qPqTeFhFytjpuoZIahBA==\";";
    await postHistory(signature, data, url);

    expected = [ {
        "history": {
            "changed": "2018-07-16T14:19:00-06:00",
            "id": "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
            "signer": 0,
            "signers": [
                "-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
                "P7SqWvnWK4VBcIBpxB-T0HLhqTePqTonxbhQEqmNI0E="
            ]
        },
        "signatures": {
           "signer": "j1clLcRGnHkO_JOnJF_iqWxYPmvl19p73e6PhNK0l4X_ZDhu7TSEbR-N-IV5NZozo3qPqTeFhFytjpuoZIahBA=="
        }
    }];
    history = await getHistory(url);
    assert.deepEqual(history, expected);

    expected = {"history": {
            "id": "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
            "changed": "2018-07-16T14:19:00-06:00",
            "signer": 0,
            "signers": [
                "-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
                "P7SqWvnWK4VBcIBpxB-T0HLhqTePqTonxbhQEqmNI0E="
            ]
        },
        "signatures": {
            "signer": "j1clLcRGnHkO_JOnJF_iqWxYPmvl19p73e6PhNK0l4X_ZDhu7TSEbR-N-IV5NZozo3qPqTeFhFytjpuoZIahBA=="
        }
    };
    let did = "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=";
    history = await getHistory(url, did);
    assert.deepEqual(history, expected);

    data = {"id": did};
    let sk = new Uint8Array([103,71,219,114,233,102,25,84,102,219,3,200,119,162,218,141,198,238,38,9,209,80,159,183,161,
        194,28,122,114,127,113,252,249,252,79,77,217,141,95,85,248,165,153,203,120,38,135,116,251,140,72,248,45,218,253,
        153,160,12,147,29,58,193,40,47]);
    signature = await signResource(JSON.stringify(data), sk);
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url);
});

// ================================================== //

it('Test postHistory', async function() {
    /** Tests the postHistory function */
    let url = "http://127.0.0.1:8080/";
    let data = {
        "id": "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
        "changed": "2018-07-16T14:19:00-06:00",
        "signer": 0,
        "signers": ["-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=", "P7SqWvnWK4VBcIBpxB-T0HLhqTePqTonxbhQEqmNI0E="]
    };
    let signature = "signer=\"j1clLcRGnHkO_JOnJF_iqWxYPmvl19p73e6PhNK0l4X_ZDhu7TSEbR-N-IV5NZozo3qPqTeFhFytjpuoZIahBA==\";";
    await postHistory(signature, data, url);

    let expected = [ {
        "history": {
            "changed": "2018-07-16T14:19:00-06:00",
            "id": "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
            "signer": 0,
            "signers": [
                "-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=",
                "P7SqWvnWK4VBcIBpxB-T0HLhqTePqTonxbhQEqmNI0E="
            ]
        },
        "signatures": {
            "signer": "j1clLcRGnHkO_JOnJF_iqWxYPmvl19p73e6PhNK0l4X_ZDhu7TSEbR-N-IV5NZozo3qPqTeFhFytjpuoZIahBA=="
        }
    }];
    let history = await getHistory(url);
    assert.deepEqual(history, expected);

    let did = "did:dad:-fxPTdmNX1X4pZnLeCaHdPuMSPgt2v2ZoAyTHTrBKC8=";
    data = {"id": did};
    let sk = new Uint8Array([103,71,219,114,233,102,25,84,102,219,3,200,119,162,218,141,198,238,38,9,209,80,159,183,161,
        194,28,122,114,127,113,252,249,252,79,77,217,141,95,85,248,165,153,203,120,38,135,116,251,140,72,248,45,218,
        253,153,160,12,147,29,58,193,40,47]);
    signature = await signResource(JSON.stringify(data), sk);
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url);
});

// ================================================== //

it('Test putHistory', async function() {
    /** Tests the putHistory function */
    let url = "http://127.0.0.1:8080/";
    let data = {
        "id": "did:dad:bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=",
        "changed": "2018-07-16T16:17:35-06:00",
        "signer": 0,
        "signers": ["bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=","bV0elymgSHw5xpD9nErJJpGyWQvj6qnnN668XAIBHHI="]
    };
    let signature = "signer=\"frfWY_MA-BLY-wJsOmqfaAiJOK612ea7osfRrvSCmE76hUIOewz5qsDSYxGobIG93vga5uh8vJ6CaJNEvaY8Bg==\";";
    await postHistory(signature, data, url);

    data = {
        "id": "did:dad:bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=",
        "changed": "2018-07-16T16:18:59-06:00",
        "signer": 1,
        "signers": ["bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=",
            "bV0elymgSHw5xpD9nErJJpGyWQvj6qnnN668XAIBHHI=",
            "1BC_o4AbIRueDQkYPWO6vqdTVG35H0X6Nx2h0zuCk_E="]
    };
    signature = "signer=\"a-m7TDXAPCMhIfq_5ht72IcRR-V_XQmHFflT5VvZ7sV9yn4AuIy0VNkhHjwv0ExbSrwF0z0EM6ezfYTYXMgsDw==\"; " +
        "rotation=\"UBlV7rDA3sw5OMxsQ26pCEjdfefMO0ejvDDSP_EON1jb7ncgULKmRX3Iv2B5BS22ZgpHSzInLMUEBk25KwXZAg==\";";
    let did = "did:dad:bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=";
    let expected = [ {
        "history": {
            "changed": "2018-07-16T16:18:59-06:00",
            "id": "did:dad:bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=",
            "signer": 1,
            "signers": [
                "bVjg9Xn5YHlEMcCbJHDH_JJNv66t8fE6_3vzNV-Aivs=",
                "bV0elymgSHw5xpD9nErJJpGyWQvj6qnnN668XAIBHHI=",
                "1BC_o4AbIRueDQkYPWO6vqdTVG35H0X6Nx2h0zuCk_E="
            ]
        },
        "signatures": {
            "rotation": "UBlV7rDA3sw5OMxsQ26pCEjdfefMO0ejvDDSP_EON1jb7ncgULKmRX3Iv2B5BS22ZgpHSzInLMUEBk25KwXZAg==",
            "signer": "a-m7TDXAPCMhIfq_5ht72IcRR-V_XQmHFflT5VvZ7sV9yn4AuIy0VNkhHjwv0ExbSrwF0z0EM6ezfYTYXMgsDw=="
        }
    }];
    await putHistory(signature, data, did, url);

    let history = await getHistory(url);
    assert.deepEqual(history, expected);

    data = {"id": did};
    let sk = new Uint8Array([59,148,163,148,191,140,192,245,186,146,120,78,230,85,155,34,70,100,27,24,234,1,41,144,76,
        176,69,236,47,123,25,178,109,93,30,151,41,160,72,124,57,198,144,253,156,74,201,38,145,178,89,11,227,234,169,231,
        55,174,188,92,2,1,28,114]);
    signature = await signResource(JSON.stringify(data), sk);
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url);
});

// ================================================== //

it('Test getBlobs', async function() {
    /** Tests the getBlobs function */
    // TODO: Add test when blob functionality is added to server
});

// ================================================== //

it('Test postBlobs', async function() {
    /** Tests the postBlobs function */
    // TODO: Add test when blob functionality is added to server
});

// ================================================== //

it('Test putBlobs', async function() {
    /** Tests the putBlobs function */
    // TODO: Add test when blob functionality is added to server
});

// ================================================== //

it('Test getRelays', async function() {
    /** Tests the getRelays function */
    // TODO: Add test when relay functionality is added to server
});

// ================================================== //

it('Test postRelays', async function() {
    /** Tests the postRelays function */
    // TODO: Add test when relay functionality is added to server
});

// ================================================== //

it('Test putRelays', async function() {
    /** Tests the putRelays function */
    // TODO: Add test when relay functionality is added to server
});

// ================================================== //

it('Test deleteRelays', async function() {
    /** Tests the deleteRelays function */
    // TODO: Add test when relay functionality is added to server
});

// ================================================== //

it('Test getErrors', async function() {
    /** Tests the getErrors function */
    // TODO: Add test when error functionality is added to server
});

// ================================================== //
//                        EOF                         //
// ================================================== //