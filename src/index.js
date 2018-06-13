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

import {fromBase64, keyInceptionEvent, keyRotationEvent} from "./help";
const m = require('mithril');

// ================================================== //
//                       MAIN                         //
// ================================================== //

let submitInception = async function(e) {
    e.preventDefault();
    let seed = $('#incept-seed').val();
    let currentPrivateKey = $('#incept-current-private-key').val();
    let currentPublicKey = $('#incept-current-public-key').val();
    let preRotatedPrivateKey = $('#incept-pre-rotated-private-key').val();
    let preRotatedPublicKey = $('#incept-pre-rotated-public-key').val();
    let urls = $('#incept-urls').val();
    let post = $('#incept-post').prop('checked');
    let save = $('#incept-save').prop('checked');
    let show = $('#incept-show').prop('checked');

    let storage = "";
    if ($('#incept-local').prop('checked')) {
        storage = "local"
    }
    else if ($('#incept-session').prop('checked')) {
        storage = "session";
    }
    else if ($('#incept-download').prop('checked')) {
        storage = "download";
    }
    else {
        storage = "";
    }

    if (save === true && storage === "") {
        console.log("No Storage Specified.");
        return;
    }

    let options = {};
    if (seed !== '') {
        try {
            options.seed = await fromBase64(seed);
        }
        catch (err) {
            console.log("Invalid Key: " + err + ".");
            return;
        }
    }

    if (currentPrivateKey !== '' && currentPublicKey !== '') {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(currentPrivateKey));
            keyPair.push(await fromBase64(currentPublicKey));
            options.currentKeyPair = keyPair;
        }
        catch (err) {
            console.log("Invalid Current Key: " + err + ".");
            return;
        }
    }

    else if ((currentPrivateKey !== '' && currentPublicKey === '') ||
        (currentPrivateKey === '' && currentPublicKey !== '')) {
        console.log("Incomplete Current Key Pair.");
        return;
    }

    if (preRotatedPrivateKey !== '' && preRotatedPublicKey !== '') {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(preRotatedPrivateKey));
            keyPair.push(await fromBase64(preRotatedPublicKey));
            options.preRotatedKeyPair = keyPair;
        }
        catch (err) {
            console.log("Invalid Current Key: " + err + ".");
            return;
        }
    }

    else if ((preRotatedPrivateKey !== '' && preRotatedPublicKey === '') ||
        (preRotatedPrivateKey === '' && preRotatedPublicKey !== '')) {
        console.log("Incomplete Current Key Pair.");
        return;
    }

    if (urls !== '') {
        options.urls = urls.split(',');
    }

    if (storage !== "") {
        options.storage = storage;
    }

    options.post = post;
    options.save = save;
    options.show = show;

    keyInceptionEvent(options);
};

let submitRotation = async function(e) {
    e.preventDefault();
    let oldKey = await fromBase64($('#rotate-old-private-key').val());
    let newKey = await fromBase64($('#rotate-new-private-key').val());
    let did = $('#rotate-did').val();
    let seed = $('#rotate-seed').val();
    let preRotatedPrivateKey = $('#rotate-pre-rotated-private-key').val();
    let preRotatedPublicKey = $('#rotate-pre-rotated-public-key').val();
    let urls = $('#rotate-urls').val();
    let post = $('#rotate-post').prop('checked');
    let save = $('#rotate-save').prop('checked');
    let show = $('#rotate-show').prop('checked');

    let storage = "";
    if ($('#incept-local').prop('checked')) {
        storage = "local"
    }
    else if ($('#incept-session').prop('checked')) {
        storage = "session";
    }
    else if ($('#incept-download').prop('checked')) {
        storage = "download";
    }
    else {
        storage = "";
    }

    if (save === true && storage === "") {
        console.log("No Storage Specified.");
        return;
    }

    let options = {};
    if (seed !== '') {
        try {
            options.seed = await fromBase64(seed);
        }
        catch (err) {
            console.log("Invalid Key: " + err + ".");
            return;
        }
    }

    if (preRotatedPrivateKey !== '' && preRotatedPublicKey !== '') {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(preRotatedPrivateKey));
            keyPair.push(await fromBase64(preRotatedPublicKey));
            options.preRotatedKeyPair = keyPair;
        }
        catch (err) {
            console.log("Invalid Current Key: " + err + ".");
            return;
        }
    }

    else if ((preRotatedPrivateKey !== '' && preRotatedPublicKey === '') ||
        (preRotatedPrivateKey === '' && preRotatedPublicKey !== '')) {
        console.log("Incomplete Current Key Pair.");
        return;
    }

    if (urls !== '') {
        options.urls = urls.split(',');
    }

    if (storage !== "") {
        options.storage = storage;
    }

    options.post = post;
    options.save = save;
    options.show = show;

    keyRotationEvent(oldKey, newKey, did, options);
};

