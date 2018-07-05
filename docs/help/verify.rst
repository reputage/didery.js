######
verify
######
This function checks if a signature for a given message can be verified with a provided verification key. This function
is asynchronous.

Parameters
==========
verify has three parameters. The first is a Uint8Array of the signature, the second is a string of the signed resource,
and the third is a Uint8Array of the verification key.

Return
======
verify returns a promise that fulfills and returns true if the signature can be verified. Otherwise, the promise is
rejected and throws and error.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let signature = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,
                                   226,208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,
                                   40,58,154,52,155,184,49,132,74,177,123,242,187,69,247,206,115,8]);
   let message = "{\"id\":\"did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\",\"changed\":" +
                 "\"2018-07-04T01:46:56-06:00\",\"signer\":0,\"signers\":" +
                 "[\"Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\"," +
                 "\"8qOLfvSJfuDX2YjKh_BAUwSRD-TnDLhEpn9zP7cwf6Q=\"]}";
   let vk = new Uint8Array([98,108,127,209,24,183,46,123,174,159,230,239,27,247,0,223,107,244,26,141,202,49,22,123,245,
                            228,62,1,68,10,226,107]);
   didery.verify(signature, message, vk).then(function (response) {
        console.log(response);
   }).catch(function (error) {
        console.error(error);
   });
   // true;

   signature = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,
                               208,176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,
                               154,52,155,184,49,132,74,177,123,242,187,69,247,206,115,8]);
   message = "{\"test\":\"test\"]}";
   vk = new Uint8Array([98,108,127,209,24,183,46,123,174,159,230,239,27,247,0,223,107,244,26,141,202,49,22,123,245,228,
                        62,1,68,10,226,107]);
   didery.verify(signature, message, vk).then(function (response) {
        console.log(response);
   }).catch(function (error) {
        console.error(error);
   });
   // Error: incorrect signature for the given public key