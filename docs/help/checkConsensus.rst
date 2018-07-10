##############
checkConsensus
##############
This function compares entries in an array to verify consensus. A specified percentage of entries must be the same for
consensus to be reached. The checkConsensus function compares primitives normally and deep compares objects.

Parameters
==========
checkConsensus takes an array of data entries. Data entries can be objects or primitives, but should all be of the same
type. There is also an optional consensus level parameter. This should be a float between 0 and 1. The given float
represents the consensus threshold that must be surpassed in order to return true. The default consensus level is 1.

Return
======
checkConsensus returns a boolean. If consensus is reached the function returns true, otherwise the function returns
false.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let data = ["abc", "abc"];
   let result = didery.checkConsensus(data);
   console.log(result);
   // true

   data = [{"test": "test"}, {"test": "test"}];
   result = didery.checkConsensus(data);
   console.log(result);
   // true

   data = ["abc", "abc", "efg"];
   let level = 0.5;
   result = didery.checkConsensus(data);
   // true

   data = [{"test": "test"}, {"testing": "testing"}, {"test": "testing"}];
   level = 0.5;
   result = didery.checkConsensus(data);
   // false