m.render(document.body,
    m("div", {class: "ui container"},
        m("div", {class: "ui top attached tabular menu"},
            m("a[data-tab=incept]", {class: "active item"},
                m("i", {class: "key icon"}),
                m("div", "Key Inception")),
            m("a[data-tab=rotate]", {class: "item"},
                m("i", {class: "sync alternate icon"}),
                m("div", "Key Rotation"))),
        m("div[data-tab=incept]", {class: "ui bottom attached tab segment active"},
            m("div", {class: "ui container segment"},
                m("form", {class: "ui form", action: "#", onsubmit: submitInception},
                    m("div", {class: "field"},
                        m("label", "Seed"),
                        m("input", {id: "incept-seed",
                                    type: "text",
                                    placeholder: "Base64 Encoded Seed ..."})),
                    m("div", {class: "field"},
                        m("label", "Current Key Pair"),
                        m("div", {class: "two fields"},
                            m("div", {class: "field"},
                                m("input", {id: "incept-current-private-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Private Key ..."})),
                            m("div", {class: "field"},
                                m("input", {id: "incept-current-public-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Public Key ..."})
                            ))),
                    m("div", {class: "field"},
                        m("label", "Pre-rotated Key Pair"),
                        m("div", {class: "two fields"},
                            m("div", {class: "field"},
                                m("input", {id: "incept-pre-rotated-private-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Private Key ..."})),
                            m("div", {class: "field"},
                                m("input", {id:"incept-pre-rotated-public-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Public Key ..."})))),
                    m("div", {class: "field"},
                        m("label", "URL's"),
                        m("textarea", {id:"incept-urls",
                                       rows: 5,
                                       placeholder: "URL's (Comma Separated) ..."})),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"incept-post", type: "checkbox"}),
                            m("label", "Post Data"))),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"incept-show", type: "checkbox"}),
                            m("label", "Show Pre-rotated Private Key"))),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"incept-save", type: "checkbox"}),
                            m("label", "Save Current Private Key"))),
                    m("div", {class: "grouped fields"},
                        m("label", "Save Location"),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id: "incept-local",
                                            type: "radio",
                                            name: "storage",
                                            value: "local",
                                            }),
                                m("label", "Local Storage"))),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id:"incept-session",
                                            type: "radio",
                                            name: "storage",
                                            value: "session",
                                            }),
                                m("label", "Session Storage"))),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id:"incept-download",
                                            type: "radio",
                                            name: "storage",
                                            value: "download",
                                            }),
                                m("label", "Download")))),
                    m("div", {class: "ui center aligned vertical segment"},
                        m("button", {class: "ui button",
                                     type: "submit"}, "Run Key Inception"))))),
        m("div[data-tab=rotate]", {class: "ui bottom attached tab segment"},
            m("div", {class: "ui container segment"},
                m("form", {class: "ui form", action: "#", onsubmit: submitRotation},
                    m("div", {class: "field"},
                        m("label", "Old Private Key *"),
                        m("input", {id: "rotate-old-private-key",
                                    type: "text",
                                    placeholder: "Base64 Encoded Private Key ..."})),
                    m("div", {class: "field"},
                        m("label", "New Private Key *"),
                        m("input", {id: "rotate-new-private-key",
                                    type: "text",
                                    placeholder: "Base64 Encoded Private Key ..."})),
                    m("div", {class: "field"},
                        m("label", "DID *"),
                        m("input", {id: "rotate-did",
                                    type: "text",
                                    placeholder: "DID ..."})),
                    m("div", {class: "field"},
                        m("label", "Seed"),
                        m("input", {id: "rotate-seed",
                                    type: "text",
                                    placeholder: "Base64 Encoded Seed ..."})),
                    m("div", {class: "field"},
                        m("label", "Pre-rotated Key Pair"),
                        m("div", {class: "two fields"},
                            m("div", {class: "field"},
                                m("input", {id: "rotate-pre-rotated-private-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Private Key ..."})),
                            m("div", {class: "field"},
                                m("input", {id:"rotate-pre-rotated-public-key",
                                            type: "text",
                                            placeholder: "Base64 Encoded Public Key ..."})))),
                    m("div", {class: "field"},
                        m("label", "URL's"),
                        m("textarea", {id:"rotate-urls",
                                       rows: 5,
                                       placeholder: "URL's (Comma Separated) ..."})),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"rotate-post", type: "checkbox"}),
                            m("label", "Post Data"))),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"rotate-show", type: "checkbox"}),
                            m("label", "Show Pre-rotated Private Key"))),
                    m("div", {class: "field"},
                        m("div", {class: "ui toggle checkbox"},
                            m("input", {id:"rotate-save", type: "checkbox"}),
                            m("label", "Save Current Private Key"))),
                    m("div", {class: "grouped fields"},
                        m("label", "Save Location"),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id: "rotate-local",
                                            type: "radio",
                                            name: "storage",
                                            value: "local",
                                }),
                                m("label", "Local Storage"))),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id:"rotate-session",
                                            type: "radio",
                                            name: "storage",
                                            value: "session",
                                }),
                                m("label", "Session Storage"))),
                        m("div", {class: "field"},
                            m("div", {class: "ui radio checkbox"},
                                m("input", {id:"rotate-download",
                                            type: "radio",
                                            name: "storage",
                                            value: "download",
                                }),
                                m("label", "Download")))),
                    m("div", {class: "ui center aligned vertical segment"},
                        m("button", {class: "ui button",
                            type: "submit"}, "Run Key Rotation")))))));


$(".menu .item").tab();

// ================================================== //
//                        EOF                         //
// ================================================== //