/* TABLE: Miscellaneous */

'use strict';

function countCharacter(str, char) {
		return str.split('').reduce((a, x) => x === char ? ++a : a, 0);
};

function get_components() {
	let comshim = (typeof Components === "undefined") ? "undefined" : Object.getOwnPropertyNames(Components.interfaces).join("~");
	dom.comshim2 = comshim.replace(/~/g, ", ");
	if (comshim !== "undefined") { comshim = sha1(comshim) + " [" + comshim.split('~').length + " items]"; };
	dom.comshim = comshim;
	dom.comshim2.style.color = zshow;
};

function get_mathml(type) {
	// compare control to test
	if (type !== "load") {
		// rebuild test: only if not loading the page
		let mathmlString = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo><mi>b</mi>"+
		"<mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"+
		"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"+
		"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>";
		dom.mathmltest.innerHTML = mathmlString;
		dom.mathmltest.style.color = zshow;
	}
	// measure
	let mathmltest = dom.mathmltest.offsetHeight;
	let mathmlnone = dom.nOnLine.offsetHeight; // a row with plain text and info icon
	let mdiff = Math.abs(mathmltest-mathmlnone);
	// use a range: zoom affects line height: mathml enabled the diff is > 20
	dom.mathml.innerHTML = (mdiff < 10 ?
		"disabled | offsetHeight difference: "+ mdiff+ tb_safer  :
		"enabled | offsetHeight difference: "+ mdiff+ tb_standard
	);
};

function get_nav_prototype() {
	let nProto = Object.keys(Object.getPrototypeOf(navigator)).join("~");
	dom.nProto = sha1(nProto) + " [" + nProto.split('~').length + " items]";
	dom.nProto2 = nProto.replace(/~/g, ", ");
	dom.nProto2.style.color = zshow;
};

function get_svg() {
	let t0 = performance.now();
	// svg
	let s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	s.setAttribute("width", "100");
	s.setAttribute("height", "100");
	// circle
	let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	c.setAttributeNS(null,"cx",50);
	c.setAttributeNS(null,"cy",50);
	c.setAttributeNS(null,"r",40);
	// attach circle->svg->element
	s.appendChild(c);
	dom.svgDiv.appendChild(s);
	// output
	dom.svgBasicTest = (dom.svgDiv.offsetHeight > 0 ? "enabled" : "disabled");
	// remove
	dom.svgDiv.removeChild(s);
	// perf
	let t1 = performance.now();
	if (mPerf) {console.debug("misc svg: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function get_wasm() {
	// wasm
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
	// dom.wasm.innerHTML = (supported ? e + tb_standard : d + tb_safer); // currently only alpha
	dom.wasm = (supported ? "enabled" : "disabled" );
};

function reset_misc() {
	// hide w/ color: don't shrink elements
	dom.nProto2.style.color = zhide;
	dom.comshim2.style.color = zhide;
	dom.mathmltest.style.color = zhide;
}

function outputMisc(type) {
	let t0 = performance.now();
	let e = "enabled", d = "disabled", ns = "not supported";

	// one-liners (1ms)
	dom.nBeacon = (navigator.sendBeacon ? e : d);
	dom.nClipboard = ("clipboard" in navigator ? e: d); // FF63+
	dom.reqIdleCB = ("requestIdleCallback" in window ? e: d);
	dom.mediaSession = ("mediaSession" in navigator ? e: d); // FF71+
	dom.webauth = ("credentials" in navigator ? e: d) + " | " + ("u2f" in window ? e: d);
	dom.webshare = (navigator.share ? e : d)

	// functions
	get_svg();
	get_mathml(type);
	get_wasm();
	get_components();
	get_nav_prototype();

	// intersection observer
	let callback = function(entries, observer) {};
	try {
		let observer = new IntersectionObserver(callback);
		dom.intObserver = e
	} catch(e) {
		dom.intObserver = d
	};

	// reporting api FF65+
	try {
		let observer = new ReportingObserver(function() {});
		dom.reportingAPI = e;
	} catch(e) {
		if (isFF) {
			dom.reportingAPI = (isVer > 64 ? d : ns )
		} else {
			dom.reportingAPI = d + " [or " + ns + "]";
		}
	}

	// perf
	let t1 = performance.now();
	outputDebug("1", "misc", (t1-t0), (t1 - gt0));
};

outputMisc("load");
