###############
batchGetHistory
###############
This function uses fetch to hit the GET history endpoint of multiple didery servers. The GET history endpoint returns
key histories. This functions is asynchronous.

Parameters
==========
batchGetHistory has one required urls parameters. This takes an array of URL strings. There is also an optional did
parameter. This takes a DID string, and if supplied, batchGetHistory will retrieve the key history for that
DID. The default DID string is an empty string. If no DID string is provided, batchGetHistory will retrieve all key
histories.

Return
======
batchGetHistory returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   didery.batchGetHistory(urls).then(function (response) {
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
   didery.batchGetHistory(urls, did).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });