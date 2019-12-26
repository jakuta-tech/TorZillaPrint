/* TABLE: Devices & Hardware */

'use strict';

function reset_devices() {
	// hide w/ color: don't shrink elements
	dom.mimeTypes.style.color = zhide;
	dom.plugins.style.color = zhide;
	dom.eMediaDevices.style.color = zhide;
};

function get_gamepads() {
	// gamepads
	if ("getGamepads" in navigator) {
		dom.nGetGamepads = "enabled";
		// ToDo: gamepads: enumerate
		dom.eGamepads.innerHTML = note_ttc
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
			devices.forEach(function(device) {
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

function get_mm_pointer(type){
	let x = "not supported",
		f="fine", c="coarse", n="none",
		q = "("+type+": ";
	if (window.matchMedia(q+n+")").matches) x = "none";
	if (window.matchMedia(q+c+")").matches) x = "coarse";
	if (window.matchMedia(q+f+")").matches) x = "fine";
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
				str += voices[i].name + " [" + voices[i].lang + "]";
				if (voices[i].default) { str += " : default" }
				str += "<br>"
			}
			if (str == "") {
				str = "none" + rfp_green; // RFP: 1333641
			};
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
				// no active VR displays
				dom.nActiveVR = "none"
			} else {
				// ToDo: activeVRDisplays: enumerate
				dom.nActiveVR.innerHTML = note_ttc + " [" + displays.length + " items]";
				for (let vc = 0; vc < displays.length; vc++) {
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

	// pointers
	dom.pointer1 = (window.PointerEvent == "undefined" ? "disabled" : "enabled");
	dom.mmP = get_mm_pointer("any-pointer") + " | " + get_mm_pointer("pointer");

	// touch
	dom.touch1 = navigator.maxTouchPoints + " | "
		+ ("ontouchstart" in window) + " | "
		+ ("ontouchend" in window) + " | "
		+ get_touch_event();

	// perf
	let t1 = performance.now();
	outputDebug("1", "devices", (t1-t0), (t1 - gt0));
};

outputDevices();
