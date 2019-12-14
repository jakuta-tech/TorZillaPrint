/* TABLE: Devices & Hardware */

'use strict';

function outputDevices() {
	let t0 = performance.now();
	let e = "enabled", d = "disabled", ns = "not supported", na = "n/a";

	// hardwareConcurrency
	let str = "";
	str = navigator.hardwareConcurrency;
	dom.nHardwareConcurrency.innerHTML = (str == "2" ? str + rfp_green : str + rfp_red);

	// maxTouchPoints
	str = "";
	str = navigator.maxTouchPoints;
	dom.nMaxTouchPoints.innerHTML = (str == "0" ? str + rfp_green : str + rfp_red);

	// gamepads
	dom.nGetGamepads = (navigator.getGamepads ? e: d);

	// media.navigator.enabled
	if ("mediaDevices" in navigator) {
		dom.nMediaDevices = e
		// enumerate media devices
		try {
			dom.eMediaDevices.innerHTML = note_testtocome
		} catch(e) {
			dom.eMediaDevices = "no: " + e.name
		}
	}	else {
		dom.nMediaDevices = d;
		dom.eMediaDevices = na;
	};

	// dom.vr.enabled
	if ("getVRDisplays" in navigator) {
		dom.nGetVR = e;
		// active VR displays
		if ("activeVRDisplays" in navigator) {
			if (navigator.activeVRDisplays == "") {
				dom.nActiveVR = "[empty array]"
			} else {
				dom.nActiveVR = navigator.activeVRDisplays
			}
		}
	}	else {
		dom.nGetVR = d;
		dom.nActiveVR = na;
	};

	// media.webspeech.synth.enabled
	if ("speechSynthesis" in window) {
		dom.speechSynth = e;
		// speech engines
		dom.speechEngines.innerHTML = note_testtocome;
	} else {
		dom.speechSynth = d;
		dom.speechEngines = na;
	};

	// media.webspeech.recognition.enable
	// NOTE: media.webspeech.test.enable intil landed
	try {
		let recognition = new SpeechRecognition();
		dom.speechRec = e;
	} catch(e) {
		// undefined
		dom.speechRec = d + " [or " + ns + "]"
	}

	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "devices", (t1-t0), (t1 - gt0))};
};

outputDevices();
