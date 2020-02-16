/* TABLE: Media */
'use strict';

function outputMedia() {
	let t0 = performance.now()

	// mediaCapabilities: FF63+
	dom.nMediaC = ("mediaCapabilities" in navigator ? zE : (Symbol.for(`foo`).description == "foo" ? zD : zNS))

	// perf
	debug_page("perf","media",t0,gt0)
}

outputMedia()
