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

const didery = require('../../dist/didery');
const m = require('mithril');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

didery.subscribeHistory("http://127.0.0.1:8080/").catch(function(error) {
    console.error(error);
});
let submitInception = async function(e) {
    e.preventDefault();

    if (!$('#incept-fail').hasClass("hidden")) {
        $('#incept-fail').addClass("hidden");
    }

    if (!$('#incept-success').hasClass("hidden")) {
        $('#incept-success').addClass("hidden");
    }

    let currentSeed = $('#incept-current-seed').val();
    let preRotated = $('#incept-pre-rotated-seed').val();
    let currentPrivateKey = $('#incept-current-private-key').val();
    let currentPublicKey = $('#incept-current-public-key').val();
    let preRotatedPrivateKey = $('#incept-pre-rotated-private-key').val();
    let preRotatedPublicKey = $('#incept-pre-rotated-public-key').val();
    let urls = $('#incept-urls').val();
    let post = $('#incept-post').prop('checked');
    let saveCurrent = $('#incept-save-current').prop('checked');
    let savePreRotated = $('#incept-save-pre-rotated').prop('checked');
    let saveDid = $('#incept-save-did').prop('checked');
    let showCurrent = $('#incept-show-current').prop('checked');
    let showPreRotated = $('#incept-show-pre-rotated').prop('checked');
    let showDid = $('#incept-show-did').prop('checked');

    let storageCurrent = "";
    if ($('#incept-local-current').prop('checked')) {
        storageCurrent = "local"
    }
    else if ($('#incept-session-current').prop('checked')) {
        storageCurrent = "session";
    }
    else if ($('#incept-download-current').prop('checked')) {
        storageCurrent = "download";
    }
    else {
        storageCurrent = "";
    }

    if (saveCurrent === true && storageCurrent === "") {
        console.error("No Storage Specified.");
        $('#incept-fail-message').text("No Storage Specified.");
        $('#incept-fail').removeClass("hidden");
        return;
    }

    let storagePreRotated = "";
    if ($('#incept-local-current').prop('checked')) {
        storagePreRotated = "local"
    }
    else if ($('#incept-session-current').prop('checked')) {
        storagePreRotated = "session";
    }
    else if ($('#incept-download-current').prop('checked')) {
        storagePreRotated = "download";
    }
    else {
        storagePreRotated = "";
    }

    if (savePreRotated === true && storagePreRotated === "") {
        console.error("No Storage Specified.");
        $('#incept-fail-message').text("No Storage Specified.");
        $('#incept-fail').removeClass("hidden");
        return;
    }

    let storageDid = "";
    if ($('#incept-local-did').prop('checked')) {
        storageDid = "local"
    }
    else if ($('#incept-session-did').prop('checked')) {
        storageDid = "session";
    }
    else if ($('#incept-download-did').prop('checked')) {
        storageDid = "download";
    }
    else {
        storageDid = "";
    }

    if (saveDid === true && storageDid === "") {
        console.error("No Storage Specified.");
        $('#incept-fail-message').text("No Storage Specified.");
        $('#incept-fail').removeClass("hidden");
        return;
    }

    let options = {};
    if (currentSeed !== "") {
        try {
            options.currentSeed = await fromBase64(currentSeed);
        }
        catch (error) {
            console.error("Invalid Key: " + error + ".");
            $('#incept-fail-message').text("Invalid Key: " + error + ".");
            $('#incept-fail').removeClass("hidden");
            return;
        }
    }

    if (preRotated !== "") {
        try {
            options.preRotated = await fromBase64(preRotated);
        }
        catch (error) {
            console.error("Invalid Key: " + error + ".");
            $('#incept-fail-message').text("Invalid Key: " + error + ".");
            $('#incept-fail').removeClass("hidden");
            return;
        }
    }

    if (currentPrivateKey !== "" && currentPublicKey !== "") {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(currentPrivateKey));
            keyPair.push(await fromBase64(currentPublicKey));
            options.currentKeyPair = keyPair;
        }
        catch (error) {
            console.error("Invalid Current Key: " + error + ".");
            $('#incept-fail-message').text("Invalid Current Key: " + error + ".");
            $('#incept-fail').removeClass("hidden");
            return;
        }
    }

    else if ((currentPrivateKey !== "" && currentPublicKey === "") ||
        (currentPrivateKey === "" && currentPublicKey !== "")) {
        console.error("Incomplete Current Key Pair.");
        $('#incept-fail-message').text("Incomplete Current Key Pair.");
        $('#incept-fail').removeClass("hidden");
        return;
    }

    if (preRotatedPrivateKey !== "" && preRotatedPublicKey !== "") {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(preRotatedPrivateKey));
            keyPair.push(await fromBase64(preRotatedPublicKey));
            options.preRotatedKeyPair = keyPair;
        }
        catch (error) {
            console.error("Invalid Pre-rotated Key: " + error + ".");
            $('#incept-fail-message').text("Invalid Pre-rotated Key: " + error + ".");
            $('#incept-fail').removeClass("hidden");
            return;
        }
    }

    else if ((preRotatedPrivateKey !== "" && preRotatedPublicKey === "") ||
        (preRotatedPrivateKey === "" && preRotatedPublicKey !== "")) {
        console.error("Incomplete Pre-rotated Key Pair.");
        $('#incept-fail-message').text("Invalid Pre-rotated Key: " + error + ".");
        $('#incept-fail').removeClass("hidden");
        return;
    }

    if (urls !== "") {
        options.urls = urls.split(',');
    }

    if (storageCurrent !== "") {
        options.storageCurrent = storageCurrent;
    }

    if (storagePreRotated !== "") {
        options.storagePreRotated = storagePreRotated;
    }

    if (storageDid !== "") {
        options.storageDid = storageDid;
    }

    options.post = post;
    options.saveCurrent = saveCurrent;
    options.savePreRotated = savePreRotated;
    options.saveDid = saveDid;
    options.showCurrent = showCurrent;
    options.showPreRotated = showPreRotated;
    options.showDid = showDid;

    await didery.keyInceptionEvent(options).catch(function (error) {
        $('#incept-fail-message').text(error);
        $('#incept-fail').removeClass("hidden");
    });

    if ($('#incept-fail').hasClass("hidden")) {
        $('#incept-success').removeClass("hidden");
    }
};

