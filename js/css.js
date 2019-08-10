/* TABLE: CSS */

'use strict';

function get_prefers_color_scheme(){
	let el = document.getElementById("pColorElement");
	let k = window.getComputedStyle(el, null).getPropertyValue("background-color");
	if (k == "rgb(255, 255, 255)") {k = "light" + rfp_green}
	else if (k == "rgb(255, 0, 0)") {k = "not supported"}
	else if (k == "rgb(0, 0, 0)") {k = "dark" + rfp_red}
	else if (k == "rgb(0, 0, 255)") {k = "no-preference" + rfp_red};
	dom.pColorScheme.innerHTML = k;
};

function get_prefers_reduced_motion() {
	let el = document.getElementById("pMotionElement");
	let k = window.getComputedStyle(el, null).getPropertyValue("background-color");
	if (k == "rgb(255, 255, 255)") {k = "no-preference" + rfp_green}
	else if (k == "rgb(255, 0, 0)") {k = "not supported"}
	else if (k == "rgb(0, 0, 0)") {k = "reduce" + rfp_red};
	dom.pReducedMotion.innerHTML = k;
};

function get_system_colors() {
	let str = "",
		array = ['ActiveBorder', 'ActiveCaption', 'AppWorkspace', 'Background', 'ButtonFace', 'ButtonHighlight', 'ButtonShadow',
	'ButtonText', 'CaptionText', 'GrayText', 'Highlight', 'HighlightText', 'InactiveBorder', 'InactiveCaption', 'InactiveCaptionText',
	'InfoBackground', 'InfoText', 'Menu', 'MenuText', 'Scrollbar', 'ThreeDDarkShadow','ThreeDFace', 'ThreeDHighlight',
	'ThreeDLightShadow', 'ThreeDShadow', 'Window', 'WindowFrame', 'WindowText'];
	let el = document.getElementById("sColorElement");
	array.forEach(function (item) {
		el.style.backgroundColor = item;
		str = str + window.getComputedStyle(el, null).getPropertyValue("background-color")
	});
	str = sha1(str);
	if (str == "b5e2344c265fc498d2fb8e0f84951e8d501ad481") {
		str = str + rfp_green
	} else {
		str = str + rfp_red
	};
	dom.sColorHash.innerHTML = str;
};

function outputCSS() {
	let t0 = performance.now();
	// functions
	get_prefers_color_scheme();
	get_prefers_reduced_motion();
	get_system_colors();
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section css: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputCSS();
