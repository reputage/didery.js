#############
deleteHistory
#############
This function uses fetch to hit the DELETE history endpoint of a didery server. The DELETE history endpoint deletes a
specific key history. Verification data will be checked against the given signature. If any discrepancies are found the
operation will fail. This function is asynchronous.

Parameters
==========
deleteHistory has three required parameters. First is a signature string that will be placed in the required signature
header. This string should be of the format:
::
  'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";'
or:
::
  'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";' +
  'kind="ed25519"; ...'
Second is an object containing the DID verification data. This data object should be of the format:
::
  {
      "id": DID string
  }
Third is a DID string. There is also an optional base URL parameter. This is a string of the server's base URL. The
default base URL is the localhost at port 8080.

Return
======
deleteHistory returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   let signature = 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";';
   let data = {
        "id": "did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms="
   }
   didery.deleteHistory(signature, data, baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });