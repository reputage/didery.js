// ================================================== //
//                     DASHBOARD                      //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited: 06/12/2018                            //
// Last Edited By: Brady Hammond                      //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

import 'babel-polyfill';
import * as didery from '../../src/index.js';
const m = require('mithril');

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

let eventSource = null;

let subscribe = function(e) {
    e.preventDefault();
    $('.error').removeClass("error");
    let url = $('#sse-url').val();
    let did = $('#sse-did').val();

    if (url === "") {
        $('#sse-url').parent().addClass("error");
        return;
    }

    if (eventSource !== null) {
        eventSource.close();
        eventSource = null;
    }
    let fullURL = url.replace(/\/$/, "") + "/stream/history";
    if (did !== "") {
        fullURL = fullURL + "/" + did;
    }
    eventSource = new EventSource(fullURL);
    eventSource.onmessage = function(e) {
        let data = e.data;
        console.log(data);
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        $('#sse-result').text(JSON.stringify(data, null, 2));
    };

    eventSource.onopen = function(e) {
        console.log("Connecting to: " + fullURL + ".");
    };

    eventSource.onerror = function(e) {
        if (e.readyState === EventSource.CLOSED) {
            console.error("Connection to: " + fullURL + " was lost.");
        }
        console.log("Reconnecting to: " + fullURL + ".");
    };
};

// ================================================== //
//                       MAIN                         //
// ================================================== //

m.render(document.body,
    m("div", {class: "ui container"},
        m("div", {class: "ui top attached tabular menu"},
            m("a[data-tab=sse]", {class: "active item"},
                m("i", {class: "rss icon"}),
                m("div", "Server Sent Events"))),
        m("div[data-tab=sse]", {class: "ui bottom attached tab segment active"},
            m("div", {class: "ui container segment"},
                m("form", {class: "ui form", action: "#", onsubmit: subscribe},
                    m("div", {class: "field"},
                        m("label", "Server URL ",
                            m("span[data-content=This is the URL of your didery server.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "sse-url",
                            class: "required",
                            type: "text",
                            placeholder: "Server URL ..."})),
                    m("div", {class: "field"},
                        m("label", "DID ",
                            m("span[data-content=This is the decentralized identifier string associated with a specific key " +
                                "history.][data-variation=wide]", {class: "popup", style: "cursor: pointer;"},
                                m("i", {class: "icon question circle outline"}))),
                        m("input", {id: "sse-did",
                            type: "text",
                            placeholder: "DID ..."})),
                    m("div", {class: "ui center aligned vertical segment"},
                        m("button", {class: "ui button",
                            type: "submit"}, "Subscribe"))),
                m("div", {class: "ui container segment",
                    style: "min-height: 500px; height: 500px; overflow: scroll;"},
                    m("pre", {id: "sse-result"}))))));


// ================================================== //

$(".menu .item").tab();

// ================================================== //
//                        EOF                         //
// ================================================== //