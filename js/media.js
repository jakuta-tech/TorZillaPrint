/* TABLE: Media */

'use strict';

function outputMedia() {
	let t0 = performance.now();
	let e = "enabled", d = "disabled", ns = "not supported";

	// media.media-capabilities.enabled : FF63+
	dom.nMediaCapabilities = ("mediaCapabilities" in navigator ? e : (Symbol.for(`foo`).description == "foo" ? d : ns))

	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "media", (t1-t0), (t1 - gt0))};
};

outputMedia();
