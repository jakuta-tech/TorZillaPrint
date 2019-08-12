/* TABLE: Audio */

"use strict";

/* code based on work by
	kkapsner and canvasblocker
	- https://canvasblocker.kkapsner.de/test/
	- https://github.com/kkapsner/CanvasBlocker
	openWPM
	- https://audiofingerprint.openwpm.com/
*/

var isWebAudio = false; // don't keep testing for audioContext
var t0audio;

function no_audio() {
	dom.audioSupport = "disabled";
	dom.audioCopy = "n/a";
	dom.audioGet = "n/a";
	dom.audioSum = "n/a";
	dom.audioLatency = "n/a";
	dom.audio1hash = "n/a";
	dom.audio2hash = "n/a";
	dom.audio3hash = "n/a";
	dom.audio1data = "";
	dom.audio2data = "";
	dom.audio3data = "";
	// no webaudio, no more tests
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section audio: " + (t1-t0audio) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function reset_audio() {
	// change font color: try not to shrink/grow elements
	dom.audio1data.style.color = "#1a1a1a";
	dom.audio2data.style.color = "#1a1a1a";
	dom.audio3data.style.color = "#1a1a1a";
};

function get_audio_properties() {
	let t0 = performance.now();
	function a(a, b, c) {
		for (let d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
		d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
		return a
	};
	try {
		let f = new window.AudioContext
		// remember audioContet
		isWebAudio = true;
		dom.audioSupport = "enabled";
		let obj;
		let hash = "", // str to hash
			output = "", // pretty output
			latency = ""; // combined latency string
		let	d = f.createAnalyser();
			obj = a({}, f, "ac-");
			obj = a(obj, f.destination, "ac-");
			obj = a(obj, f.listener, "ac-");
			obj = a(obj, d, "an-");
		// loop key+value, build pretty output and string to hash
		for (const [key, value] of Object.entries(obj)) {
			// split latency (FF70+) out
			// RFP values: win 0.04, android 0.02, mac 512, other 0.025
			if (key == "ac-baseLatency") {
				latency = latency + value + " | ";
			} else if (key == "ac-outputLatency") {
				// NOTE: nonRFP mode: Failure mode: return 0.0 if running on a normal thread
				// NOTE: nonRFP mode: outputLatency returns 0 unless we detect a user gesture
				if (value == 0) {
					latency = latency + "<span class='bad'>" + value + " [failure mode]</span>";
				} else {
					latency = latency + value;
				}
			} else {
				output = output + key.padStart(25, " ") + ": " + value + "<br>";
				hash = hash + value + "-";
			}
		};
		hash = hash.slice(0, -1); // remove trailing delimiter
		dom.audio1hash = sha1(hash);
		if (latency == "") {
			dom.audioLatency = "not supported"; // FF70+
		} else {
			dom.audioLatency.innerHTML = latency;
		}
		dom.audio1data.innerHTML = output;
		dom.audio1data.style.color = "#b3b3b3";
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio properties: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};

	} catch (error) {
		// output some error & clear details data
		dom.audio1data = "";
		dom.audio1data.style.color = "#b3b3b3";
		// webaudio is disabled
		no_audio();
	};
};

function get_audio_pxi(){
	let t0 = performance.now();
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
			// perf
			let t1 = performance.now();
			if (mPerf) {console.debug("audio pxi: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
			// currently the last function
			if (sPerf) {console.debug("  ** section audio: " + (t1-t0audio) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
};

function outputAudio() {
	t0audio = performance.now();
	get_audio_properties();
	if (isWebAudio) {
		// openWPM: there may be weird interference effects
		// if the prints are run sequentially with no delay
		setTimeout(function() { get_audio_pxi(); }, 100)
	};
};

outputAudio();
