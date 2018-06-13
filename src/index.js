// ================================================== //
//                       INDEX                        //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited: 06/12/2018                            //
// Last Edited By: Brady Hammond                      //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import {keyInceptionEvent, keyRotationEvent} from "./help";
import {getHistory} from "./api";
import {batchGetHistory} from "./batch";

// ================================================== //
//                       MAIN                         //
// ================================================== //

(async() => {
    let keys = await keyInceptionEvent({post: true, urls:["http://127.0.0.1:8080/", "http://127.0.0.1:8000/"]});
    let history = await getHistory();
    let did = history[history.length - 1].history.id;
    setTimeout(async function(){
        /*await keyRotationEvent(keys[0][0], keys[1][0], did, {post: true,
            save: true,
            show: true});
        history = await getHistory();
        console.log(history);*/
        let histories = await batchGetHistory(["http://127.0.0.1:8080/", "http://127.0.0.1:8000/"]);
        console.log(histories);
    }, 5000);

})();

// ================================================== //
//                        EOF                         //
// ================================================== //