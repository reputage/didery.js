#########
getRelays
#########
This function uses fetch to hit the GET relays endpoint of a didery server. The GET relays endpoint returns trusted
servers. This functions is asynchronous.

Parameters
==========
getRelays has one optional parameter. It is a string for the server's base URL. The default base URL is the
localhost at port 8080.

Return
======
getRelays returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   didery.getRelays(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });


