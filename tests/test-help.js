// ================================================== //
//                     HELP TEST                      //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 07/03/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import {concatenateUint8Arrays,
    stringToBytes,
    parseSignatureHeader,
    checkConsensus,
    getConsensus,
    makeDid,
    extractDidParts,
    generateKeyPair,
    signResource,
    verify,
    verify64u,
    toBase64,
    fromBase64,
    keyInceptionEvent,
    keyRotationEvent,
    keyRevocationEvent,
    getHistory,
    deleteHistory} from '../src/index';
const assert = require('assert');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

function timeout(ms) {
    /** Creates an asynchronous timeout.
     *
     * @param {integer} ms - Milliseconds of timeout.
     *
     * @return {Promise} - Timeout promise.
     */
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================================== //

it('Test concatenateUint8Arrays', function() {
    /** Tests the concatenateUint8Arrays function. */
    let array1 = new Uint8Array([]);
    let array2 = new Uint8Array([]);
    let expected = new Uint8Array([]);
    assert.deepEqual(concatenateUint8Arrays(array1, array2), expected);

    array1 = new Uint8Array([1]);
    array2 = new Uint8Array([2]);
    expected = new Uint8Array([1, 2]);
    assert.deepEqual(concatenateUint8Arrays(array1, array2), expected);

    array1 = new Uint8Array([1, 2]);
    array2 = new Uint8Array([3, 4]);
    expected = new Uint8Array([1, 2, 3, 4]);
    assert.deepEqual(concatenateUint8Arrays(array1, array2), expected);

    array1 = new Uint8Array([1, 2, 3, 4]);
    array2 = new Uint8Array([5, 6, 7, 8]);
    expected = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual(concatenateUint8Arrays(array1, array2), expected);

    array1 = new Uint8Array([3, 7, 2, 2]);
    array2 = new Uint8Array([5, 9, 1, 4]);
    expected = new Uint8Array([3, 7, 2, 2, 5, 9, 1, 4]);
    assert.deepEqual(concatenateUint8Arrays(array1, array2), expected);
});

// ================================================== //

it('Test stringToBytes', function() {
    /** Tests the stringToBytes function. */
    let string = "";
    let expected = new Uint8Array([]);
    assert.deepEqual(stringToBytes(string), expected);

    string = "a";
    expected = new Uint8Array([97]);
    assert.deepEqual(stringToBytes(string), expected);

    string = "z";
    expected = new Uint8Array([122]);
    assert.deepEqual(stringToBytes(string), expected);

    string = "abc";
    expected = new Uint8Array([97, 98, 99]);
    assert.deepEqual(stringToBytes(string), expected);

    string = "testing";
    expected = new Uint8Array([116, 101, 115, 116, 105, 110, 103]);
    assert.deepEqual(stringToBytes(string), expected);
});

// ================================================== //

it('Test parseSignatureHeader', function() {
    /** Tests the parseSignatureHeader function. */
    let signature = "";
    let expected = null;
    assert.equal(parseSignatureHeader(signature), expected);

    signature = "testing";
    expected = /Signature formatted incorrectly$/;
    assert.throws(() => parseSignatureHeader(signature), expected);

    signature = "signer='EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==';";
    expected = {"signer": "EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw=="};
    assert.deepEqual(parseSignatureHeader(signature), expected);
    signature = "signer='EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==';" +
        "rotation='QXqlf2WzYEqwxN1RBQRTFbOlBtvc6gZqlp54R47nov8j6fx8kAYdJXPlpFAFyrqfaNXRA5Q6vwzM9vbKGRWlCQ=='";
    expected = {"signer":"EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==",
    "rotation":"QXqlf2WzYEqwxN1RBQRTFbOlBtvc6gZqlp54R47nov8j6fx8kAYdJXPlpFAFyrqfaNXRA5Q6vwzM9vbKGRWlCQ=="};
    assert.deepEqual(parseSignatureHeader(signature), expected);
});

// ================================================== //

it('Test checkConsensus', function() {
    /** Tests the checkConsensus function. */
    let data = [];
    let expected = /No comparable data found$/;
    assert.throws(() => checkConsensus(data), expected);

    data = [""];
    let level = 2;
    expected = /Level must be between 0 and 1$/;
    assert.throws(() => checkConsensus(data, level), expected);

    data = ["", ""];
    level = 1;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = [{}, {}];
    level = 1;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = [function(){}, function (){}];
    level = 1;
    expected = /Primitive or object expected$/;
    assert.throws(() => checkConsensus(data, level), expected);

    data = ["abc", "abc"];
    level = 1;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = [{"test": "test"}, {"test": "test"}];
    level = 1;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = ["abc", "efg"];
    level = 1;
    expected = false;
    assert.equal(checkConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}];
    level = 1;
    expected = false;
    assert.equal(checkConsensus(data, level), expected);

    data = ["abc", "abc", "efg"];
    level = 0.5;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = [{"test": "test"}, {"test": "test"}, {"testing": "testing"}];
    level = 0.5;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = ["abc", "efg", "efg"];
    level = 0.5;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}, {"testing": "testing"}];
    level = 0.5;
    expected = true;
    assert.equal(checkConsensus(data, level), expected);

    data = ["abc", "efg", "hij"];
    level = 0.5;
    expected = false;
    assert.equal(checkConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}, {"test": "testing"}];
    level = 0.5;
    expected = false;
    assert.equal(checkConsensus(data, level), expected);
});

// ================================================== //

it('Test getConsensus', function() {
    /** Tests the getConsensus function. */
    let data = [];
    let expected = /No comparable data found$/;
    assert.throws(() => getConsensus(data), expected);

    data = [""];
    let level = 2;
    expected = /Level must be between 0 and 1$/;
    assert.throws(() => getConsensus(data, level), expected);

    data = ["", ""];
    level = 1;
    expected = "";
    assert.equal(getConsensus(data, level), expected);

    data = [{}, {}];
    level = 1;
    expected = {};
    assert.deepEqual(getConsensus(data, level), expected);

    data = [function(){}, function (){}];
    level = 1;
    expected = /Primitive or object expected$/;
    assert.throws(() => getConsensus(data, level), expected);

    data = ["abc", "abc"];
    level = 1;
    expected = "abc";
    assert.equal(getConsensus(data, level), expected);

    data = [{"test": "test"}, {"test": "test"}];
    level = 1;
    expected = {"test": "test"};
    assert.deepEqual(getConsensus(data, level), expected);

    data = ["abc", "efg"];
    level = 1;
    expected = /Consensus unreached$/;
    assert.throws(() => getConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}];
    level = 1;
    expected = /Consensus unreached$/;
    assert.throws(() => getConsensus(data, level), expected);

    data = ["abc", "abc", "efg"];
    level = 0.5;
    expected = "abc";
    assert.equal(getConsensus(data, level), expected);

    data = [{"test": "test"}, {"test": "test"}, {"testing": "testing"}];
    level = 0.5;
    expected = {"test": "test"};
    assert.deepEqual(getConsensus(data, level), expected);

    data = ["abc", "efg", "efg"];
    level = 0.5;
    expected = "efg";
    assert.equal(getConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}, {"testing": "testing"}];
    level = 0.5;
    expected = {"testing": "testing"};
    assert.deepEqual(getConsensus(data, level), expected);

    data = ["abc", "efg", "hij"];
    level = 0.5;
    expected = /Consensus unreached$/;
    assert.throws(() => getConsensus(data, level), expected);

    data = [{"test": "test"}, {"testing": "testing"}, {"test": "testing"}];
    level = 0.5;
    expected = /Consensus unreached$/;
    assert.throws(() => getConsensus(data, level), expected);
});

// ================================================== //