// ================================================== //

let submitRotation = async function(e) {
    e.preventDefault();
    $('.error').removeClass("error");

    if (!$('#rotate-fail').hasClass("hidden")) {
        $('#rotate-fail').addClass("hidden");
    }

    if (!$('#rotate-success').hasClass("hidden")) {
        $('#rotate-success').addClass("hidden");
    }

    let oldKey = await fromBase64($('#rotate-old-private-key').val());
    let newKey = await fromBase64($('#rotate-new-private-key').val());
    let did = $('#rotate-did').val();
    let seed = $('#rotate-seed').val();
    let preRotatedPrivateKey = $('#rotate-pre-rotated-private-key').val();
    let preRotatedPublicKey = $('#rotate-pre-rotated-public-key').val();
    let consensus = $('#rotate-consensus').val();
    let urls = $('#rotate-urls').val();
    let post = $('#rotate-post').prop('checked');
    let saveCurrent = $('#rotate-save-current').prop('checked');
    let savePreRotated = $('#rotate-save-pre-rotated').prop('checked');
    let showCurrent = $('#rotate-show-current').prop('checked');
    let showPreRotated = $('#rotate-show-pre-rotated').prop('checked');

    if (oldKey.length === 0) {
        $('#rotate-old-private-key').parent().addClass("error");
        $('#rotate-fail-message').text("Missing Required field: Old Private Key.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    if (newKey.length === 0) {
        $('#rotate-new-private-key').parent().addClass("error");
        $('#rotate-fail-message').text("Missing Required field: New Private Key.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    if (did === "") {
        $('#rotate-did').parent().addClass("error");
        $('#rotate-fail-message').text("Missing Required field: DID.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    let storageCurrent = "";
    if ($('#rotate-local-current').prop('checked')) {
        storageCurrent = "local"
    }
    else if ($('#rotate-session-current').prop('checked')) {
        storageCurrent = "session";
    }
    else if ($('#rotate-download-current').prop('checked')) {
        storageCurrent = "download";
    }
    else {
        storageCurrent = "";
    }

    if (saveCurrent === true && storageCurrent === "") {
        console.error("No Storage Specified.");
        $('#rotate-fail-message').text("No Storage Specified.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    let storagePreRotated = "";
    if ($('#rotate-local-current').prop('checked')) {
        storagePreRotated = "local"
    }
    else if ($('#rotate-session-current').prop('checked')) {
        storagePreRotated = "session";
    }
    else if ($('#rotate-download-current').prop('checked')) {
        storagePreRotated = "download";
    }
    else {
        storagePreRotated = "";
    }

    if (savePreRotated === true && storagePreRotated === "") {
        console.error("No Storage Specified.");
        $('#rotate-fail-message').text("No Storage Specified.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    let options = {};
    if (seed !== "") {
        try {
            options.seed = await fromBase64(seed);
        }
        catch (error) {
            console.error("Invalid Key: " + error + ".");
            $('#rotate-fail-message').text("Invalid Key: " + error + ".");
            $('#rotate-fail').removeClass("hidden");
            return;
        }
    }

    if (preRotatedPrivateKey !== "" && preRotatedPublicKey !== "") {
        try {
            let keyPair = [];
            keyPair.push(await fromBase64(preRotatedPrivateKey));
            keyPair.push(await fromBase64(preRotatedPublicKey));
            options.preRotatedKeyPair = keyPair;
        }
        catch (error) {
            console.error("Invalid Current Key: " + error + ".");
            $('#rotate-fail-message').text("Invalid Current Key: " + error + ".");
            $('#rotate-fail').removeClass("hidden");
            return;
        }
    }

    else if ((preRotatedPrivateKey !== "" && preRotatedPublicKey === "") ||
        (preRotatedPrivateKey === "" && preRotatedPublicKey !== "")) {
        console.error("Incomplete Current Key Pair.");
        $('#rotate-fail-message').text("Incomplete Current Key Pair.");
        $('#rotate-fail').removeClass("hidden");
        return;
    }

    if (urls !== "") {
        options.urls = urls.split(',');
    }

    if (consensus !== "") {
        options.consensus = parseFloat(consensus);
    }

    if (storageCurrent !== "") {
        options.storageCurrent = storageCurrent;
    }

    if (storagePreRotated !== "") {
        options.storagePreRotated = storagePreRotated;
    }

    options.post = post;
    options.saveCurrent = saveCurrent;
    options.savePreRotated = savePreRotated;
    options.showCurrent = showCurrent;
    options.showPreRotated = showPreRotated;

    await didery.keyRotationEvent(oldKey, newKey, did, options).catch(function (error) {
        $('#rotate-fail-message').text(error);
        $('#rotate-fail').removeClass("hidden");
    });

    if ($('#rotate-fail').hasClass("hidden")) {
        $('#rotate-success').removeClass("hidden");
    }
};
// ================================================== //
//                       MAIN                         //
// ================================================== //

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
                        m("label", "Current Seed ",
                            m("span[data-content=This is an optional base64 encoded seed string. If provided it will be " +
                                "used to generate the key pair for your current key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "incept-current-seed",
                            type: "text",
                            placeholder: "Base64 Encoded Seed ..."})),
                    m("div", {class: "field"},
                        m("label", "Pre-rotated Seed ",
                            m("span[data-content=This is an optional base64 encoded seed string. If provided it will " +
                                "be used to generate the key pair for your pre-rotated key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "incept-pre-rotated-seed",
                            type: "text",
                            placeholder: "Base64 Encoded Seed ..."})),
                    m("div", {class: "field"},
                        m("label", "Current Key Pair ",
                            m("span[data-content=These are optional base64 encoded key strings. The first field is a " +
                                "for a 64 bit private key, and the second field is for a 32 bit public key. If both " +
                                "keys are provided, the key pair will be used as your current key pair. If used, both " +
                                "keys must be provided.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
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
                        m("label", "Pre-rotated Key Pair ",
                            m("span[data-content=These are optional base64 encoded key strings. The first field is a " +
                                "for a 64 bit private key, and the second field is for a 32 bit public key. If both " +
                                "keys are provided, the key pair will be used as your pre-rotated key pair. If used, both " +
                                "keys must be provided.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
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
                        m("label", "URL's ",
                            m("span[data-content=This is an optional list of comma separated urls. If you select the post " +
                                "option, your key history will be posted to each url in this list.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("textarea", {id:"incept-urls",
                            rows: 5,
                            placeholder: "URL's (Comma Separated) ..."})),
                    m("div", {class: "ui segment"},
                        m("div", {class: "ui three column stackable grid"},
                            m("div", {class: "column"},
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-post", type: "checkbox"}),
                                        m("label", "Post Data ",
                                            m("span[data-content=This is an option to post your newly generated key history to one or more servers.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i",
                                                    {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-show-current", type: "checkbox"}),
                                        m("label", "Show Current Private Key ",
                                            m("span[data-content=This is an option to show your newly generated current key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-save-current", type: "checkbox"}),
                                        m("label", "Save Current Private Key ",
                                            m("span[data-content=This is an option to save your current private key in one of the formats below. " +
                                                "Local storage saves your key to your browser's persistent storage. Session storage " +
                                                "saves your key to your browser's temporary storage (erased when the browser is " +
                                                "closed). Download saves your key in a .txt file and downloads it onto your local " +
                                                "machine.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"})))))),
                            m("div", {class: "column"},
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-show-pre-rotated", type: "checkbox"}),
                                        m("label", "Show Pre-rotated Private Key ",
                                            m("span[data-content=This is an option to show your newly generated pre-rotated key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-save-pre-rotated", type: "checkbox"}),
                                        m("label", "Save Pre-rotated Private Key ",
                                            m("span[data-content=This is an option to save your pre-rotated private key in one of the formats below. " +
                                                "Local storage saves your key to your browser's persistent storage. Session storage " +
                                                "saves your key to your browser's temporary storage (erased when the browser is " +
                                                "closed). Download saves your key in a .txt file and downloads it onto your local " +
                                                "machine.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"})))))),
                            m("div", {class: "column"},
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-show-did", type: "checkbox"}),
                                        m("label", "Show DID ",
                                            m("span[data-content=This is an option to show your newly generated DID.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"incept-save-did", type: "checkbox"}),
                                        m("label", "Save DID ",
                                            m("span[data-content=This is an option to save your DID in one of the formats below. " +
                                                "Local storage saves your DID to your browser's persistent storage. Session storage " +
                                                "saves your DID to your browser's temporary storage (erased when the browser is " +
                                                "closed). Download saves your DID in a .txt file and downloads it onto your local " +
                                                "machine.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"})))))))),
                    m("div", {class: "ui segment"},
                        m("div", {class: "ui three column stackable grid"},
                            m("div", {class: "column"},
                                m("div", {class: "grouped fields"},
                                    m("label", "Current Save Location"),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id: "incept-local-current",
                                                type: "radio",
                                                name: "incept-storage-current",
                                                value: "local",
                                            }),
                                            m("label", "Local Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-session-current",
                                                type: "radio",
                                                name: "incept-storage-current",
                                                value: "session",
                                            }),
                                            m("label", "Session Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-download-current",
                                                type: "radio",
                                                name: "incept-storage-current",
                                                value: "download",
                                            }),
                                            m("label", "Download"))))),
                            m("div", {class: "column"},
                                m("div", {class: "grouped fields"},
                                    m("label", "Pre-Rotated Save Location"),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id: "incept-local-pre-rotated",
                                                type: "radio",
                                                name: "incept-storage-pre-rotated",
                                                value: "local",
                                            }),
                                            m("label", "Local Storage",))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-session-pre-rotated",
                                                type: "radio",
                                                name: "incept-storage-pre-rotated",
                                                value: "session",
                                            }),
                                            m("label", "Session Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-download-pre-rotated",
                                                type: "radio",
                                                name: "incept-storage-pre-rotated",
                                                value: "download",
                                            }),
                                            m("label", "Download"))))),
                            m("div", {class: "column"},
                                m("div", {class: "grouped fields"},
                                    m("label", "DID Save Location"),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id: "incept-local-did",
                                                type: "radio",
                                                name: "incept-storage-did",
                                                value: "local",
                                            }),
                                            m("label", "Local Storage",))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-session-did",
                                                type: "radio",
                                                name: "incept-storage-did",
                                                value: "session",
                                            }),
                                            m("label", "Session Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"incept-download-did",
                                                type: "radio",
                                                name: "incept-storage-did",
                                                value: "download",
                                            }),
                                            m("label", "Download"))))))),
                    m("div", {class: "ui center aligned vertical segment"},
                        m("button", {class: "ui button",
                            type: "submit"}, "Run Key Inception"))),
                m("div", {id: "incept-success", class: "ui positive message hidden"},
                    m("i", {class: "close icon"}),
                    m("div", {class: "header"}, "Key Inception Success"),
                    m("p", {id: "incept-success-message"}, "Your new keys have successfully been created.")),
                m("div", {id: "incept-fail", class: "ui negative message hidden"},
                    m("i", {class: "close icon"}),
                    m("div", {class: "header"}, "Key Inception Failure"),
                    m("p", {id: "incept-fail-message"})))),
        m("div[data-tab=rotate]", {class: "ui bottom attached tab segment"},
            m("div", {class: "ui container segment"},
                m("form", {class: "ui form", action: "#", onsubmit: submitRotation},
                    m("div", {class: "required field"},
                        m("label", "Old Private Key ",
                            m("span[data-content=This is the 64 bit, base64 encoded string of your current private key. This key will " +
                                "no longer be usable after the rotation event.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "rotate-old-private-key",
                            type: "text",
                            placeholder: "Base64 Encoded Private Key ..."})),
                    m("div", {class: "required field"},
                        m("label", "New Private Key ",
                            m("span[data-content=This is the 64 bit, base64 encoded string of your pre-rotated private key. This key will " +
                                "become your new current key after the rotation event.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "rotate-new-private-key",
                            type: "text",
                            placeholder: "Base64 Encoded Private Key ..."})),
                    m("div", {class: "required field"},
                        m("label", "DID ",
                            m("span[data-content=This is the decentralized identifier string associated with your key " +
                                "history.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "rotate-did",
                            type: "text",
                            placeholder: "DID ..."})),
                    m("div", {class: "field"},
                        m("label", "Seed ",
                            m("span[data-content=This is an optional base64 encoded seed string. If provided it will be " +
                                "used to generate the key pair for your new pre-rotated key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "rotate-seed",
                            type: "text",
                            placeholder: "Base64 Encoded Seed ..."})),
                    m("div", {class: "field"},
                        m("label", "Pre-rotated Key Pair ",
                            m("span[data-content=These are optional base64 encoded key strings. The first field is a " +
                                "for a 64 bit private key, and the second field is for a 32 bit public key. If both " +
                                "keys are provided, the key pair will be used as your pre-rotated key pair. If used, both " +
                                "keys must be provided.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
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
                        m("label", "Consensus Level ",
                            m("span[data-content=This is an optional level of consensus that must be met by servers to " +
                                "use server key history data. This should be a number between 0 and 1.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "rotate-seed",
                            type: "number",
                            step: "0.01",
                            min: "0",
                            max: "1",
                            placeholder: "0"})),
                    m("div", {class: "field"},
                        m("label", "URL's ",
                            m("span[data-content=This is an optional list of comma separated urls. If you select the post " +
                                "option, your key history will be posted to each url in this list.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("textarea", {id:"rotate-urls",
                            rows: 5,
                            placeholder: "URL's (Comma Separated) ..."})),
                    m("div", {class: "ui segment"},
                        m("div", {class: "ui two column stackable grid"},
                            m("div", {class: "column"},
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"rotate-post", type: "checkbox"}),
                                        m("label", "Post Data ",
                                            m("span[data-content=This is an option to post your newly generated key history to one or more servers.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i",
                                                    {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"rotate-show-current", type: "checkbox"}),
                                        m("label", "Show Current Private Key ",
                                            m("span[data-content=This is an option to show your newly generated current key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"rotate-save-current", type: "checkbox"}),
                                        m("label", "Save Current Private Key ",
                                            m("span[data-content=This is an option to save your current private key in one of the formats below. " +
                                                "Local storage saves your key to your browser's persistent storage. Session storage " +
                                                "saves your key to your browser's temporary storage (erased when the browser is " +
                                                "closed). Download saves your key in a .txt file and downloads it onto your local " +
                                                "machine.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"})))))),
                            m("div", {class: "column"},
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"rotate-show-pre-rotated", type: "checkbox"}),
                                        m("label", "Show Pre-rotated Private Key ",
                                            m("span[data-content=This is an option to show your newly generated pre-rotated key.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"}))))),
                                m("div", {class: "field"},
                                    m("div", {class: "ui toggle checkbox"},
                                        m("input", {id:"rotate-save-pre-rotated", type: "checkbox"}),
                                        m("label", "Save Pre-rotated Private Key ",
                                            m("span[data-content=This is an option to save your pre-rotated private key in one of the formats below. " +
                                                "Local storage saves your key to your browser's persistent storage. Session storage " +
                                                "saves your key to your browser's temporary storage (erased when the browser is " +
                                                "closed). Download saves your key in a .txt file and downloads it onto your local " +
                                                "machine.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                                m("i", {class: "icon question circle outline"})))))))),
                    m("div", {class: "ui segment"},
                        m("div", {class: "ui two column stackable grid"},
                            m("div", {class: "column"},
                                m("div", {class: "grouped fields"},
                                    m("label", "Current Save Location"),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id: "rotate-local-current",
                                                type: "radio",
                                                name: "rotate-storage-current",
                                                value: "local",
                                            }),
                                            m("label", "Local Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"rotate-session-current",
                                                type: "radio",
                                                name: "rotate-storage-current",
                                                value: "session",
                                            }),
                                            m("label", "Session Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"rotate-download-current",
                                                type: "radio",
                                                name: "rotate-storage-current",
                                                value: "download",
                                            }),
                                            m("label", "Download"))))),
                            m("div", {class: "column"},
                                m("div", {class: "grouped fields"},
                                    m("label", "Pre-Rotated Save Location"),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id: "rotate-local-pre-rotated",
                                                type: "radio",
                                                name: "rotate-storage-pre-rotated",
                                                value: "local",
                                            }),
                                            m("label", "Local Storage",))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"rotate-session-pre-rotated",
                                                type: "radio",
                                                name: "rotate-storage-pre-rotated",
                                                value: "session",
                                            }),
                                            m("label", "Session Storage"))),
                                    m("div", {class: "field"},
                                        m("div", {class: "ui radio checkbox"},
                                            m("input", {id:"rotate-download-pre-rotated",
                                                type: "radio",
                                                name: "rotate-storage-pre-rotated",
                                                value: "download",
                                            }),
                                            m("label", "Download"))))))),
                    m("div", {class: "ui center aligned vertical segment"},
                        m("button", {class: "ui button",
                            type: "submit"}, "Run Key Rotation"))),
                m("div", {id: "rotate-success", class: "ui positive message hidden"},
                    m("i", {class: "close icon"}),
                    m("div", {class: "header"}, "Key Rotation Success"),
                    m("p", {id: "rotate-success-message"}, "Your new keys have successfully been rotated.")),
                m("div", {id: "rotate-fail", class: "ui negative message hidden"},
                    m("i", {class: "close icon"}),
                    m("div", {class: "header"}, "Key Rotation Failure"),
                    m("p", {id: "rotate-fail-message"}))))));

// ================================================== //

$(".menu .item").tab();
$(".close.icon").click(function () {
    $(this).parent().addClass("hidden");
});
$(".popup").popup();

// ================================================== //
//                        EOF                         //
// ================================================== //