/* TABLE: HTTP Headers */

'use strict';

function outputHeaders() {
	let t0 = performance.now();

	dom.nDNT = navigator.doNotTrack;
	dom.nOnLine = navigator.onLine;

	// network info api: dom.netinfo.enabled
	if ("connection" in navigator) {
		dom.nNetwork = "enabled";
		let s = navigator.connection.type;
		dom.nConnection.innerHTML = (s == "unknown" ? s + rfp_green : s + rfp_red)
	} else {
		dom.nNetwork = "disabled";
		dom.nConnection = navigator.connection;
	};

	// perf
	let t1 = performance.now();
	outputDebug("1", "headers", (t1-t0), (t1 - gt0));
};

outputHeaders();
