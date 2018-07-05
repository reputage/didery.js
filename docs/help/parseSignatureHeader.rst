####################
parseSignatureHeader
####################
This function parses the signature header for a key inception or rotation event. Signature headers follow the format:
::
  Signature: headervalue

Where headervalue has the format:
::
  tag = "signature"
       or
  tag = "signature"; tag = "signature"; ...

"tag" is the name of a field in the body of the request whose value is a DID from which the public key for the
signature can be obtained. If the same tag appears multiple times then only the last occurrence is returned.
Each signature value is a doubly quoted string that contains the actual signature in Base64 url safe format. By
default the signatures are EdDSA (Ed25519) which are 88 characters long (with two trailing pad bytes) that
represent 64 byte EdDSA signatures. An optional tag name = "kind" with values "EdDSA" or "Ed25519" may be present
that specifies the type of signature. All signatures within the header must be of the same kind.

Parameters
==========
parseSignatureHeader takes one string. The given string should be a signature to be parsed.

Return
======
parseSignatureHeader returns an object with the format:
::
  {
    "parsed tag": "parsed value",
    "parsed tag": "parsed value",
    ...
  }

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let signature = "signer='EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==';";
   let result = didery.parseSignatureHeader(signature);
   console.log(result);
   // {"signer": "EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw=="}

   signature = "signer='EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==';" +
               "rotation='QXqlf2WzYEqwxN1RBQRTFbOlBtvc6gZqlp54R47nov8j6fx8kAYdJXPlpFAFyrqfaNXRA5Q6vwzM9vbKGRWlCQ=='";
   result = didery.parseSignatureHeader(signature);
   console.log(result);
   // {
   //   "signer": "EPk0ZVCWToPu8RhTDR2WrXtrPbP5hikbrEEew0J6cnFwbvzSAF41148o4VX9ziTf-fJH_vsp1dpq0YoL33OBBw==",
   //   "rotation":"QXqlf2WzYEqwxN1RBQRTFbOlBtvc6gZqlp54R47nov8j6fx8kAYdJXPlpFAFyrqfaNXRA5Q6vwzM9vbKGRWlCQ=="
   // }
