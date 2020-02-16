/* TABLE: Devices & Hardware */
'use strict';

function reset_devices() {
	// hide/color: dont shrink elements
	dom.mimeTypes.style.color = zhide
	dom.plugins.style.color = zhide
	dom.eMD.style.color = zhide
	// hide notation
	let str = dom.eMD.innerHTML
	str = str.replace(/\[RFP\]/g, "")
	dom.eMD.innerHTML = str
}

function get_gamepads() {
	if ("getGamepads" in navigator) {
		dom.nGP = zE
		// ToDo: listen for gamepads
		dom.eGP.innerHTML = note_ttc
	} else {
		dom.nGP = zD; dom.eGP = zNA
	}
}

function get_hardware_concurrency() {
	if ("hardwareConcurrency" in navigator) {
		let h = navigator.hardwareConcurrency
		dom.nHWC.innerHTML = (h == "2" ? h + rfp_green : h + rfp_red)
	} else {
		dom.nHWC = zD
	}
}

function get_media_devices() {
	if ("mediaDevices" in navigator) {
		dom.nMD = zE
		// enumerate
		let str="", pad=0, strPad=""
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			let aCount=0, vCount=0, oCount=0
			devices.forEach(function(d) {
				if (d.kind == "audioinput") {aCount++}
				else if (d.kind == "videoinput") {vCount++}	else {oCount++}
				pad = d.kind.length + 2
				str += d.kind+": "+d.deviceId
				if (d.groupId.length > 0) {
					strPad = ("group: ").padStart(pad)
					str += "<br>"+strPad+d.groupId
				}
				if (d.label.length > 0) {
					strPad = ("label: ").padStart(pad)
					str += "<br>"+strPad+d.label
				}
				str += "<br>"
			})
			// rfp
			if (isFF) {
				if (aCount == 1 && vCount == 1 && oCount == 0) {
					str = str.replace("<br>", rfp_green+"<br>")
				} else {
					str = str.replace("<br>", rfp_red+"<br>")
				}
			}
			dom.eMD.innerHTML = str
		})
		.catch(function(e) {
			console.debug("enumerateDevices", e.name, e.message)
		})
	}	else {
		dom.nMD = zD; dom.eMD = zNA
	}
	dom.eMD.style.color = zshow
}

function get_mimetypes() {
	if ("mimeTypes" in navigator) {
		let m = navigator.mimeTypes
		if (m.length > 0) {
			let s=""
			for (let i=0; i < m.length; i++) {
				s += m[i].type + (m[i].description == "" ? ": * " : ": " + m[i].type)
					+ (m[i].suffixes == "" ? ": *" : ": " + m[i].suffixes) + "<br>"
			}
			dom.mimeTypes.innerHTML = s
		} else {
			dom.mimeTypes.innerHTML = "none"
		}
	} else {
		dom.mimeTypes = zD
	}
	dom.mimeTypes.style.color = zshow
}

function get_mm_hover(type){
	let x=zNS, h="hover", n="none", q="("+type+":"
	if (window.matchMedia(q+n+")").matches) x=n
	if (window.matchMedia(q+h+")").matches) x=h
	return x
}

function get_mm_pointer(type){
	let x=zNS, f="fine", c="coarse", n="none", q="("+type+": "
	if (window.matchMedia(q+n+")").matches) x=n
	if (window.matchMedia(q+c+")").matches) x=c
	if (window.matchMedia(q+f+")").matches) x=f
	return x
}

function get_plugins() {
	if ("plugins" in navigator) {
		let p = navigator.plugins
		if (p.length > 0) {
			let s=""
			for (let i=0; i < p.length; i++) {
				s += p[i].name + (p[i].filename == "" ? ": * " : ": " + p[i].filename)
					+ (p[i].description == "" ? ": *" : ": " + p[i].description) + "<br>"
			}
			dom.plugins.innerHTML = s
		} else {
			dom.plugins.innerHTML = "none"
		}
	} else {
		dom.plugins = zD
	}
	dom.plugins.style.color = zshow
}

