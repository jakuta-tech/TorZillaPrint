'use strict';

var dom;
var jsZoom;

var tor_browser_green = " <span class='good'>[TB]</span>"; // u2713
var tor_browser_red = " <span class='bad'>[TB]</span>"; // u2715
var rfp_green = " <span class='good'>[RFP]</span>";
var rfp_red = " <span class='bad'>[RFP]</span>";

// notation when consecutive tests detect noise / randomization
var note_random = " <span class='good'>[random]</span>"

// notation for developer
var note_file = " <span class='neutral'>[file:]</span>"
var note_testtocome = " <span class='neutral'>test to come</span>"

// generic errors so we can output something for the end user
var error_file_cors = "<span class='neutral'>[file:] [Cross-Origin Request Blocked]</span>"
var error_file_xhr = "<span class='bad'>[test error: xhr]</span>";
var error_iframe = "<span class='bad'>[test error: iframe]</span>";
var error_image = "<span class='bad'>[test error: image]</span>";

// sometimes we only want to test or output for Firefox
var amFF = false;
if (isNaN(window.mozPaintCount) === false) {amFF = true};

/* other Firefox detection methods
if (isNaN(window.mozInnerScreenX) === false) {"amFF = true"};
if (isNaN(window.window.scrollMaxX) === false) {"amFF = true"};
if (navigator.oscpu == undefined){} else {"amFF = true"}; */
