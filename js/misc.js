/* TABLE: Miscellaneous */

'use strict';

function countCharacter(str, char) {
    return str.split('').reduce((a, x) => x === char ? ++a : a, 0);
};

function get_svg() {
	// create svg
	let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg1.setAttribute("width", "100");
	svg1.setAttribute("height", "100");
	// create circle
	let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	c.setAttributeNS(null,"cx",50);
	c.setAttributeNS(null,"cy",50);
	c.setAttributeNS(null,"r",40);
	// attach circle to svg and svg to element
	svg1.appendChild(c);
	dom.svgDiv.appendChild(svg1);
	// output
	dom.svgBasicTest = (dom.svgDiv.offsetHeight > 0 ? "enabled" : "disabled");
	// remove
	document.getElementById("svgDiv").removeChild(svg1);
}

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
	// security.webauth.webauthn / security.webauth.u2f
	dom.webauth = ("credentials" in navigator ? e: d) + " | " + ("u2f" in window ? e: d);
	// dom.webshare.enabled
	dom.webshare = (navigator.share ? e : d)

	// mathml: control/none = visible + no distortion of height: compare control to test
	let mathmlString = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo><mi>b</mi>"+
		"<mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"+
		"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"+
		"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>";
	document.getElementById("mathmltest").innerHTML = mathmlString;
	let mathmlnone = document.getElementById("pReducedMotion").offsetHeight;
	let mathmltest = document.getElementById("mathmltest").offsetHeight;
	dom.mathml.innerHTML = (mathmltest == mathmlnone ? d + slider_safer : e + slider_standard);

	// dom.IntersectionObserver.enabled
	let callback = function(entries, observer) {};
	try {
		let observer = new IntersectionObserver(callback);
		dom.intObserver = e
	} catch(e) {
		dom.intObserver = d
	};

	// javascript.options.wasm
	let supported = (() => {
		try {
			if (typeof WebAssembly === "object"	&& typeof WebAssembly.instantiate === "function") {
				const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
				if (module instanceof WebAssembly.Module)
					return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
			}
		} catch (e) {}
		return false;
	})();
	// dom.wasm.innerHTML = (supported ? e + slider_standard : d + slider_safer); // currently only alpha
	dom.wasm = (supported ? e : d );

	// dom.use_components_shim
	let comshim = (typeof Components === "undefined") ? "undefined" : Object.getOwnPropertyNames(Components.interfaces).join("~");
	if (comshim !== "undefined") {
		let k = comshim.split('~').length-1;
		comshim = sha1(comshim) + " [" + (k+1) + " items]";
	};
	dom.comshim = comshim;

	// svg.disabled
	get_svg();

	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "misc", (t1-t0), (t1 - gt0))};
};

outputMisc();
