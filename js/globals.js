'use strict';

var firstH = window.innerHeight;
var firstW = window.innerWidth;

var dom;
var jsZoom;

let sb = " <span class='bad'>",
	sg = " <span class='good'>",
	sn = " <span class='neutral'>",
	so = " <span class='orange'>",
	se = " <span class='bad'>[test error: ",
	s1 = " <span class='s1'>",
	sc = "</span>";

// notation
var tor_browser_green = sg + "[TB]" + sc; // u2713
var tor_browser_red =  sb + "[TB]" + sc; // u2715
var slider_standard = sg + "[TB Standard]" + sc;
var slider_safer = sg + "[TB Safer]" + sc;
var rfp_green = sg + "[RFP]" + sc;
var rfp_red = sb + "[RFP]" + sc;
var lb_green = sg + "[LB]" + sc;
var lb_red = sb + "[LB]" + sc;
var lb_orange = so + "[LB and RFP New Window only work at 100% zoom]" + sc;
var nw_green = sg + "[RFP New Window]" + sc;
var nw_red = sb + "[RFP New Window]" + sc;
var enUS_green = sg + "[en-US]</span> ";
var enUS_red = sb + "[en-US]</span> ";
var spoof_green = sg + "[Spoof English]" + sc;
var spoof_red = sb + "[Spoof English]" + sc;
var spoof_both_green = sg + "[Spoof English + RFP]" + sc;
var spoof_both_red = sb + "[Spoof English +/or RFP]" + sc;
var default_tb_green = sg + "[TB default]" + sc;
var default_ff_green = sg + "[FF default]" + sc;
var default_red = sb + "[unusual]" + sc;
var note_random = sg + "[random]" + sc;
var note_file = "";
var note_rounded = so + "[rounded down]" + sc;
if (location.protocol == "file:") {
	note_file = sn + "[file:]" + sc;
};
var note_testtocome = sn + "test to come" + sc;

// generic errors
var error_file_404 = se + "file not found]" + sc;
var error_file_cors = sn + "[file:] [Cross-Origin Request Blocked]" + sc;
var error_file_xhr = se + "xhr]" + sc;
var error_iframe = se + " iframe]" + sc;
var error_image = se + "image]" + sc;
var error_global_os = sb + "[test error: global variable not set]" + sc;

// other
var isPage = "main";
var isFirefox = false;
var isTorBrowser = false;
var isMajorOS = ""; // windows, mac, linux, android
var isVersion = ""; // 2-digit numeric
if (isNaN(window.mozInnerScreenX) === false) {isFirefox = true};
	/* other FF methods
	if (isNaN(window.mozPaintCount) === false) {isFirefox = true};
	// see 1591968: dom.mozPaintCount.enabled
	if (isNaN(window.window.scrollMaxX) === false) {"isFirefox = true"};
	if (navigator.oscpu == undefined){} else {"isFirefox = true"}; */

// android viewport height
var avh = "";

// storage debug
var sDebug = false;

// perf
var mPerf = true; // minor
var sPerf = true; // section
var sRerun = false // 
var gt0;