it('Test makeDid', async function() {
    /** Tests the makeDid function. */
    let vk = "";
    let expected = "did:dad:";
    assert.equal(await makeDid(vk), expected);

    vk = "abc";
    expected = "did:dad:YWJj";
    assert.equal(await makeDid(vk), expected);


    vk = null;
    expected = new TypeError("input cannot be null or undefined");
    await makeDid(vk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    vk = new Uint8Array([70, 81, 79, 121, 66, 71, 103, 69, 120, 52, 89, 112, 52, 102, 78, 51, 54, 68, 117, 70, 109, 106,
        87, 49, 107, 55, 113, 75, 79, 86, 111, 101 ]);
    expected = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    assert.equal(await makeDid(vk), expected);

    vk = new Uint8Array([70, 81, 79, 121, 66, 71, 103, 69, 120, 52, 89, 112, 52, 102, 78, 51, 54, 68, 117, 70, 109, 106,
        87, 49, 107, 55, 113, 75, 79, 86, 111, 101 ]);
    let method = "test";
    expected = "did:test:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    assert.equal(await makeDid(vk, method), expected);
});

// ================================================== //

it('Test extractDidParts', function() {
    /** Tests the extractDidParts function. */
    let did = "";
    let expected = /Invalid DID value$/;
    assert.throws(() => extractDidParts(did), expected);

    did = "did:test:";
    expected = /Invalid DID method$/;
    assert.throws(() => extractDidParts(did), expected);

    did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    expected = "RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    assert.equal(extractDidParts(did), expected);

    did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    let method = "test";
    expected = /Invalid DID method$/;
    assert.throws(() => extractDidParts(did, method), expected);

    did = "did:test:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    method = "test";
    expected = "RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
    assert.equal(extractDidParts(did, method), expected);
});

// ================================================== //

it('Test generateKeyPair', async function() {
    /** Tests the generateKeyPair function. */
    let keypair = await generateKeyPair();
    assert.equal(keypair.length, 2);
    assert.equal(keypair[0].length, 64);
    assert.equal(keypair[1].length, 32);

    let seed = "";
    keypair = await generateKeyPair(seed);
    assert.equal(keypair.length, 2);
    assert.equal(keypair[0].length, 64);
    assert.equal(keypair[1].length, 32);

    seed = "a";
    let expected = new TypeError("invalid seed length");
    await generateKeyPair(seed).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    seed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
    expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,
        113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,
        134,159,167,151,183,94,25,189,11,128,151,39,237])];
    assert.deepEqual(await generateKeyPair(seed), expected);

    seed = new Uint8Array([1, 2, 3]);
    expected = new TypeError("invalid seed length");
    await generateKeyPair(seed).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    seed = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]);
    expected = [new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,143,4,132,
        2,32,133,243,119,209,249,189,67]), new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,
        162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67])];
    assert.deepEqual(await generateKeyPair(seed), expected);
});

// ================================================== //

it('Test signResource', async function () {
    /** Tests the signResource function. */
    let resource = "{}";
    let sk = "";
    let expected = new TypeError("invalid privateKey length");
    await signResource(resource, sk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    resource = "{}";
    sk = "abc";
    expected = new TypeError("invalid privateKey length");
    await signResource(resource, sk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    resource = "{}";
    sk = "kAzBIalx6KT22M0CJyw2RqDibDiR0wwPXl5he6SDOIMph7cj2l2W7zigQ2vneaf1";
    expected = "QpQkEmBLmC77ZT30I77sqw-gbkZGQSwC8OpCIA1p6OBdXxvycdW35a5_TgASrraRrLzQMg8bxZ-W-KEXLfTAAg==";
    assert.equal(await signResource(resource, sk), expected);

    resource = "test";
    sk = "kAzBIalx6KT22M0CJyw2RqDibDiR0wwPXl5he6SDOIMph7cj2l2W7zigQ2vneaf1";
    expected = "h6n48a7RgjHJNETKw82SWaNacYuS04ddc_lZtlijlG071GH0_90T2hyaprcBt2XM7VfKDjp2OnSteNNptFazDQ==";
    assert.equal(await signResource(resource, sk), expected);

    resource = "{\"test\":\"test\"}";
    sk = "kAzBIalx6KT22M0CJyw2RqDibDiR0wwPXl5he6SDOIMph7cj2l2W7zigQ2vneaf1";
    expected = "vSx_vvioFGre8WQYBuwTbeZZEMVrpa6ehuhaflZIGzwdC4tBZOu3QsWh6M013rkyXV1-61Fh7M2qZN3tpWsCBQ==";
    assert.equal(await signResource(resource, sk), expected);

    resource = "{}";
    sk = new Uint8Array([1, 2, 3]);
    expected = new TypeError("invalid privateKey length");
    await signResource(resource, sk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    resource = "{}";
    sk = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,143,4,132,
        2,32,133,243,119,209,249,189,67]);
    expected = "KimJSsBO98QTUdFdZlyPSvmVAhxs96jpBoUKrw4gFiRALvcko0MJNdI4MFuyHF6Leg9lKoL1x7xHKQxLl4sPAw==";
    assert.equal(await signResource(resource, sk), expected);

    resource = "test";
    sk = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,143,4,132,
        2,32,133,243,119,209,249,189,67]);
    expected = "mu7U-ku9bGeksbRYXqWZIJciVTVdcedBgmeXieiADvK0R95NissWICIMBAjzDIwOu_7yIjKMqPODGpEbNcCpBw==";
    assert.equal(await signResource(resource, sk), expected);

    resource = "{\"test\":\"test\"}";
    sk = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,143,4,132,
        2,32,133,243,119,209,249,189,67]);
    expected = "Sr0U_VLeXIxVgzjvFt0syudWw39ox3Yn2MAJQ5oNiUwIpHY_BwlJzM5R2UE81rxi2d_fkJs-uydWM8uoOW86Ag==";
    assert.equal(await signResource(resource, sk), expected);
});

