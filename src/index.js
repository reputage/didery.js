// ================================================== //
//                      HELPING                       //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import {keyInceptionEvent, keyRotationEvent, fromBase64} from "./helping";
import {getHistory} from "./api";

// ================================================== //
//                       MAIN                         //
// ================================================== //

(async() => {
    let keys = await keyInceptionEvent();
    let history = await getHistory();
    let did = history[history.length - 1].history.id;
    await keyRotationEvent(keys[0][0], keys[1][0], did);
    history = await getHistory();
    console.log(history);
})();

// ================================================== //
//                        EOF                         //
// ================================================== //