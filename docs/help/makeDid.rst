#######
makeDid
#######
This function creates a DID string from a provided public key. DID's can be created for varying method types. This
function is asynchronous.

Parameters
==========
makeDid takes one Uint8Array of a 32 byte verifier key from EdDSA (Ed25519) key pair. There is also an optional
parameter for the DID method. This is a string that will be saved in the DID under the DID method. The default DID
method is "dad".

Return
======
makeDid returns a promise that when fulfilled returns a DID string of the format:
``did:method:base64_encoded_public_key``.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let vk = new Uint8Array([70, 81, 79, 121, 66, 71, 103, 69, 120, 52, 89, 112, 52, 102, 78, 51, 54, 68, 117, 70, 109,
   106, 87, 49, 107, 55, 113, 75, 79, 86, 111, 101 ]);
   didery.makeDid(vk).then(function (response) {
        console.log(response);
   });
   // "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="

   vk = new Uint8Array([70, 81, 79, 121, 66, 71, 103, 69, 120, 52, 89, 112, 52, 102, 78, 51, 54, 68, 117, 70, 109, 106,
   87, 49, 107, 55, 113, 75, 79, 86, 111, 101 ]);
   let method = "rep";
   didery.makeDid(vk).then(function (response) {
           console.log(response);
   });
   // "did:rep:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="