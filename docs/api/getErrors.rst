#########
getErrors
#########
This function uses fetch to hit the GET errors endpoint of a didery server. The GET errors endpoint returns any errors
raised by the server. This functions is asynchronous.

Parameters
==========
getErrors has one optional parameter. It is a string for the server's base URL. The default base URL is the localhost
at port 8080.

Return
======
getErrors returns a promise that when fulfilled returns the server's response to the fetch operation.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   didery.getErrors(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });