/* TABLE: HTTP Headers */

'use strict';

function outputHeaders() {
	let t0 = performance.now();
	// dnt
	dom.nDoNotTrack = navigator.doNotTrack;
	dom.nOnLine = navigator.onLine;
	// network info api: dom.netinfo.enabled
	if ("connection" in navigator) {
		dom.nNetwork = "enabled";
		dom.nConnection = navigator.connection.type;
	} else {
		dom.nNetwork = "disabled";
		dom.nConnection = navigator.connection;
	};
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section headers: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputHeaders();
