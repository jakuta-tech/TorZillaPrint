'use strict';

var dom;
var jsZoom;

var tor_browser_green = " <span class='good'>[TB]</span>"; // u2713
var tor_browser_red = " <span class='bad'>[TB]</span>"; // u2715

var rfp_green = " <span class='good'>[RFP]</span>";
var rfp_red = " <span class='bad'>[RFP]</span>";

var note_file = " <span class='ttc'>[file:]</span>"
var note_testtocome = " <span class='ttc'>test to come</span>"

var error_file_cors = "<span class='ttc'>[file:] [Cross-Origin Request Blocked]</span>"
var error_file_xhr = "<span class='bad'>[test error: xhr]</span>";
var error_iframe = "<span class='bad'>[test error: iframe]</span>";

var amFF = false;
if (isNaN(window.mozPaintCount) === false) {amFF = true};

/* other Firefox detection methods
if (isNaN(window.mozInnerScreenX) === false) {"amFF = true"};
if (isNaN(window.window.scrollMaxX) === false) {"amFF = true"};
if (navigator.oscpu == undefined){} else {"amFF = true"}; */
