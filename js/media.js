/* TABLE: Media */

'use strict';

function outputMedia() {
	let t0 = performance.now();
	// media.media-capabilities.enabled : FF63+
	if ("mediaCapabilities" in navigator) {
		dom.nMediaCapabilities = "enabled"
	} else {
		// FF63 feature test
		if (Symbol.for(`foo`).description == "foo") {
			dom.nMediaCapabilities = "disabled"
		} else {
			dom.nMediaCapabilities = "not supported"
		}
	};
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section media: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputMedia();
