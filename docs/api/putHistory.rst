##########
putHistory
##########
This function uses fetch to hit the PUT history endpoint of a didery server. The PUT endpoint should only be used for
key rotation and revocation events. Data put to the server will be verified against signatures and old key history. If
any discrepancies are found the operation will fail. This function is asynchronous.

Parameters
==========
putHistory has three required parameters. First is a signature string that will be placed in the required signature
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
Third is a DID string. There is also an optional base URL parameter. This is a string of the server's base URL. The
default base URL is the localhost at port 8080.

Return
======
putHistory returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
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
   }
   didery.putHistory(signature, data, baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });