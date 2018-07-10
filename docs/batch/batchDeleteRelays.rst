#################
batchDeleteRelays
#################
This function uses fetch to hit the DELETE relays endpoint of multiple didery servers. The DELETE relays endpoint
deletes trusted server data. This function is asynchronous.

Parameters
==========
batchDeleteRelays has two required parameters. Second is a urls parameter that takes an array of URL strings.

Return
======
batchDeleteRelays returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   let uid = "1"
   didery.batchDeleteRelays(uid, urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
       console.error(error);
   });