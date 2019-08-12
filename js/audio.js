/* TABLE: Audio */

"use strict";

/* code based on work by
	kkapsner and canvasblocker
	- https://canvasblocker.kkapsner.de/test/
	- https://github.com/kkapsner/CanvasBlocker
	openWPM
	- https://audiofingerprint.openwpm.com/
*/

var t0audio;
var latencyError = false;
var latencyTries = 0;
var isWebAudio = false;

function reset_audio2() {
	// change font color: try not to shrink/grow elements
	dom.audio1data.style.color = "#1a1a1a";
	dom.audio2data.style.color = "#1a1a1a";
	dom.audio3data.style.color = "#1a1a1a";
};

function get_audio2_context() {
	let t0 = performance.now();
	function a(a, b, c) {
		for (let d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
		d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
		return a
	};
	try {
		let f = new window.AudioContext;
		// webaudio is enabled
		isWebAudio = true;
		latencyTries++;

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
			if (key == "ac-outputLatency") {
				// NOTE: nonRFP mode: Failure mode: return 0.0 if running on a normal thread
				// NOTE: nonRFP mode: outputLatency returns 0 unless we detect a user gesture
				if (value == 0) {
					latency = "<span class='bad'>" + value + " [failure mode]</span>";
					latencyError = true;
				} else {
					latency = value;
					latencyError = false;
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
			// don't output if an error on first try
			if (latencyError == false) {
				dom.audioLatency.innerHTML = latency;
			} else if ( latencyTries < 1) {
				dom.audioLatency.innerHTML = latency;
			}
		}
		dom.audio1data.innerHTML = output;
		dom.audio1data.style.color = "#b3b3b3";
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio properties: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};

	} catch (error) {
		// output some error & clear details data
		dom.audio1data = "";
		dom.audio1data.style.color = "#b3b3b3";
		// webaudio is disabled
		dom.audioLatency = "n/a";
		dom.audio1hash = "n/a";
		dom.audio2hash = "n/a";
		dom.audio3hash = "n/a";
		dom.audio1data = "";
		dom.audio2data = "";
		dom.audio3data = "";
		// no webaudio, no more tests
		let t1 = performance.now();
		if (sPerf) {console.debug("  ** section audio 2: " + (t1-t0audio) + " ms" + " | " + (t1 - t0audio) + " ms")};
	};
};

function get_audio2_oscillator() {
	let t0 = performance.now();
	let cc_output = [];
	let audioCtx = new window.AudioContext;
	let oscillator = audioCtx.createOscillator(),
		analyser = audioCtx.createAnalyser(),
		gain = audioCtx.createGain(),
		scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

	gain.gain.value = 0; // disable volume
	oscillator.type = "triangle"; // triangle wave
	oscillator.connect(analyser); // connect oscillator output to analyser input
	analyser.connect(scriptProcessor); // connect analyser output to scriptProcessor input
	scriptProcessor.connect(gain); // connect scriptProcessor output to gain input
	gain.connect(audioCtx.destination); // connect gain output to audiocontext destination

	scriptProcessor.onaudioprocess = function (bins) {
		bins = new Float32Array(analyser.frequencyBinCount);
		analyser.getFloatFrequencyData(bins);
		for (let i = 0; i < bins.length; i = i + 1) {
			cc_output.push(bins[i]);
		}
		analyser.disconnect();
		scriptProcessor.disconnect();
		gain.disconnect();
		// output & reset color
		dom.audio2data = cc_output.slice(0, 30);
		dom.audio2hash = sha1(cc_output.slice(0, 30));
		dom.audio2data.style.color = "#b3b3b3";
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio oscillator: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};
	};
	oscillator.start(0);
};

function get_audio2_hybrid() {
	let t0 = performance.now();
	let hybrid_output = [];
	let audioCtx = new window.AudioContext,
    oscillator = audioCtx.createOscillator(),
    analyser = audioCtx.createAnalyser(),
    gain = audioCtx.createGain(),
    scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

	// create and configure compressor
	let compressor = audioCtx.createDynamicsCompressor();
	compressor.threshold && (compressor.threshold.value = -50);
	compressor.knee && (compressor.knee.value = 40);
	compressor.ratio && (compressor.ratio.value = 12);
	compressor.reduction && (compressor.reduction.value = -20);
	compressor.attack && (compressor.attack.value = 0);
	compressor.release && (compressor.release.value = .25);

	gain.gain.value = 0; // disable volume
	oscillator.type = "triangle"; // output triangle wave
	oscillator.connect(compressor); // connect oscillator output to dynamic compressor
	compressor.connect(analyser); // connect compressor to analyser
	analyser.connect(scriptProcessor); // connect analyser output to scriptProcessor input
	scriptProcessor.connect(gain); // connect scriptProcessor output to gain input
	gain.connect(audioCtx.destination); // connect gain output to audiocontext destination

	scriptProcessor.onaudioprocess = function (bins) {
		bins = new Float32Array(analyser.frequencyBinCount);
		analyser.getFloatFrequencyData(bins);
		for (let i = 0; i < bins.length; i = i + 1) {
			hybrid_output.push(bins[i]);
		}
		analyser.disconnect();
		scriptProcessor.disconnect();
		gain.disconnect();
		// output & reset color
		dom.audio3data = hybrid_output.slice(0, 30);
		dom.audio3hash = sha1(hybrid_output.slice(0, 30));
		dom.audio3data.style.color = "#b3b3b3";
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio hybrid: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};
		// perf: last section
		if (sPerf) {console.debug("  ** section audio 2: " + (t1-t0audio) + " ms")};
	};
	oscillator.start(0);
};

function outputAudio2() {
	t0audio = performance.now();
	isWebAudio = false;
	get_audio2_context();
	if (isWebAudio) {
		// openWPM: there may be weird interference effects
		// if the prints are run sequentially with no delay
		if (latencyError == true) {
			// try again
			setTimeout(function() { get_audio2_context(); }, 100)
		}
		setTimeout(function() { get_audio2_oscillator(); }, 175)
		setTimeout(function() { get_audio2_hybrid(); }, 400)
	};
};

function outputAudio1() {
	let t0 = performance.now();
	try {
		let context = new window.OfflineAudioContext(1, 44100, 44100);
		// webaudio enabled
		dom.audioSupport = "enabled";
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
				if (sPerf) {console.debug("  ** section audio 1: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
		};
	} catch(error) {
		// webaudio disabled
		dom.audioSupport = "disabled";
		dom.audioCopy = "n/a";
		dom.audioGet = "n/a";
		dom.audioSum = "n/a";
		// perf
		let t2 = performance.now();
		if (sPerf) {console.debug("  ** section audio 1: " + (t2-t0) + " ms" + " | " + (t2 - gt0) + " ms")};
	};
};

outputAudio1();
