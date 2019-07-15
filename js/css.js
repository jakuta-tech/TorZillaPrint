/* TABLE: CSS */

'use strict';

function outputCSS() {
	let pRGB = "";

	// prefers-color-scheme
	let pColorElem = document.getElementById("pColorElement");
	pRGB = window.getComputedStyle(pColorElem, null).getPropertyValue("background-color");
	if (pRGB == "rgb(255, 255, 255)") {pRGB = "light" + rfp_green}
	else if (pRGB == "rgb(255, 0, 0)") {pRGB = "not supported"}
	else if (pRGB == "rgb(0, 0, 0)") {pRGB = "dark" + rfp_red}
	else if (pRGB == "rgb(0, 0, 255)") {pRGB = "no-preference" + rfp_red};
	dom.pColorScheme.innerHTML = pRGB;

	// prefers-reduced-motion
	pRGB = "";
	let pMotionElem = document.getElementById("pMotionElement");
	pRGB = window.getComputedStyle(pMotionElem, null).getPropertyValue("background-color");
	if (pRGB == "rgb(255, 255, 255)") {pRGB = "no-preference" + rfp_green}
	else if (pRGB == "rgb(255, 0, 0)") {pRGB = "not supported"}
	else if (pRGB == "rgb(0, 0, 0)") {pRGB = "reduce" + rfp_red};
	dom.pReducedMotion.innerHTML = pRGB;

	// system colors
	let sColorStr = "", clrValue = "";
	let sColorArray = ['ActiveBorder', 'ActiveCaption', 'AppWorkspace', 'Background', 'ButtonFace', 'ButtonHighlight', 'ButtonShadow',
	'ButtonText', 'CaptionText', 'GrayText', 'Highlight', 'HighlightText', 'InactiveBorder', 'InactiveCaption', 'InactiveCaptionText',
	'InfoBackground', 'InfoText', 'Menu', 'MenuText', 'Scrollbar', 'ThreeDDarkShadow','ThreeDFace', 'ThreeDHighlight',
	'ThreeDLightShadow', 'ThreeDShadow', 'Window', 'WindowFrame', 'WindowText'];
	let sColorElem = document.getElementById("sColorElement");
	sColorArray.forEach(function (arrayItem) {
		sColorElem.style.backgroundColor = arrayItem;
		sColorStr = sColorStr + window.getComputedStyle(sColorElem, null).getPropertyValue("background-color")
	});
	let sColorHash = sha1(sColorStr);
	if (sColorHash == "b5e2344c265fc498d2fb8e0f84951e8d501ad481") {
		sColorHash = sColorHash + rfp_green
	} else {
		sColorHash = sColorHash + rfp_red
	};
	dom.sColorHash.innerHTML = sColorHash;

};

outputCSS();
