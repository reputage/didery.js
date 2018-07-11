##################
batchDeleteHistory
##################
This function uses fetch to hit the DELETE history endpoint of multiple didery servers. The DELETE history endpoint
deletes a specific key history. Verification data will be checked against the given signature. If any discrepancies are
found the operation will fail. This function is asynchronous.

Parameters
==========
batchDeleteHistory has four required parameters. First is a signature string that will be placed in the required signature
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
Third is a did parameter that takes a DID string. Fourth is a urls parameter that takes an array of URL strings.

Return
======
batchDeleteHistory returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ];
   let signature = 'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";' +
                   'rotation="h6n48a7RgjHJNETKw82SWaNacYuS04ddc_lZtlijlG071GH0_90T2hyaprcBt2XM7VfKDjp2OnSteNNptFazDQ==";';
   let data = {
        "id": "did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms="
   };
   didery.batchDeleteHistory(signature, data, urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });