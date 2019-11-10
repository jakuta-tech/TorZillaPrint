/* TABLE: Media */

'use strict';

function outputMedia() {
	let t0 = performance.now();
	let e = "enabled", d = "disabled", ns = "not supported";

	// media.media-capabilities.enabled : FF63+
	dom.nMediaCapabilities = ("mediaCapabilities" in navigator ? e : (Symbol.for(`foo`).description == "foo" ? d : ns))

	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section media: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputMedia();
