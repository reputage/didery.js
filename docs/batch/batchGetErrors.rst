##############
batchGetErrors
##############
This function uses fetch to hit the GET errors endpoint of multiple didery servers. The GET errors endpoint returns any
errors raised by the server. This functions is asynchronous.

Parameters
==========
batchGetErrors has one required urls parameters. This takes an array of URL strings.

Return
======
batchGetErrors returns a promise that when fulfilled returns the servers' responses to the fetch operations.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let urls = [
        "http://myDideryServer.com",
        "http://anotherDideryServer.com",
        "http://oneMoreServer.com"
   ]
   didery.batchGetErrors(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });