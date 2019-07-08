/* TABLE: Devices & Hardware */

'use strict';

function outputDevices() {

	/*** navigator */
	let tmpD = navigator.hardwareConcurrency;
	if (tmpD == "2") {tmpD = tmpD + RFPy} else {tmpD = tmpD + RFPn}
	dom.nHardwareConcurrency.innerHTML = tmpD;
	tmpD = navigator.maxTouchPoints;
	if (tmpD == "0") {tmpD = tmpD + RFPy} else {tmpD = tmpD + RFPn}
	dom.nMaxTouchPoints.innerHTML = tmpD;
	if (navigator.getGamepads) {dom.nGetGamepads="enabled"} else {dom.nGetGamepads="disabled"};

	/*** media devices (media.navigator.enabled) */
	if ("mediaDevices" in navigator) {
		dom.nMediaDevices="enabled";
		/*** enumerate media devices */
		try {
			// don't do if insecure or file?
			// navigator.mediaDevices.getUserMedia({audio:true});
			dom.eMediaDevices.innerHTML=TTC;
		}
		catch(e) {dom.eMediaDevices="no: " + e.name};
	}
	else {
		dom.nMediaDevices="disabled";	dom.eMediaDevices="n/a";
	};

	/*** media.webspeech.synth.enabled */
	if ("speechSynthesis" in window) {
		dom.speechSynth="enabled"
		/*** speech engines */
		//	 ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
		// get properties of each voice: eg SpeechSynthesisVoice.default 
		//	 ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice		
		// dom.speechEngines = speechSynthesis.getVoices().map(v => v.name+"|"+v.lang);
		dom.speechEngines.innerHTML=TTC;
	}
	else {
		dom.speechSynth="disabled"; dom.speechEngines="n/a";
	};

	/*** VR (dom.vr.enabled) */
	if ("getVRDisplays" in navigator) {
		dom.nGetVR="enabled";
		/*** active */
		if ("activeVRDisplays" in navigator) {
			if (navigator.activeVRDisplays == "") {dom.nActiveVR="[empty array]"}
			else {dom.nActiveVR=navigator.activeVRDisplays};
		};
	}
	else {
		dom.nGetVR="disabled"; dom.nActiveVR="n/a";
	};

};

outputDevices();
