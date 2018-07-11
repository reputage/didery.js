############
deleteRelays
############
This function uses fetch to hit the DELETE relays endpoint of a didery server. The DELETE relays endpoint deletes
trusted server data. This function is asynchronous.

Parameters
==========
deleteRelays has one required uid parameter. It takes the string of a relay's uid. There is also an optional base URL
parameter. This is a string of the server's base URL. The default base URL is the localhost at port 8080.

Return
======
deleteRelays returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   let uid = "1";
   didery.deleteRelays(uid, baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });