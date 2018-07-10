##########
getHistory
##########
This function uses fetch to hit the GET history endpoint of a didery server. The GET history endpoint returns key
histories. This functions is asynchronous.

Parameters
==========
getHistory has two optional parameters. First is a string for the server's base URL. The default base URL is the
localhost at port 8080. Second is a DID string. If this is supplied, getHistory will retrieve the key history for that
DID. The default DID string is an empty string. If no DID string is provided, getHistory will retrieve all key
histories.

Return
======
getHistory returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   didery.getHistory(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });

   baseURL = "http://127.0.0.1:8000";
   let did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U="
   didery.getHistory(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });


