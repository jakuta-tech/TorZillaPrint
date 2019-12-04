/* TABLE: Miscellaneous */

'use strict';

function outputMisc() {
	let t0 = performance.now();
	let e = "enabled", d = "disabled";

	// beacon.enabled
	dom.nBeacon = (navigator.sendBeacon ? e : d);

	// dom.events.asyncClipboard
	dom.nClipboard = ("clipboard" in navigator ? e: d); // FF63+

	// dom.requestIdleCallback.enabled
	dom.reqIdleCB = ("requestIdleCallback" in window ? e: d);

	// dom.media.mediasession.enabled
	dom.mediaSession = ("mediaSession" in navigator ? e: d); // FF71+

	// mathml: control/none = visible + no distortion of height: compare control to test
	let mathmlString = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo><mi>b</mi>"+
		"<mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"+
		"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"+
		"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>";
	document.getElementById("mathmltest").innerHTML = mathmlString;
	let mathmlnone = document.getElementById("pReducedMotion").offsetHeight;
	let mathmltest = document.getElementById("mathmltest").offsetHeight;
	dom.mathml = (mathmltest == mathmlnone ? d : e);

	// dom.IntersectionObserver.enabled
	let callback = function(entries, observer) {};
	try {
		let observer = new IntersectionObserver(callback);
		dom.intObserver = e
	} catch(e) {
		dom.intObserver = d
	};

	// javascript.options.wasm
	const supported = (() => {
		try {
			if (typeof WebAssembly === "object"	&& typeof WebAssembly.instantiate === "function") {
				const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
				if (module instanceof WebAssembly.Module)
					return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
			}
		} catch (e) {}
		return false;
	})();
	dom.wasm = (supported ? e : d);

	// dom.webshare.enabled (todo canShare)
	dom.webshare = (navigator.share ? "enabled" : "disabled")

	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "misc", (t1-t0), (t1 - gt0))};
};

outputMisc();
