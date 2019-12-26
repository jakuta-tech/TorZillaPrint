/* TABLE: Audio */

"use strict";

/* code based on work by
kkapsner
- https://canvasblocker.kkapsner.de/test/
- https://github.com/kkapsner/CanvasBlocker
openWPM
- https://audiofingerprint.openwpm.com/
*/

var t0audio,
	latencyError = false,
	latencyTries = 0;

function reset_audio2() {
	// hide w/ color: don't shrink elements
	dom.audio1data.style.color = zhide;
	dom.audio2data.style.color = zhide;
	dom.audio3data.style.color = zhide;
};

function get_audio2_context() {
	let t0 = performance.now();
	latencyTries++;

	function a(a, b, c) {
		for (let d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
		d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
		return a
	};
	let f = new window.AudioContext;
	let obj;
	let hash = "", // str to hash
		output = "",
		latency = "",
		rfpvalue = "",
		macLatency = false; // mac=true & latency=supported
	let	d = f.createAnalyser();
		obj = a({}, f, "ac-");
		obj = a(obj, f.destination, "ac-");
		obj = a(obj, f.listener, "ac-");
		obj = a(obj, d, "an-");
		// loop key+value
		for (const [key, value] of Object.entries(obj)) {
			if (key == "ac-outputLatency") {
				// FF70+
				if (value == 0) {
					// nonRFP: return 0.0 if running on a normal thread
					// nonRFP: return 0 unless we detect a user gesture
					latencyError = true;
					latency = sb + value + " [failed]" + sc;
				} else {
					latencyError = false;
					latency = value;
					if (isOS == "windows") {rfpvalue = "0.04"}
					if (isOS == "android") {rfpvalue = "0.02"}
					if (isOS == "linux") {rfpvalue = "0.025"}
					if (isOS == "mac") {macLatency = true}
					if (rfpvalue !== "") {
						latency = (value == rfpvalue ? latency += rfp_green : latency += rfp_red)
					}
				}
			} else {
				// concat output & string to hash
				output += key.padStart(25) + ": " + value + "<br>";
				hash += value + "-";
			}
			if (key == "ac-sampleRate") {
				if (macLatency == true) {
					latency = (latency == (512/value) ? latency += rfp_green : latency += rfp_red)
				}
			}
		};
		hash = hash.slice(0, -1); // trailing delimiter
		dom.audio1hash = sha1(hash);

		// output
		if (latency == "") {
			dom.audioLatency = "not supported"
		} else {
			// no error or 2nd try
			if (latencyError == false || latencyTries == 2) {
				dom.audioLatency.innerHTML = latency
			}
		};
		dom.audio1data.innerHTML = output;
		dom.audio1data.style.color = zshow;

		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio context: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};

		// next test or section perf
		if (latencyTries == 1) {
			get_audio2_hybrid()
		} else {
			outputDebug("1", "audio 2", (t1-t0audio))
		};

};

function get_audio2_hybrid() {
	let t0 = performance.now();

	let hybrid_output = [];
	let audioCtx = new window.AudioContext,
    oscillator = audioCtx.createOscillator(),
    analyser = audioCtx.createAnalyser(),
    gain = audioCtx.createGain(),
    scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

	// create & configure compressor
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
			hybrid_output.push(" " + bins[i]);
		}
		analyser.disconnect();
		scriptProcessor.disconnect();
		gain.disconnect();

		// output
		dom.audio3data = hybrid_output.slice(0, 30);
		dom.audio3hash = sha1(hybrid_output.slice(0, 30));
		dom.audio3data.style.color = zshow;

		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio hybrid: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};

		// next test or section perf
		if (latencyError == true && latencyTries == 1) {
			get_audio2_context()
		} else {
			outputDebug("1", "audio 2", (t1-t0audio))
		}
	};
	oscillator.start(0);
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
			cc_output.push(" " + bins[i]);
		}
		analyser.disconnect();
		scriptProcessor.disconnect();
		gain.disconnect();

		// output
		dom.audio2data = cc_output.slice(0, 30);
		dom.audio2hash = sha1(cc_output.slice(0, 30));
		dom.audio2data.style.color = zshow;

		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("audio oscillator: " + (t1-t0) + " ms" + " | " + (t1 - t0audio) + " ms")};

		// next test
		get_audio2_context();

	};
	oscillator.start(0);
};

function outputAudio2() {
	t0audio = performance.now();
	latencyTries = 0;
	try {
		let test = new window.AudioContext;
		// each test calls the next: oscillator -> context [try1] -> hybrid -> context [try2 if req]
			// if context is run first, outputLatency *always* = 0 = incorrect : so run after oscillator
			// if context is not run first, outputLatency *sometimes* = 0 : hence context [try2]
		get_audio2_oscillator();

	} catch(e) {
		// no webaudio
		dom.audioLatency = "n/a";
		dom.audio1hash = "n/a";
		dom.audio2hash = "n/a";
		dom.audio3hash = "n/a";
		dom.audio1data = "";
		dom.audio2data = "";
		dom.audio3data = "";
		dom.audio1data.style.color = zshow;
		dom.audio2data.style.color = zshow;
		dom.audio3data.style.color = zshow;
	}
};

function outputAudio1(type) {
	let t0 = performance.now();
	try {
		let context = new window.OfflineAudioContext(1, 44100, 44100);
		// webaudio enabled
		dom.audioSupport = "enabled";
		// create oscillator
		let pxi_oscillator = context.createOscillator();
		pxi_oscillator.type = "triangle";
		pxi_oscillator.frequency.value = 1e4;
		// create & configure compressor
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
		// start processing
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
				outputDebug("1", "audio 1", (t1-t0), (t1 - gt0));
		};
	} catch(error) {
		// no webaudio
		dom.audioSupport = "disabled";
		dom.audioCopy = "n/a";
		dom.audioGet = "n/a";
		dom.audioSum = "n/a";
		if (type == "load") {
			// on page load, also n/a audio2
			dom.audioLatency = "n/a";
			dom.audio1hash = "n/a";
			dom.audio2hash = "n/a";
			dom.audio3hash = "n/a";
		};
		// perf
		let t2 = performance.now();
		outputDebug("1", "audio 1", (t2-t0), (t2 - gt0));
	};
};

outputAudio1("load");
