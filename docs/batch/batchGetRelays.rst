##############
batchGetRelays
##############
This function uses fetch to hit the GET relays endpoint of multiple didery servers. The GET relays endpoint returns
trusted servers. This functions is asynchronous.

Parameters
==========
getRelays has one required urls parameters. This takes an array of URL strings.

Return
======
getRelays returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   didery.batchGetRelays(urls).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });


