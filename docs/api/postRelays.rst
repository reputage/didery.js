##########
postRelays
##########
This function uses fetch to hit the POST relays endpoint of a didery server. The POST relays endpoint saves new trusted
servers. This function is asynchronous.

Parameters
==========
postRelays has one required data parameter. It takes an object and should have the following format:
::
  {
      "changed": datetime string,
      "host_address": URL string,
      "main": boolean,
      "name": name string,
      "port": port string
  }
There is also an optional base URL parameter. This is a string of the server's base URL. The default base URL is the
localhost at port 8080.

Return
======
postRelays returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   let data = {
       "changed": "2000-01-01T00:00:00+00:00",
       "host_address": "127.0.0.1",
       "main": true,
       "name": "alpha",
       "port": "7541"
   }
   didery.postRelays(data, baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });