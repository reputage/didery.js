############
signResource
############
This function uses libsodium to sign a stringified resource with a private key. This function is asynchronous.

Parameters
==========
signResource has two parameters. The first is the string of the resource to be signed. The second is a Uint8Array or
an un-encoded key string of the signing private key.

Return
======
signResource returns a promise that when fulfilled returns a base64 encoded signature string.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let resource = "{\"test\":\"test\"}";
   let sk = new Uint8Array([167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,
                            25,189,11,128,151,39,237,178,213,80,122,33,83,170,168,209,242,204,97,178,93,243,193,162,247,
                            179,79,143,4,132,2,32,133,243,119,209,249,189,67]);
   didery.signResource(resource, sk).then(function (response) {
        console.log(response);
   });
   // "Sr0U_VLeXIxVgzjvFt0syudWw39ox3Yn2MAJQ5oNiUwIpHY_BwlJzM5R2UE81rxi2d_fkJs-uydWM8uoOW86Ag=="

   resource = "{\"test\":\"test\"}";
   sk = "kAzBIalx6KT22M0CJyw2RqDibDiR0wwPXl5he6SDOIMph7cj2l2W7zigQ2vneaf1";
   didery.signResource(resource, sk).then(function (response) {
        console.log(response);
   });
   // "vSx_vvioFGre8WQYBuwTbeZZEMVrpa6ehuhaflZIGzwdC4tBZOu3QsWh6M013rkyXV1-61Fh7M2qZN3tpWsCBQ=="