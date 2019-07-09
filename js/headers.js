/* TABLE: HTTP Headers */

'use strict';

function outputHeaders() {

	// DoNotTrack
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

};

outputHeaders();