function get_pointer_hover() {
	// FF64: pointer/hover
	dom.pointer = (window.PointerEvent == "undefined" ? zD : zE)
	let p = get_mm_pointer("any-pointer")+" | "+get_mm_pointer("pointer")
	let h = get_mm_hover("any-hover")+" | "+get_mm_hover("hover")
	// 1607316
	if (isVer > 73 && isOS == "android") {
		p += (p == "coarse | coarse" ? rfp_green : rfp_red)
		h += (h == "none | none" ? rfp_green : rfp_red)
	} else {
		let rfp = zNS+" | "+zNS
		if (p !== rfp) {
			p += (p == "fine | fine" ? rfp_green : rfp_red)
		}
		if (h !== rfp) {
			h += (h == "hover | hover" ? rfp_green : rfp_red)
		}
	}
	dom.mmP.innerHTML = p
	dom.mmH.innerHTML = h
}

function get_speech_synth() {
	if ("speechSynthesis" in window) {
		dom.sSynth = zE
		// speech engines
		function populateVoiceList() {
			if(typeof speechSynthesis === 'undefined') {
				return
			}
			let v = speechSynthesis.getVoices()
			let s=""
			for (let i=0; i < v.length; i++) {
				s += v[i].name + " (" + v[i].lang + ")" + (v[i].default ? " : default" : "") + "<br>"
			}
			if (isFF) {
				if (s == "") {
					s = "none" + rfp_green // RFP: 1333641
				} else {
					s = s.replace("<br>", rfp_red + "<br>")
				}
			}
			dom.sEngines.innerHTML = s
		}
		populateVoiceList()
		if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
			speechSynthesis.onvoiceschanged = populateVoiceList
		}
	} else {
		dom.sSynth = zD; dom.sEngines = zNA
	}
}

function get_speech_rec() {
	// media.webspeech.recognition.enable
	// NOTE: media.webspeech.test.enable until landed
	try {
		let recognition = new SpeechRecognition()
		dom.sRec = zE
	} catch(e) {
		// undefined
		// ToDo: speechRec: detect dis-abled vs not-supported?
		dom.sRec = zD+" [or "+zNS+"]"
	}
}

function get_touch() {
	// vars
	let m = zNS,
		q="(-moz-touch-enabled:",
		t = false
	// m
	if (window.matchMedia(q+"0)").matches) m=0
	if (window.matchMedia(q+"1)").matches) m=1
	// t
	try {
		document.createEvent("TouchEvent")
		t = true
	} catch (e) {}
	// output
	dom.touch = navigator.maxTouchPoints +" | "+ m +" | "
		+("ontouchstart" in window)+" | "+("ontouchend" in window)+" | "+ t
}

function get_vr() {
	if ("getVRDisplays" in navigator) {
		dom.nVR = zE
		if ("activeVRDisplays" in navigator) {
			let d = navigator.activeVRDisplays
			if (d.length == 0) {
				dom.aVR = "none"
			} else {
				// ToDo: VR: enum
				let items = " item" + (d.length == 1 ? "" : "s") + "]"
				dom.aVR.innerHTML = note_ttc+" ["+d.length + items
				for (let i=0; i < d.length; i++) {
					// console.debug(d[i].displayId)
				}
			}
		}
	}	else {
		dom.nVR = zD; dom.aVR = zNA
	}
}

function outputDevices() {
	let t0 = performance.now()
	// run
	get_gamepads()
	get_hardware_concurrency()
	get_media_devices()
	get_mimetypes()
	get_plugins()
	get_pointer_hover()
	get_speech_rec()
	get_speech_synth()
	get_touch()
	get_vr()
	// perf
	debug_page("perf","devices",t0,gt0)
}

outputDevices()
