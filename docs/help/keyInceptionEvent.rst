#################
keyInceptionEvent
#################
This function performs a key inception event. In an inception event two keys pairs are created (either manually or
automatically generated). The first key pair represents the current key which can be used to sign data. The second key
pair represents the pre-rotated key which will replace the current key on a rotation event. An immutable DID is also
created from the current key pair. This is used to prove data prominance and track key history. This function also
contains a number of options for managing the newly created key pairs and DID. One can post the key data to one or more
didery servers, as well as show or save the private keys and DID.

Parameters
==========
keyInceptionEvent has one optional parameter which is an object containing various options. The possible options are as
follows:

+------------------+---------------------------------------------------------------------------------------------------+
|      Option      |                                            Description                                            |
+==================+===================================================================================================+
|currentSeed       |A 32 byte Uint8Array or string used as seed for current key pair generation.                       |
+------------------+---------------------------------------------------------------------------------------------------+
|preRotatedSeed    |A 32 byte Uint8Array or string used as seed for pre-rotated key pair generation.                   |
+------------------+---------------------------------------------------------------------------------------------------+
|currentKeyPair    |An array with a 64 byte Uint8Array of a private key and 32 byte Uint8Array of a public key. This   |
|                  |key pair will be used as the current key pair.                                                     |
+------------------+---------------------------------------------------------------------------------------------------+
|preRotatedKeyPair |An array with a 64 byte Uint8Array of a private key and 32 byte Uint8Array of a public key. This   |
|                  |key pair will be used as the pre-rotated key pair.                                                 |
+------------------+---------------------------------------------------------------------------------------------------+
|post              |A boolean for whether or not key data should be posted to a didery server.                         |
+------------------+---------------------------------------------------------------------------------------------------+
|urls              |An array of comma separated server URLs strings.                                                   |
+------------------+---------------------------------------------------------------------------------------------------+
|saveCurrent       |A boolean for whether or not the current private key should be saved somewhere. If true a storage  |
|                  |location must be provided.                                                                         |
+------------------+---------------------------------------------------------------------------------------------------+
|savePreRotated    |A boolean for whether or not the pre-rotated private key should be saved somewhere. If true a      |
|                  |storage location must be provided.                                                                 |
+------------------+---------------------------------------------------------------------------------------------------+
|saveDid           |A boolean for whether or not the DID should be saved somewhere. If true a storage location must be |
|                  |provided.                                                                                          |
+------------------+---------------------------------------------------------------------------------------------------+
|storageCurrent    |The current private key storage location; Accepted values include "local", "session" or "download".|
+------------------+---------------------------------------------------------------------------------------------------+
|storagePreRotated |The pre-rotated private key storage location; Accepted values include "local", "session" or        |
|                  |"download".                                                                                        |
+------------------+---------------------------------------------------------------------------------------------------+
|storageDid        |The DID storage location; Accepted values include "local", "session" or "download".                |
+------------------+---------------------------------------------------------------------------------------------------+
|showCurrent       |A boolean for whether or not to show the current private key in an alert.                          |
+------------------+---------------------------------------------------------------------------------------------------+
|showPreRotated    |A boolean for whether or not to show the pre-rotated private key in an alert.                      |
+------------------+---------------------------------------------------------------------------------------------------+
|showDid           |A boolean for whether or not to show the DID in an alert.                                          |
+------------------+---------------------------------------------------------------------------------------------------+

Return
======
keyInceptionEvent returns a promise that when fulfilled returns an array with the current key pair and the pre-rotated
key pair: ``[[[Uint8Array[current private], [Uint8Array[current public]], [[Uint8Array[pre-rotated private],
[Uint8Array[pre-rotated public]]]``.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let options = {};
   options.currentSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
   options.preRotatedSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
   didery.keyInceptionEvent(options).then(function (response) {
        console.log(response);
   });
   // [[Uint8Array[70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,75,79,86,
   // 111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,
   // 151,39,237], Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
   // 94,25,189,11,128,151,39,237]], [Uint8Array[70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
   // 106,87,49,107,55,113,75,79,86,111, 101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
   // 159,167,151,183,94,25,189,11,128,151,39,237], Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,
   // 161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237]]]

   options = {};
   options.currentSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
   options.preRotatedSeed = "FQOyBGgEx4Yp4fN36DuFmjW1k7qKOVoe";
   options.post = true;
   options.urls = ["http://127.0.0.1:8080/"];
   options.saveCurrent = true;
   options.savePreRotated = true;
   options.saveDid = true;
   options.storageCurrent = "local";
   options.storagePreRotated = "local";
   options.storageDid ="local";
   options.showCurrent = false;
   options.showPreRotated = false;
   options.showDid = false;
   didery.keyInceptionEvent(options).then(function (response) {
        console.log(response);
   });
   // [[Uint8Array[70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,75,79,86,
   // 111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,94,25,189,11,128,
   // 151,39,237], Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,159,167,151,183,
   // 94,25,189,11,128,151,39,237]], [Uint8Array[70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,
   // 106,87,49,107,55,113,75,79,86,111, 101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
   // 159,167,151,183,94,25,189,11,128,151,39,237], Uint8Array[167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,
   // 161,11,216,134,159,167,151,183,94,25,189,11,128,151,39,237]]]