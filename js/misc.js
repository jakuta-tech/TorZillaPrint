/* TABLE: Miscellaneous */

'use strict';

function outputMisc() {

	// mathml: control/none = visible + no distortion of height: compare control to test
	let mathmlString = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo><mi>b</mi>"+
		"<mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"+
		"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"+
		"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>";
	document.getElementById("mathmltest").innerHTML = mathmlString;
	let mathmlnone = document.getElementById("pReducedMotion").offsetHeight;
	let mathmltest = document.getElementById("mathmltest").offsetHeight;
	if ( mathmltest == mathmlnone) {
		dom.mathml = "disabled"
	} else {
		dom.mathml = "enabled"
	};

	// clipboard
	if ("clipboard" in navigator) {
		dom.nClipboard = "enabled"
	} else {
		dom.nClipboard = "disabled"
	};

	// dom.IntersectionObserver.enabled
	let callback = function(entries, observer) {};
	try {
		let observer = new IntersectionObserver(callback);
		dom.intObserver = "enabled";
	} catch(e) {
		dom.intObserver = "disabled"
	};

	// dom.requestIdleCallback.enabled
	if ("requestIdleCallback" in window) {
		dom.reqIdleCB = "enabled"
	} else {
		dom.reqIdleCB = "disabled"
	};

};

outputMisc();
