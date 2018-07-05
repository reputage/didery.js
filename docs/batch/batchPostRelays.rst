###############
batchPostRelays
###############
This function uses fetch to hit the POST relays endpoint of multiple didery servers. The POST relays endpoint saves new
trusted servers. This function is asynchronous.

Parameters
==========
batchPostRelays has two required parameter. First is a data parameter takes an object and should have the following
format:
::
  {
      "changed": datetime string,
      "host_address": URL string,
      "main": boolean,
      "name": name string,
      "port": port string
  }
Second is a urls array parameter that takes an array of URL strings.

Return
======
batchPostRelays returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   let data = {
       "changed": "2000-01-01T00:00:00+00:00",
       "host_address": "127.0.0.1",
       "main": true,
       "name": "alpha",
       "port": "7541"
   }
   didery.batchPostRelays(data, urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });