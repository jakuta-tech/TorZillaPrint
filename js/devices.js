/* TABLE: Devices & Hardware */

'use strict';

/* global variables: generic.js
	RFPy:  green [RFP]
	RFPn:    red [RFP]
	TTC : yellow [test to come]
*/

function outputDevices() {

	// multipurpose string
	let str = "";

	// hardwareConcurrency
	str = navigator.hardwareConcurrency;
	if (str == "2") {
		str = str + RFPy
	} else {
		str = str + RFPn
	};
	dom.nHardwareConcurrency.innerHTML = str;

	// maxTouchPoints
	str = "";
	str = navigator.maxTouchPoints;
	if (str == "0") {
		str = str + RFPy
	} else {
		str = str + RFPn
	};
	dom.nMaxTouchPoints.innerHTML = str;

	// gamepads
	if (navigator.getGamepads) {
		dom.nGetGamepads="enabled"
	} else {
		dom.nGetGamepads="disabled"
	};

	// media.navigator.enabled
	if ("mediaDevices" in navigator) {
		dom.nMediaDevices="enabled";
		// enumerate media devices
		try {
			dom.eMediaDevices.innerHTML=TTC;
		} catch(e) {
			dom.eMediaDevices="no: " + e.name
		};
	}	else {
		dom.nMediaDevices="disabled";
		dom.eMediaDevices="n/a";
	};

	// dom.vr.enabled
	if ("getVRDisplays" in navigator) {
		dom.nGetVR="enabled";
		// active VR displays
		if ("activeVRDisplays" in navigator) {
			if (navigator.activeVRDisplays == "") {
				dom.nActiveVR="[empty array]";
			} else {
				dom.nActiveVR=navigator.activeVRDisplays;
			};
		};
	}	else {
		dom.nGetVR="disabled";
		dom.nActiveVR="n/a";
	};

	// media.webspeech.synth.enabled
	if ("speechSynthesis" in window) {
		dom.speechSynth="enabled"
		// speech engines
		//	 ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
		// get properties of each voice: eg SpeechSynthesisVoice.default 
		//	 ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice		
		// dom.speechEngines = speechSynthesis.getVoices().map(v => v.name+"|"+v.lang);
		dom.speechEngines.innerHTML=TTC;
	} else {
		dom.speechSynth="disabled";
		dom.speechEngines="n/a";
	};

};

outputDevices();
