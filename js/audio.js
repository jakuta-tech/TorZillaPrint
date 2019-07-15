/* TABLE: Audio */

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

"use strict";

function outputAudio() {
	let pxi_output;
	let pxi_full_buffer;
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
	// detect web audio API enabled
	try {
		const audioCtx = new AudioContext();
		dom.audioSupport = "enabled";
		run_pxi_fp();
	}	catch(e) {
		dom.audioSupport = "disabled";
		dom.audioCopy = "n/a";
		dom.audioGet = "n/a";
		dom.audioSum = "n/a";
	};
};

outputAudio();
