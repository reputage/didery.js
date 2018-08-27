############
verifyEvents
############
This function uses libsodium to check the signatures for all of the events stored on a didery server. Event verification
is used to ensure that a server is trustworthy. This function is asynchronous.

Parameters
==========
verifyEvents has two optional parameters. First is a string for the server's base URL. The default base URL is the
localhost at port 8080. Second is a DID string. If this is supplied, verifyEvents will only retrieve the events for that
DID. The default DID string is an empty string. If no DID string is provided, verifyEvents will retrieve all server
events.

Return
======
verifyEvents returns a promise that when fulfilled returns a boolean. This boolean is true if the event signatures can
be verified. Otherwise, false is returned.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let baseURL = "http://myDideryServer.com";
   didery.verifyEvents(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });

   baseURL = "http://127.0.0.1:8000";
   let did = "did:dad:RlFPeUJHZ0V4NFlwNGZOMzZEdUZtalcxazdxS09Wb2U=";
   didery.getHistory(baseURL).then(function (response) {
        // Do something with response
   }).catch(function (error) {
        console.error(error);
   });