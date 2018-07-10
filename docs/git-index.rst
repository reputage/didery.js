##########################################
dideryJS Documentation for 0.0.1 and later
##########################################
dideryJS helps users interface with distributed or soloed didery servers. The didery project aims at bring about proper
key management by providing easy to use key management tools. This documentation is divided into three major parts
associated with the different types of functions provided in the dideryJS client library:

- **Help** - Cryptographic and general functions
- **API** - Functions used to interface with a didery api
- **Batch** - Functions used to interface with multiple didery api's at once

Table of Contents
=================

- `Help <https://github.com/reputage/didery.js/blob/master/docs/help>`_
   - `concatenateUint8Arrays <https://github.com/reputage/didery.js/blob/master/docs/help/concatenateUint8Arrays.rst>`_
   - `stringToBytes <https://github.com/reputage/didery.js/blob/master/docs/help/stringToBytes.rst>`_
   - `parseSignatureHeader <https://github.com/reputage/didery.js/blob/master/docs/help/parseSignatureHeader.rst>`_
   - `checkConsensus <https://github.com/reputage/didery.js/blob/master/docs/help/checkConsensus.rst>`_
   - `getConsensus <https://github.com/reputage/didery.js/blob/master/docs/help/getConsensus.rst>`_
   - `makeDid <https://github.com/reputage/didery.js/blob/master/docs/help/makeDid.rst>`_
   - `extractDidParts <https://github.com/reputage/didery.js/blob/master/docs/help/extractDidParts.rst>`_
   - `generateKeyPair <https://github.com/reputage/didery.js/blob/master/docs/help/generateKeyPair.rst>`_
   - `signResource <https://github.com/reputage/didery.js/blob/master/docs/help/signResource.rst>`_
   - `verify <https://github.com/reputage/didery.js/blob/master/docs/help/verify.rst>`_
   - `verify64u <https://github.com/reputage/didery.js/blob/master/docs/help/verify64u.rst>`_
   - `toBase64 <https://github.com/reputage/didery.js/blob/master/docs/help/toBase64.rst>`_
   - `fromBase64 <https://github.com/reputage/didery.js/blob/master/docs/help/fromBase64.rst>`_
   - `keyInceptionEvent <https://github.com/reputage/didery.js/blob/master/docs/help/keyInceptionEvent.rst>`_
   - `keyRotationEvent <https://github.com/reputage/didery.js/blob/master/docs/help/keyRotationEvent.rst>`_
- `API <https://github.com/reputage/didery.js/blob/master/docs/api>`_
   - `getHistory <https://github.com/reputage/didery.js/blob/master/docs/api/getHistory.rst>`_
   - `postHistory <https://github.com/reputage/didery.js/blob/master/docs/api/postHistory.rst>`_
   - `putHistory <https://github.com/reputage/didery.js/blob/master/docs/api/putHistory.rst>`_
   - `getBlobs <https://github.com/reputage/didery.js/blob/master/docs/api/getBlobs.rst>`_
   - `postBlobs <https://github.com/reputage/didery.js/blob/master/docs/api/postBlobs.rst>`_
   - `putBlobs <https://github.com/reputage/didery.js/blob/master/docs/api/putBlobs.rst>`_
   - `getRelays <https://github.com/reputage/didery.js/blob/master/docs/api/getRelays.rst>`_
   - `postRelays <https://github.com/reputage/didery.js/blob/master/docs/api/postRelays.rst>`_
   - `putRelays <https://github.com/reputage/didery.js/blob/master/docs/api/putRelays.rst>`_
   - `deleteRelays <https://github.com/reputage/didery.js/blob/master/docs/api/deleteRelays.rst>`_
   - `getErrors <https://github.com/reputage/didery.js/blob/master/docs/api/getErrors.rst>`_
- `Batch <https://github.com/reputage/didery.js/blob/master/docs/batch>`_
   - `batchGetHistory <https://github.com/reputage/didery.js/blob/master/docs/batch/batchGetHistory.rst>`_
   - `batchPostHistory <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPostHistory.rst>`_
   - `batchPutHistory <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPutHistory.rst>`_
   - `batchGetBlobs <https://github.com/reputage/didery.js/blob/master/docs/batch/batchGetBlobs.rst>`_
   - `batchPostBlobs <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPostBlobs.rst>`_
   - `batchPutBlobs <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPutBlobs.rst>`_
   - `batchGetRelays <https://github.com/reputage/didery.js/blob/master/docs/batch/batchGetRelays.rst>`_
   - `batchPostRelays <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPostRelays.rst>`_
   - `batchPutRelays <https://github.com/reputage/didery.js/blob/master/docs/batch/batchPutRelays.rst>`_
   - `batchDeleteRelays <https://github.com/reputage/didery.js/blob/master/docs/batch/batchDeleteRelays.rst>`_
   - `batchGetErrors <https://github.com/reputage/didery.js/blob/master/docs/batch/batchGetErrors.rst>`_
      
      
