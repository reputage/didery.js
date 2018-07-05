########
fromBase64
########
This function uses libsodium to convert a unicode base64 url-file safe string to a Uint8Array. This function is
asyncrhonous.

Parameters
==========
fromBase64 takes one base64 encoded string.

Return
======
fromBase64 returns a promise that when fulfilled returns a Uint8Array.

Example
=======
.. code-block:: javascript

  const didery = require('didery');
  let key = "vFkS-FLJLnPR69IplTKftKB0hIV9huLQsA9Tn3HYkR6dPycz6wzR6VwFQHYqjSg6mjSbuDGESrF78rtF985zCA=="
  didery.fromBase64(key).then(function (response) {
        console.log(response);
  });
  // Uint8Array[188,89,18,248,82,201,46,115,209,235,210,41,149,50,159,180,160,116,132,133,125,134,226,208,176,15,83,159,
                113,216,145,30,157,63,39,51,235,12,209,233,92,5,64,118,42,141,40,58,154,52,155,184,49,132,74,177,123,
                242,187,69,247,206,115,8];