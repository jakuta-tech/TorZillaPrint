/* TABLE: Audio */

"use strict";

function reset_audio() {
	// change font color: try not to shrink/grow elements
	dom.audio1data.style.color = "#1a1a1a";
	dom.audio2data.style.color = "#1a1a1a";
	dom.audio3data.style.color = "#1a1a1a";
}

/* code based on work by kkapsner and canvasblocker
	https://canvasblocker.kkapsner.de/test/
	https://github.com/kkapsner/CanvasBlocker
*/
function run_pxi_fp(){
	let context = new window.OfflineAudioContext(1, 44100, 44100);
	// create oscillator
	let pxi_oscillator = context.createOscillator();
	pxi_oscillator.type = "triangle";
	pxi_oscillator.frequency.value = 1e4;
	// create and configure compressor
	let pxi_compressor = context.createDynamicsCompressor();
	pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
	pxi_compressor.knee && (pxi_compressor.knee.value = 40);
	pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
	pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
	pxi_compressor.attack && (pxi_compressor.attack.value = 0);
	pxi_compressor.release && (pxi_compressor.release.value = .25);
	// connect nodes
	pxi_oscillator.connect(pxi_compressor);
	pxi_compressor.connect(context.destination);
	// start audio processing
	pxi_oscillator.start(0);
	context.startRendering();
	context.oncomplete = function(event) {
		let str = "";
		let copyTest = new Float32Array(44100);
		event.renderedBuffer.copyFromChannel(copyTest, 0);
		let getTest = event.renderedBuffer.getChannelData(0);
		Promise.all([
			crypto.subtle.digest("SHA-256", getTest),
			crypto.subtle.digest("SHA-256", copyTest),
			]).then(function(hashes){
				dom.audioCopy = byteArrayToHex(hashes[0]);
				dom.audioGet = byteArrayToHex(hashes[1]);
			});
			let sum = 0;
			for (let i = 4500; i < 5000; i++) {
				sum += Math.abs(getTest[i]);
			}
			dom.audioSum = sum;
			pxi_compressor.disconnect();
	};
};

/* code based on work by openWPM
	https://audiofingerprint.openwpm.com/
*/
function run_nt_vc_fp() {
	let obj;
	let hash = "", // str to hash
		output = "", // pretty output
		latency = ""; // combined latency string

	function a(a, b, c) {
		for (let d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
		d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
		return a
	}

	try {
		let nt_vc_context = window.AudioContext || window.webkitAudioContext;
		if ("function" !== typeof nt_vc_context) obj = "";
		else {
			let f = new nt_vc_context,
				d = f.createAnalyser();
				obj = a({}, f, "ac-");
				obj = a(obj, f.destination, "ac-");
				obj = a(obj, f.listener, "ac-");
				obj = a(obj, d, "an-");
				// loop key+value, build nice output and string to hash
				for (const [key, value] of Object.entries(obj)) {
					// don't include latency in the hash
					if (key == "ac-baseLatency") {
						latency = latency + value + " | ";
					} else if (key == "ac-outputLatency") {
						latency = latency + value;
					} else {
						output = output + key.padStart(25, " ") + ": " + value + "<br>";
						hash = hash + value + "-";
					}
				}
		}
	} catch (g) {
			obj = 0
	}
	hash = hash.slice(0, -1); // remove trailing delimiter in hash string
	dom.audio1hash = sha1(hash);
	dom.audioLatency = latency;
	dom.audio1data.innerHTML = output;
	// reset color
	dom.audio1data.style.color = "#b3b3b3";
};

function outputAudio() {
	// detect web audio API enabled
	try {
		const audioCtx = new AudioContext();
		dom.audioSupport = "enabled";
		// from openWPM: there may be weird interference effects if the
		// prints are run sequentially with no delay, hence the sleeping.
		run_pxi_fp();
		setTimeout(function() { run_nt_vc_fp(); }, 700);
	}	catch(e) {
		dom.audioSupport = "disabled";
		dom.audioCopy = "n/a";
		dom.audioGet = "n/a";
		dom.audioSum = "n/a";
		dom.audioLatency = "n/a";
		dom.audio1hash = "n/a";
		dom.audio2hash = "n/a";
		dom.audio3hash = "n/a";
		// clear data
		dom.audio1data = "";
		dom.audio2data = "";
		dom.audio3data = "";
	};
};

outputAudio();
