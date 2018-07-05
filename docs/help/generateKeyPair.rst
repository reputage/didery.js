###############
generateKeyPair
###############
This function uses libsodium to generate an ed25519 key pair. This function is asynchronous.

Parameters
==========
generateKeyPair has one optional seed parameter. This seed should be 32 bytes and can be either a Uint8Array or a base64
encoded string.

Return
======
generateKeyPair returns a promise that when fulfilled returns an array of the format: ``[Uint8Array[privateKey],
Uint8Array[publicKey]]``.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let seed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
   didery.generateKeyPair(seed).then(function(response) {
        console.log(response);
   });
   // [Uint8Array[70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,75,79,86,
   //             111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,
   //             189,11,128,151,39,237], Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,
   //             216,134,159,167,151,183,94,25,189,11,128,151,39,237]];

   seed = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,
   189,11,128,151,39,237]);
   didery.generateKeyPair(seed).then(function(response) {

   });
   // [Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,
   //             128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,179,79,143,4,132,2,
   //             32,133,243,119,209,249,189,67], Uint8Array[178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,
   //             162,247,179,79,143,4,132,2,32,133,243,119,209,249,189,67]];



