/* TABLE: Media */

'use strict';

// media.media-capabilities.enabled
if ("mediaCapabilities" in navigator) {dom.nMediaCapabilities="enabled"}
	else {if (Symbol.for(`foo`).description == "foo"){dom.nMediaCapabilities="disabled"}
		else {dom.nMediaCapabilities="not supported"};};
