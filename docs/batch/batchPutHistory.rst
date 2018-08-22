###############
batchPutHistory
###############
This function uses fetch to hit the PUT history endpoint of multiple didery servers. The POST history endpoint updates
key histories The PUT endpoint should only be used for key rotation and revocation events. Data put to the servers will
be verified against signatures and old key history. If any discrepancies are found the operation will fail. This
function is asynchronous.

Parameters
==========
batchPutHistory has four required parameters. First is a signature string that will be placed in the required signature
header. This string should be of the format:
::
  'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";' +
  'rotation="QpQkEmBLmC77ZT30I77sqw-gbkZGQSwC8OpCIA1p6OBdXxvycdW35a5_TgASrraRrLzQMg8bxZ-W-KEXLfTAAg==";'
or:
::
  'signer="AeYbsHot0pmdWAcgTo5sD8iAuSQAfnH5U6wiIGpVNJQQoYKBYrPPxAoIc1i5SHCIDS8KFFgf8i0tDq8XGizaCg==";' +
  'rotation="QpQkEmBLmC77ZT30I77sqw-gbkZGQSwC8OpCIA1p6OBdXxvycdW35a5_TgASrraRrLzQMg8bxZ-W-KEXLfTAAg==";' +
  'kind="ed25519"; ...'
Second is an object containing the data to be posted. This data object should be of the format:
::
  {
      "id": DID string,
      "changed": datetime string,
      "signer": integer representing the current key index,
      "signers": [old public key, ..., current public key, pre-rotated public key]
  }
Third is a did parameter that takes a DID string. Fourth is a urls parameter that takes an array of URL strings.

Return
======
batchPutHistory returns a promise that when fulfilled returns the servers' responses to the fetch operations.

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
        "id": "did:dad:Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=",
        "changed": "2018-07-04T01:46:56-06:00",
        "signer": 1,
        "signers": [
            "Ymx_0Ri3Lnuun-bvG_cA32v0Go3KMRZ79eQ-AUQK4ms=",
            "8qOLfvSJfuDX2YjKh_BAUwSRD-TnDLhEpn9zP7cwf6Q=",
            "kAzBIalx6KT22M0CJyw2RqDibDiR0wwPXl5he6SDOIM="
        ]
   };
   didery.batchPutHistory(signature, data, urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });