#############
batchGetBlobs
#############
This function uses fetch to hit the GET blobs endpoint of multiple didery servers. The GET blobs endpoint returns
encrypted private key blobs.This functions is asynchronous.

Parameters
==========
batchGetBlobs has one required urls parameters. This takes an array of URL strings. There is also an optional did
parameter. This takes a DID string, and if supplied, batchGetBlobs will retrieve the encrypted blobs for that DID. The
default DID string is an empty string. If no DID string is provided, batchGetBlobs will retrieve all encrypted blobs.

Return
======
batchGetBlobs returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   didery.batchGetBlobs(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });

   urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   let did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="
   didery.batchGetBlobs(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });