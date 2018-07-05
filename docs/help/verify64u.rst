#########
verify64u
#########
This function checks if a signature for a given message can be verified with a provided verification key. This function
is asynchronous.

Parameters
==========
verify64u has three parameters. The first is a base64 encoded string of the signature, the second is a string of the
signed resource, and the third is a base64 encoded string of the verification key.

Return
======
verify64u returns a promise that fulfills and returns true if the signature can be verified. Otherwise, the promise is
rejected and throws and error.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let signature = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
   let message = "{\"id\":\"did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\",\"changed\":" +
                 "\"2018-07-04T01:46:56-06:00\",\"signer\":0,\"signers\":"+
                 "[\"Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=\"," +
                 "\"8qOLfvSJfuDX2YjKh_BAUwSRD-TnDLhEpn9zP7cwf6Q=\"]}";
   let vk = "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=";
   didery.verify64u(signature, message, vk).then(function (response) {
        console.log(response);
   }).catch(function (error) {
        console.error(error);
   });
   // true;

   signature = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA==";
   message = "{\"test\":\"test\"]}";
   vk = "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=";
   didery.verify64u(signature, message, vk).then(function (response) {
        console.log(response);
   }).catch(function (error) {
       console.error(error);
   });
   // Error: incorrect signature for the given public key