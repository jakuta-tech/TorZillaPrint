'use strict';

function outputHeaders() {
	let t0 = performance.now(),
		r = ""
	// DNT
	try {r = navigator.doNotTrack} catch(e) {r = "error"}
	dom.nDNT = r
	// online
	try {r = navigator.onLine} catch(e) {r = "error"}
	dom.nOnLine = r
	// network info api
	if ("connection" in navigator) {
		dom.nNetwork = zE
		try {r = navigator.connection.type} catch(e) {r = "error"}
		dom.nConnection.innerHTML = r += (r == "unknown" ? rfp_green : rfp_red)
	} else {
		dom.nNetwork = zD
		try {r = navigator.connection} catch(e) {r = "error"}
		dom.nConnection = r
	}
	// perf
	debug_page("perf","headers",t0,gt0)
}

outputHeaders()
