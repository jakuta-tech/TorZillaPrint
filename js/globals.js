'use strict';

var dom;
var jsZoom;

var tor_browser_green = " <span class='good'>[TB]</span>"; // u2713
var tor_browser_red = " <span class='bad'>[TB]</span>"; // u2715
var rfp_green = " <span class='good'>[RFP]</span>";
var rfp_red = " <span class='bad'>[RFP]</span>";

// notation when consecutive tests detect noise / randomization
var note_random = " <span class='good'>[random]</span>";

// notation for developer
var note_file = "";
if ((location.protocol) == "file:") {
	note_file = " <span class='neutral'>[file:]</span>";
};
var note_testtocome = " <span class='neutral'>test to come</span>";

// generic errors so we can output something for the end user
var error_file_cors = "<span class='neutral'>[file:] [Cross-Origin Request Blocked]</span>";
var error_file_xhr = "<span class='bad'>[test error: xhr]</span>";
var error_iframe = "<span class='bad'>[test error: iframe]</span>";
var error_image = "<span class='bad'>[test error: image]</span>";
var error_global_os = "<span class='bad'>[test error: global variable not set]</span>";

// what page is loaded: so as to not autorun some tests
var isPage = "main";

// sometimes we only want to test for Firefox
// or provide a different test based on some criteria
var isFirefox = false;
var isTorBrowser = false;
var isMajorOS = ""; // windows, mac, linux, android
var isVersion = ""; // 2-digit numeric

// we can check this one here
if (isNaN(window.mozPaintCount) === false) {isFirefox = true};
/* other Firefox detection methods
if (isNaN(window.mozInnerScreenX) === false) {"isFirefox = true"};
if (isNaN(window.window.scrollMaxX) === false) {"isFirefox = true"};
if (navigator.oscpu == undefined){} else {"isFirefox = true"}; */

// storage debugging
var sDebug = false;

// performance
var mPerf = true; // minor
var sPerf = true; // section
var gt0;
