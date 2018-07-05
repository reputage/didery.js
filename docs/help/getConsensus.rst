##############
getConsensus
##############
This function compares entries in an array to verify consensus and returns the most frequent entry. A specified
percentage of entries must be the same for consensus to be reached. The getConsensus function compares primitives
normally and deep compares objects.

Parameters
==========
getConsensus takes an array of data entries. Data entries can be objects or primitives, but should all be of the same
type. There is also an optional consensus level parameter. This should be a float between 0 and 1. The given float
represents the consensus threshold that must be surpassed in order to return true.

Return
======
getConsensus returns the most frequent data entry if consensus is reached, otherwise the function throws an error.

Example
=======
.. code-block:: javascript

   const didery = require('didery');

   let data = ["abc", "abc"];
   let result = didery.getConsensus(data);
   console.log(result);
   // "abc"

   data = [{"test": "test"}, {"test": "test"}];
   result = didery.getConsensus(data);
   console.log(result);
   // {"test": "test"}

   data = ["abc", "abc", "efg"];
   let level = 0.5;
   result = didery.getConsensus(data);
   // "abc"

   data = [{"test": "test"}, {"testing": "testing"}, {"test": "testing"}];
   level = 0.5;
   result = didery.getConsensus(data);
   // Error: Consensus unreached