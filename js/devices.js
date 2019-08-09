/* TABLE: Devices & Hardware */

'use strict';

function outputDevices() {
	let t0 = performance.now();

	// hardwareConcurrency
	let str = "";
	str = navigator.hardwareConcurrency;
	if (str == "2") {
		str = str + rfp_green
	} else {
		str = str + rfp_red
	};
	dom.nHardwareConcurrency.innerHTML = str;

	// maxTouchPoints
	str = "";
	str = navigator.maxTouchPoints;
	if (str == "0") {
		str = str + rfp_green
	} else {
		str = str + rfp_red
	};
	dom.nMaxTouchPoints.innerHTML = str;

	// gamepads
	if (navigator.getGamepads) {
		dom.nGetGamepads = "enabled"
	} else {
		dom.nGetGamepads = "disabled"
	};

	// media.navigator.enabled
	if ("mediaDevices" in navigator) {
		dom.nMediaDevices = "enabled"
		// enumerate media devices
		try {
			dom.eMediaDevices.innerHTML = note_testtocome
		} catch(e) {
			dom.eMediaDevices = "no: " + e.name
		}
	}	else {
		dom.nMediaDevices = "disabled";
		dom.eMediaDevices = "n/a";
	};

	// dom.vr.enabled
	if ("getVRDisplays" in navigator) {
		dom.nGetVR = "enabled";
		// active VR displays
		if ("activeVRDisplays" in navigator) {
			if (navigator.activeVRDisplays == "") {
				dom.nActiveVR = "[empty array]"
			} else {
				dom.nActiveVR = navigator.activeVRDisplays
			}
		}
	}	else {
		dom.nGetVR = "disabled";
		dom.nActiveVR = "n/a";
	};

	// media.webspeech.synth.enabled
	if ("speechSynthesis" in window) {
		dom.speechSynth = "enabled";
		// speech engines
		dom.speechEngines.innerHTML = note_testtocome;
	} else {
		dom.speechSynth = "disabled";
		dom.speechEngines = "n/a";
	};

	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section devices: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputDevices();
