'use strict';

function outputHeaders() {
	let t0 = performance.now()
	dom.nDNT = navigator.doNotTrack
	dom.nOnLine = navigator.onLine
	// network info api
	if ("connection" in navigator) {
		dom.nNetwork = zE
		let r = navigator.connection.type
		dom.nConnection.innerHTML = r += (r == "unknown" ? rfp_green : rfp_red)
	} else {
		dom.nNetwork = zD
		dom.nConnection = navigator.connection
	}
	// perf
	debug_page("perf","headers",t0,gt0)
}

outputHeaders()
