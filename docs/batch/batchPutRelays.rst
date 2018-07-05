##############
batchPutRelays
##############
This function uses fetch to hit the PUT relays endpoint of multiple didery servers. The PUT history endpoint updates
trusted servers. This function is asynchronous.

Parameters
==========
batchPutRelays has three required parameters. First is a data parameter that takes an object with the following format:
::
  {
      "changed": datetime string,
      "host_address": URL string,
      "main": boolean,
      "name": name string,
      "port": port string
  }
Second is a uid paramter that takes a uid string of the server to be updated. Third is a urls parameter that takes an
array of URL strings.

Return
======
batchPutRelays returns a promise that when fulfilled returns the servers' responses to the fetch operations.

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
   let uid = "1";
   didery.batchPutRelays(data, uid, urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });