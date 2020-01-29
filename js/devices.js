/* TABLE: Devices & Hardware */

'use strict';

function reset_devices() {
	// hide w/ color: don't shrink elements
	dom.mimeTypes.style.color = zhide;
	dom.plugins.style.color = zhide;
	dom.eMediaDevices.style.color = zhide;
	// hide notation
	let str = dom.eMediaDevices.innerHTML
	str = str.replace(/\[RFP\]/g, "");
	dom.eMediaDevices.innerHTML = str;
};

function get_gamepads() {
	if ("getGamepads" in navigator) {
		dom.nGetGamepads = "enabled";
		let gamepads = navigator.getGamepads();
		if (gamepads.length == 0) {
			dom.eGamepads.innerHTML = "none" + rfp_green
		} else {
			// ToDo: gamepads: enumerate
			let items = (gamepads.length == 1 ? " item]" : " items]");
			dom.eGamepads.innerHTML = note_ttc + " [" + gamepads.length + items + rfp_red
			//gamepads.forEach(function(gamepad) {
			//});
		}
	} else {
		dom.nGetGamepads = "disabled";
		dom.eGamepads = "n/a";
	}
}

function get_media_devices() {
	// media.navigator.enabled
	if ("mediaDevices" in navigator) {
		dom.nMediaDevices = "enabled";
		// enumerate
		let str = "", pad = 0, strPad = "";
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			let aCount = 0, vCount = 0, oCount = 0;
			devices.forEach(function(device) {
				if (device.kind == "audioinput") {aCount++}
				else if (device.kind == "videoinput") {vCount++}
				else {oCount++}
				pad = device.kind.length + 2;
				str += device.kind + ": " + device.deviceId
				if (device.groupId.length > 0) {
					strPad = "group: "; strPad = strPad.padStart(pad)
					str += "<br>" + strPad + device.groupId
				}
				if (device.label.length > 0) {
					strPad = "label: "; strPad = strPad.padStart(pad)
					str += "<br>" + strPad + device.label
				}
				str += "<br>"
			});
			// rfp
			if (isFF) {
				if (aCount == 1 && vCount == 1 && oCount == 0) {
					str = str.replace("<br>", rfp_green + "<br>");
				} else {
					str = str.replace("<br>", rfp_red + "<br>");
				}
			}
			dom.eMediaDevices.innerHTML = str
		})
		.catch(function(err) {
			console.debug("enumerateDevices", err.name, err.message);
		});
	}	else {
		dom.nMediaDevices = "disabled";
		dom.eMediaDevices = "n/a";
	}
	dom.eMediaDevices.style.color = zshow;
};

function get_mimetypes() {
	if ("mimeTypes" in navigator) {
		let mimes = navigator.mimeTypes
		if (mimes.length == 0) {
			dom.mimeTypes.innerHTML = "none"
		} else {
			let str = "";
			for (let i = 0; i < mimes.length; i++) {
				str += mimes[i].type
				if (mimes[i].description != "") {str += ": " + mimes[i].type}
				if (mimes[i].suffixes != "") {str += ": " + mimes[i].suffixes}
				str += "<br>";
			}
			dom.mimeTypes.innerHTML = str
		}
	} else {
		dom.mimeTypes = "disabled";
	}
	dom.mimeTypes.style.color = zshow;
};

function get_mm_hover(type){
	let x = "not supported", h="hover", n="none", q = "("+type+": ";
	if (window.matchMedia(q+n+")").matches) x = n;
	if (window.matchMedia(q+h+")").matches) x = h;
	return x
};

function get_mm_pointer(type){
	let x = "not supported", f="fine", c="coarse", n="none", q = "("+type+": ";
	if (window.matchMedia(q+n+")").matches) x = n;
	if (window.matchMedia(q+c+")").matches) x = c;
	if (window.matchMedia(q+f+")").matches) x = f;
	return x
};

function get_mm_touch(){
	let x = "not supported", q = "(-moz-touch-enabled: ";
	if (window.matchMedia(q+"0)").matches) x = 0;
	if (window.matchMedia(q+"1)").matches) x = 1;
	return x
};

function get_plugins() {
	if ("plugins" in navigator) {
		if (navigator.plugins.length == 0) {
			dom.plugins.innerHTML = "none";
		} else {
			let str = "";
			for (let i = 0; i < navigator.plugins.length; i++) {
				str += navigator.plugins[i].name
				if (navigator.plugins[i].filename == "") {
					str += ": - : "
				} else {
					str += ": " + navigator.plugins[i].filename
				}
				if (navigator.plugins[i].description == "") {
					str += ": - : "
				} else {
					str += ": " + navigator.plugins[i].description
				}
				str += "<br>"
			}
			dom.plugins.innerHTML = str
		}
	} else {
		dom.plugins = "disabled";
	}
	dom.plugins.style.color = zshow;
}

function get_speech_synth() {
	// media.webspeech.synth.enabled
	if ("speechSynthesis" in window) {
		dom.speechSynth = "enabled";
		// speech engines
		function populateVoiceList() {
			if(typeof speechSynthesis === 'undefined') {
				return;
			}
			let voices = speechSynthesis.getVoices();
			let str = "";
			for (let i = 0; i < voices.length ; i++) {
				str += voices[i].name + " (" + voices[i].lang + ")";
				if (voices[i].default) { str += " : default" }
				str += "<br>"
			}
			if (isFF) {
				if (str == "") {
					str = "none" + rfp_green; // RFP: 1333641
				} else {
					str = str.replace("<br>", rfp_red + "<br>");
				}
			}
			dom.speechEngines.innerHTML = str
		}
		populateVoiceList();
		if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
			speechSynthesis.onvoiceschanged = populateVoiceList;
		}
	} else {
		dom.speechSynth = "disabled";
		dom.speechEngines = "n/a";
	}
};

function get_speech_rec() {
	// media.webspeech.recognition.enable
	// NOTE: media.webspeech.test.enable until landed
	try {
		let recognition = new SpeechRecognition();
		dom.speechRec = "enabled";
	} catch(e) {
		// undefined
		// ToDo: speech recognition: can I detect disabled vs not supported
		dom.speechRec = "disabled [or not supported]"
	}
};

function get_touch_event() {
	// ToDo: TouchEvent: do i remove it on fail?
	try {
		document.createEvent("TouchEvent");
		return true
	} catch (e) {
		return false
	}
};

function get_vr() {
	// dom.vr.enabled
	if ("getVRDisplays" in navigator) {
		dom.nGetVR = "enabled";
		if ("activeVRDisplays" in navigator) {
			let displays = navigator.activeVRDisplays;
			if (displays.length == 0) {
				dom.nActiveVR = "none"
			} else {
				// ToDo: activeVRDisplays: enumerate
				let items = (displays.length == 1 ? " item]" : " items]");
				dom.nActiveVR.innerHTML = note_ttc + " [" + displays.length + items;
				for (let i = 0; i < displays.length; i++) {
					// console.debug(displays[i].displayId);
				}
			}
		}
	}	else {
		dom.nGetVR = "disabled";
		dom.nActiveVR = "n/a";
	}
};

function outputDevices() {
	let t0 = performance.now();

	get_gamepads();
	get_media_devices();
	get_mimetypes();
	get_plugins();
	get_speech_synth();
	get_speech_rec();
	get_vr();

	// hardwareConcurrency
	if ("hardwareConcurrency" in navigator) {
		let hc = navigator.hardwareConcurrency;
		dom.nHWC.innerHTML = (hc == "2" ? hc + rfp_green : hc + rfp_red);
	} else {
		dom.nHardware = "disabled";
	}

	// FF64: pointer/hover
	dom.pointer1 = (window.PointerEvent == "undefined" ? "disabled" : "enabled");
	let strP = get_mm_pointer("any-pointer") + " | " + get_mm_pointer("pointer");
	let strH = get_mm_hover("any-hover") + " | " + get_mm_hover("hover");
	// 1607316
	// ToDo: pointer/hover: watch for tor #32886 to land
	if (isVer > 73 && isOS == "android") {
		strP = (strP == "coarse | coarse" ? strP + rfp_green : strP + rfp_red);
		strH = (strH == "none | none" ? strH + rfp_green : strH + rfp_red);
	} else {
		if (strP !== "not supported | not supported") {
			strP = (strP == "fine | fine" ? strP + rfp_green : strP + rfp_red);
		}
		if (strH !== "not supported | not supported") {
			strH = (strH == "hover | hover" ? strH + rfp_green : strH + rfp_red);
		}
	}
	dom.mmP.innerHTML = strP;
	dom.mmH.innerHTML = strH;

	// touch
	dom.touch1 = navigator.maxTouchPoints + " | "
		+ get_mm_touch() + " | "
		+ ("ontouchstart" in window) + " | "
		+ ("ontouchend" in window) + " | "
		+ get_touch_event();

	// perf
	let t1 = performance.now();
	outputDebug("1", "devices", (t1-t0), (t1 - gt0));
};

outputDevices();
