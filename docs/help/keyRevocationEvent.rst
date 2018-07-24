##################
keyRevocationEvent
##################
This function performs a key revocation event. In a revocation event a key is revoked by rotating to a null key. After a
revocation event the current key can no longer be used to sign data. The pre-rotated key also becomes void and can no
longer be rotated to. Revocation does not delete a key history. Data provenance can therefore still be verified using
the revoked key's history.

Parameters
==========
keyRevocationEvent has three required parameters. The first is a 64 byte Uint8Array of the current private key, the
second is a 64 byte Uint8Array of the pre-rotated key, and the third is the DID string associated with the given keys.
This function also has one optional parameter which is an object containing various options. The possible options are as
follows:

+------------------+---------------------------------------------------------------------------------------------------+
|      Option      |                                            Description                                            |
+==================+===================================================================================================+
|consensus         |A float between 0 and 1 for the consensus threshold used when retrieving key history (key history  |
|                  |is only retrieved when posting data).                                                              |
+------------------+---------------------------------------------------------------------------------------------------+
|urls              |An array of comma separated server URLs strings.                                                   |
+------------------+---------------------------------------------------------------------------------------------------+

Return
======
keyRevocationEvent returns true if the revocation was successful or throws an error if the revocation failed.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let currentKey = new Uint8Array([70,81,79,121,66,71,103,69,120,52,89,112,52,102,78,51,54,68,117,70,109,106,87,49,107,55,113,
                             75,79,86,111,101,167,185,202,28,236,26,127,61,230,20,129,200,113,50,88,24,161,11,216,134,
                             159,167,151,183,94,25,189,11,128,151,39,237]);
   let preRotatedKey = new Uint8Array([188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,208,
                             176,15,83,159,113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,
                             155,184,49,132,74,177,123,242,187,69,247,206,115,8]);
   let did = "did:dad:wqfCucOKHMOsGn89w6YUwoHDiHEyWBjCoQvDmMKGwp="
   let options = {};
   options.consensus = 0.75;
   options.urls = ["http://127.0.0.1:8080/"];
   didery.keyRevocationEvent(currentKey, preRotatedKey, did, options).then(function (response) {
        console.log(response);
   });
   // true
