######################
concatenateUint8Arrays
######################
This function concatenates two or more Uint8Arrays. Uint8Arrays are typed arrays representing arrays of 8-bit unsigned 
integers.

Parameters
==========
concatenateUint8Arrays takes two or more Uint8Arrays.

Return
======
concatenateUint8Arrays returns a newly concatenated Uint8Array.

.. code-block:: javascript

  const didery = require('didery');
  
  let array1 = new Uint8Array([1, 2, 3]);
  let array2 = new Uint8Array([4, 5, 6]);
  let result = didery.concatenateUint8Arrays(array1, array2);
  console.log(result)
  // Uint8Array[1, 2, 3, 4, 5, 6]
  
  array1 = new Uint8Array([1, 2, 3]);
  array2 = new Uint8Array([4, 5, 6]);
  let array3 = new Uint8Array([7, 8, 9]);
  result = didery.concatenateUint8Arrays(array1, array2, array3);
  console.log(result)
  // Uint8Array[1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  array1 = new Uint8Array([a, b, c]);
  array2 = new Uint8Array([x, y, z]);
  result = didery.concatenateUint8Arrays(array1, array2);
  console.log(result)
  // Uint8Array[97, 98, 99, 120, 121, 122]
