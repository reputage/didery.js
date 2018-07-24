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

- `Help <https://github.com/reputage/didery.js/blob/dev/docs/help>`_
   - `concatenateUint8Arrays <https://github.com/reputage/didery.js/blob/dev/docs/help/concatenateUint8Arrays.rst>`_
   - `stringToBytes <https://github.com/reputage/didery.js/blob/dev/docs/help/stringToBytes.rst>`_
   - `parseSignatureHeader <https://github.com/reputage/didery.js/blob/dev/docs/help/parseSignatureHeader.rst>`_
   - `checkConsensus <https://github.com/reputage/didery.js/blob/dev/docs/help/checkConsensus.rst>`_
   - `getConsensus <https://github.com/reputage/didery.js/blob/dev/docs/help/getConsensus.rst>`_
   - `makeDid <https://github.com/reputage/didery.js/blob/dev/docs/help/makeDid.rst>`_
   - `extractDidParts <https://github.com/reputage/didery.js/blob/dev/docs/help/extractDidParts.rst>`_
   - `generateKeyPair <https://github.com/reputage/didery.js/blob/dev/docs/help/generateKeyPair.rst>`_
   - `signResource <https://github.com/reputage/didery.js/blob/dev/docs/help/signResource.rst>`_
   - `verify <https://github.com/reputage/didery.js/blob/dev/docs/help/verify.rst>`_
   - `verify64u <https://github.com/reputage/didery.js/blob/dev/docs/help/verify64u.rst>`_
   - `toBase64 <https://github.com/reputage/didery.js/blob/dev/docs/help/toBase64.rst>`_
   - `fromBase64 <https://github.com/reputage/didery.js/blob/dev/docs/help/fromBase64.rst>`_
   - `keyInceptionEvent <https://github.com/reputage/didery.js/blob/dev/docs/help/keyInceptionEvent.rst>`_
   - `keyRotationEvent <https://github.com/reputage/didery.js/blob/dev/docs/help/keyRotationEvent.rst>`_
   - `keyRevocationEvent <https://github.com/reputage/didery.js/blob/dev/docs/help/keyRevocationEvent.rst>`_
- `API <https://github.com/reputage/didery.js/blob/dev/docs/api>`_
   - `getHistory <https://github.com/reputage/didery.js/blob/dev/docs/api/getHistory.rst>`_
   - `postHistory <https://github.com/reputage/didery.js/blob/dev/docs/api/postHistory.rst>`_
   - `putHistory <https://github.com/reputage/didery.js/blob/dev/docs/api/putHistory.rst>`_
   - `deleteHistory <https://github.com/reputage/didery.js/blob/dev/docs/api/deleteHistory.rst>`_
   - `getBlobs <https://github.com/reputage/didery.js/blob/dev/docs/api/getBlobs.rst>`_
   - `postBlobs <https://github.com/reputage/didery.js/blob/dev/docs/api/postBlobs.rst>`_
   - `putBlobs <https://github.com/reputage/didery.js/blob/dev/docs/api/putBlobs.rst>`_
   - `getRelays <https://github.com/reputage/didery.js/blob/dev/docs/api/getRelays.rst>`_
   - `postRelays <https://github.com/reputage/didery.js/blob/dev/docs/api/postRelays.rst>`_
   - `putRelays <https://github.com/reputage/didery.js/blob/dev/docs/api/putRelays.rst>`_
   - `deleteRelays <https://github.com/reputage/didery.js/blob/dev/docs/api/deleteRelays.rst>`_
   - `getErrors <https://github.com/reputage/didery.js/blob/dev/docs/api/getErrors.rst>`_
- `Batch <https://github.com/reputage/didery.js/blob/dev/docs/batch>`_
   - `batchGetHistory <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchGetHistory.rst>`_
   - `batchPostHistory <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPostHistory.rst>`_
   - `batchPutHistory <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPutHistory.rst>`_
   - `batchDeleteHistory <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchDeleteHistory.rst>`_
   - `batchGetBlobs <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchGetBlobs.rst>`_
   - `batchPostBlobs <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPostBlobs.rst>`_
   - `batchPutBlobs <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPutBlobs.rst>`_
   - `batchGetRelays <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchGetRelays.rst>`_
   - `batchPostRelays <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPostRelays.rst>`_
   - `batchPutRelays <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchPutRelays.rst>`_
   - `batchDeleteRelays <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchDeleteRelays.rst>`_
   - `batchGetErrors <https://github.com/reputage/didery.js/blob/dev/docs/batch/batchGetErrors.rst>`_
      
      
