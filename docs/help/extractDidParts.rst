###############
extractDidParts
###############
This function parses the out the public key from a DID.

Parameters
==========
extractDidParts takes a DID string. There is also an optional parameter for the DID method. The default did method is
"dad". If the specified method does not match the DID method an error will be thrown.

Return
======
extractDidParts returns the public key string from a DID.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
   let result = didery.extractDidParts(did);
   console.log(result);
   // "RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="

   did = "did:rep:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
   let method = "rep"
   result = didery.extractDidParts(did, method);
   console.log(result);
   // "RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="

   did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
   let method = "rep"
   result = didery.extractDidParts(did, method);
   console.log(result);
   // Error: Invalid DID method