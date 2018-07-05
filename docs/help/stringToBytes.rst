#############
stringToBytes
#############
This function converts a string to a Uint8Array. The Uint8Array is made of the string's unicode character codes. Unicode
code points range from 0 to 1114111. The first 128 Unicode code points are a direct match of the ASCII character
encoding.

Parameters
==========
stringToBytes takes one string. The provided string will be converted to a Uint8Array.

Return
======
stringToBytes returns one Uint8Array of character bytes. This byte array is derived from the provided string.

Example
=======
.. code-block:: javascript

  const didery = require('didery');
  
  let string = "a";
  let bytes = didery.stringToBytes(string);
  console.log(bytes);
  // Uint8Array[97]
  
  string = "Hello World!";
  bytes = didery.stringToBytes(string);
  console.log(bytes);
  // Uint8Array[72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]
  
  string = "brød";
  bytes = didery.stringToBytes(string);
  console.log(bytes);
  // Uint8Array[98, 114, 248, 100]