// ================================================== //

it('Test verify', async function () {
    /** Tests the verify function. */
    let signature = new Uint8Array([]);
    let message = "";
    let vk = new Uint8Array([]);
    let expected = new TypeError("invalid publicKey length");
    await verify(signature, message, vk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    signature = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,
        208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,155,184,49,132,74,
        177,123,242,187,69,247,206,115,8]);
    message = "{\"test\":\"test\"]}";
    vk = new Uint8Array([98,108,127,209,24,183,46,123,174,159,230,239,27,247,0,223,107,244,26,141,202,49,22,123,245,228,
        62,1,68,10,226,107]);
    expected = new Error("incorrect signature for the given public key");
    await verify(signature, message, vk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    signature = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,
        208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,155,184,49,132,74,
        177,123,242,187,69,247,206,115,8]);
    message = "{\"id\":\"did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\",\"changed\":" +
        "\"2018-07-04T01:46:56-06:00\",\"signer\":0,\"signers\":[\"Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\"," +
        "\"8qOLfvSJfuDX2YjKh_BAUwSRD-TnDLhEpn9zP7cwf6Q=\"]}";
    vk = new Uint8Array([98,108,127,209,24,183,46,123,174,159,230,239,27,247,0,223,107,244,26,141,202,49,22,123,245,228,
        62,1,68,10,226,107]);
    expected = true;
    assert.equal(await verify(signature, message, vk), expected);
});

// ================================================== //

it('Test verify64u', async function () {
    /** Tests the verify64u function. */
    let signature = "";
    let message = "";
    let vk = "";
    let expected = new TypeError("invalid publicKey length");
    await verify64u(signature, message, vk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    signature = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
    message = "{\"test\":\"test\"]}";
    vk = "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=";
    expected = new Error("incorrect signature for the given public key");
    await verify64u(signature, message, vk).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    signature = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
    message = "{\"id\":\"did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\",\"changed\":" +
        "\"2018-07-04T01:46:56-06:00\",\"signer\":0,\"signers\":[\"Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\"," +
        "\"8qOLfvSJfuDX2YjKh_BAUwSRD-TnDLhEpn9zP7cwf6Q=\"]}";
    vk = "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=";
    expected = true;
    assert.equal(await verify64u(signature, message, vk), expected);
});

// ================================================== //

it('Test toBase64', async function () {
    /** Tests the toBase64 function. */
    let key = "";
    let expected = "";
    assert.equal(await toBase64(key), expected);

    key = "abc";
    expected = "YWJj";
    assert.equal(await toBase64(key), expected);

    key = new Uint8Array([]);
    expected = "";
    assert.equal(await toBase64(key), expected);

    key = new Uint8Array([1, 2, 3]);
    expected = "AQID";
    assert.equal(await toBase64(key), expected);

    key = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,
        208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,155,184,49,132,74,
        177,123,242,187,69,247,206,115,8]);
    expected = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
    assert.equal(await toBase64(key), expected);
});

// ================================================== //

it('Test fromBase64', async function () {
    /** Tests the fromBase64 function. */
    let key = "";
    let expected = new Uint8Array([]);
    let padding = 0;
    assert.deepEqual(await fromBase64(key, padding), expected);

    key = "YWJj";
    expected = new Uint8Array([ 97, 98, 99 ]);
    padding = 0;
    assert.deepEqual(await fromBase64(key, padding), expected);

    key = "YW";
    expected = new Error("invalid input");
    padding = 0;
    await fromBase64(key, padding).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    key = "";
    expected = new Uint8Array([]);
    padding = 0;
    assert.deepEqual(await fromBase64(key, padding), expected);

    key = "AQID";
    expected = new Uint8Array([1, 2, 3]);
    padding = 0;
    assert.deepEqual(await fromBase64(key, padding), expected);

    key = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
    expected = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,
        208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,155,184,49,132,74,
        177,123,242,187,69,247,206,115,8]);
    assert.deepEqual(await fromBase64(key), expected);

    key = "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=";
    expected = new Uint8Array([98,108,127,209,24,183,46,123,174,159,230,239,27,247,0,223,107,244,26,141,202,49,22,123,
        245,228,62,1,68,10,226,107]);
    padding = 1;
    assert.deepEqual(await fromBase64(key, padding), expected);
});

// ================================================== //

it('Test keyInceptionEvent', async function () {
    /** Tests the keyInceptionEvent function. */
    let options = {};
    let keypairs = await keyInceptionEvent(options);
    assert.equal(keypairs[0][0].length, 64);
    assert.equal(keypairs[0][1].length, 32);
    assert.equal(keypairs[1][0].length, 64);
    assert.equal(keypairs[1][1].length, 32);

    options = {};
    options.currentSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
    let expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,
        55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,
        216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypairs = await keyInceptionEvent(options);
    assert.deepEqual(keypairs[0], expected);
    assert.notDeepEqual(keypairs[1], expected);
    assert.equal(keypairs[1][0].length, 64);
    assert.equal(keypairs[1][1].length, 32);

    options = {};
    options.preRotatedSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
    expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,
        113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,
        134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypairs = await keyInceptionEvent(options);
    assert.deepEqual(keypairs[1], expected);
    assert.notDeepEqual(keypairs[0], expected);
    assert.equal(keypairs[0][0].length, 64);
    assert.equal(keypairs[0][1].length, 32);

    options = {};
    options.currentKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,
        87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,
        167,151,183,94,25,189,11,128,151,39,237]), new Uint8Array([])];
    expected = new Error("Invalid current public key");
    await keyInceptionEvent(options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.currentKeyPair = [new Uint8Array([]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,
        24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = new Error("Invalid current private key");
    await keyInceptionEvent(options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.currentKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,
        87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,
        167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,
        24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,
        113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,
        134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypairs = await keyInceptionEvent(options);
    assert.deepEqual(keypairs[0], expected);
    assert.notDeepEqual(keypairs[1], expected);
    assert.equal(keypairs[1][0].length, 64);
    assert.equal(keypairs[1][1].length, 32);

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]), new Uint8Array([])];
    expected = new Error("Invalid pre-rotated public key");
    await keyInceptionEvent(options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,
        88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = new Error("Invalid pre-rotated private key");
    await keyInceptionEvent(options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,
        113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,
        134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypairs = await keyInceptionEvent(options);
    assert.deepEqual(keypairs[1], expected);
    assert.notDeepEqual(keypairs[0], expected);
    assert.equal(keypairs[0][0].length, 64);
    assert.equal(keypairs[0][1].length, 32);

    options = {};
    options.post = true;
    options.urls = ["http://127.0.0.1:8080/"];
    options.currentKeyPair = [new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]), new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,
        178,93,243,193,162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67])];
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = [[new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]), new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,
        178,93,243,193,162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67])], [new Uint8Array([70,81,79,121,66,71,
        103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,
        127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237]),
        new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,
        189,11,128,151,39,237])]];
    keypairs = await keyInceptionEvent(options);
    assert.deepEqual(keypairs, expected);


    let url = "http://127.0.0.1:8080/";
    let did = await makeDid(keypairs[0][1]);
    let vk1 = await toBase64(keypairs[0][1]);
    let vk2 = await toBase64(keypairs[1][1]);
    let history = await getHistory(url, did);
    assert.equal(history.history.id, did);
    assert.equal(history.history.signer, 0);
    assert.deepEqual(history.history.signers, [vk1, vk2]);

    let data = {"id": did};
    let signature = await signResource(JSON.stringify(data), keypairs[0][0]);
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url)
});

// ================================================== //

it('Test keyRotationEvent', async function () {
    /** Tests the keyRotationEvent function. */
    let oldCurrentKey = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]);
    let newCurrentKey = new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]);
    let did = await makeDid(new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,
        143,4,132,2,32,133,243,119,209,249,189,67]));
    let options = {};
    let keypair = await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options);
    assert.equal(keypair[0].length, 64);
    assert.equal(keypair[1].length, 32);

    options = {};
    options.seed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
    let expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,
        55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
        94,25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,
        216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypair = await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options);
    assert.deepEqual(keypair, expected);

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]), new Uint8Array([])];
    expected = new Error("Invalid pre-rotated public key");
    await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,
        88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = new Error("Invalid pre-rotated private key");
    await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options).catch(function (error) {
        assert.deepEqual(error, expected);
    });

    options = {};
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,
        113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
        25,189,11,128,151,39,237]), new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,
        134,159,167,151,183,94,25,189,11,128,151,39,237])];
    keypair = await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options);
    assert.deepEqual(keypair, expected);

    options = {};
    options.post = true;
    options.urls = ["http://127.0.0.1:8080/"];
    options.currentKeyPair = [new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]), new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,
        178,93,243,193,162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67])];
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    let keypairs = await keyInceptionEvent(options);

    await timeout(1000);
    options = {};
    options.post = true;
    options.urls = ["http://127.0.0.1:8080/"];
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    expected = [new Uint8Array([70,81,79,121,66,71,
        103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,
        127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237]),
        new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,
        189,11,128,151,39,237])];
    keypair = await keyRotationEvent(oldCurrentKey, newCurrentKey, did, options);
    assert.deepEqual(keypair, expected);

    let url = "http://127.0.0.1:8080/";
    let vk1 = await toBase64(keypairs[0][1]);
    let vk2 = await toBase64(keypairs[1][1]);
    let history = await getHistory(url, did);
    assert.equal(history.history.id, did);
    assert.equal(history.history.signer, 1);
    assert.deepEqual(history.history.signers, [vk1, vk2, vk2]);

    let data = {"id": did};
    let signature = await signResource(JSON.stringify(data), keypair[0]);
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url);
});

// ================================================== //

it('Test keyRevocationEvent', async function () {
    /** Tests the keyRevocationEvent function. */
    let options = {};
    options.post = true;
    options.urls = ["http://127.0.0.1:8080/"];
    options.currentKeyPair = [new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]), new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,
        178,93,243,193,162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67])];
    options.preRotatedKeyPair = [new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]),new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,
        50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237])];
    let keypairs = await keyInceptionEvent(options);

    await timeout(1000);
    options = {};
    options.urls = ["http://127.0.0.1:8080/"];
    let oldCurrentKey = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
        179,79,143,4,132,2,32,133,243,119,209,249,189,67]);
    let newCurrentKey = new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
        106,87,49,107,55,113,75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
        159,167,151,183,94,25,189,11,128,151,39,237]);
    let did = await makeDid(new Uint8Array([178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,
        143,4,132,2,32,133,243,119,209,249,189,67]));
    let result = await keyRevocationEvent(oldCurrentKey, newCurrentKey, did, options);
    let expected = true;
    assert.equal(result, expected);

    let url = "http://127.0.0.1:8080/";
    let vk1 = await toBase64(keypairs[0][1]);
    let vk2 = await toBase64(keypairs[1][1]);
    let history = await getHistory(url, did);
    assert.equal(history.history.id, did);
    assert.equal(history.history.signer, 2);
    assert.deepEqual(history.history.signers, [vk1, vk2, null]);

    let data = {"id": did};
    let signature = "null";
    signature = "signer=\"" + signature + "\";";
    await deleteHistory(signature, data, did, url);
});

// ================================================== //
//                        EOF                         //
// ================================================== //