/* TABLE: Media */

'use strict';

function outputMedia() {

	// media.media-capabilities.enabled : FF63+
	if ("mediaCapabilities" in navigator) {
		dom.nMediaCapabilities="enabled";
	} else {
		// FF63 feature test
		if (Symbol.for(`foo`).description == "foo") {
			dom.nMediaCapabilities="disabled";
		} else {
			dom.nMediaCapabilities="not supported";
		};
	};

};

outputMedia();
