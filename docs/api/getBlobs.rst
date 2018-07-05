########
getBlobs
########
This function uses fetch to hit the GET blobs endpoint of a didery server. The GET blobs endpoint returns encrypted
private key blobs.This functions is asynchronous.

Parameters
==========
getBlobs has two optional parameters. First is a string for the server's base URL. The default base URL is the localhost
at port 8080. Second is a DID string. If this is supplied, getHistory will retrieve the key history for that DID. The
default DID string is an empty string. If no DID string is provided, getBlobs will retrieve all encrypted key blobs.

Return
======
get Blobs returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   didery.getBlobs(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });

   baseURL = "http://127.0.0.1:8000";
   let did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="
   didery.getBlobs(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });