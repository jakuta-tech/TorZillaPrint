/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

var iframeDR = dom.drect;

function reset_domrect() {
	// clear detailed data
	for (let i = 1; i < 5; i++) {
		document.getElementById("dr"+i).innerHTML = "&nbsp";
		for (let j = 1; j < 49; j++) {
			document.getElementById("dr"+i+j).innerHTML = "&nbsp";
		}
	};
}

function run_domrect() {
	let hash2 = "";
	function getElements(){
		let doc = iframeDR.contentDocument;
		return Array.from(doc.querySelectorAll(".testRect"));
	}
	function createTest(method, callback){
		const properties = ["x", "y", "width", "height", "top", "left", "right", "bottom"];
		function performTest(){
			const rects = getElements().map(callback);
			const data = new Float64Array(rects.length * properties.length);
				rects.forEach(function(rect, i){
					properties.forEach(function(property, j){
						data[i * properties.length + j] = rect[property];
					});
				});
				// output hash
				crypto.subtle.digest("SHA-256", data).then(function(hash){
					hash2 ="";
					hash2 = byteArrayToHex(hash);
					if (hash2 == "42c4b0e3141cfc98c8f4fb9a24b96f99e441ae274c939b641b9995a455b85278") {
						console.debug("X: hash detected as iframe error");
						document.getElementById(method).innerHTML = error_iframe;
					} else {
						document.getElementById(method).innerHTML = hash2 + note_file;
					}
				});
				// output results
				let item=0;
				properties.map(function(property){
					return rects.map(function(rect, i){
						item=item+1;
						document.getElementById(method+item).textContent = rect[property];
						return rect[property];
					}).join("")
				}).join("")
		}
		performTest();
	};

	// run the four tests
	createTest("dr1", function(element){return element.getClientRects()[0];});
	createTest("dr2", function(element){return element.getBoundingClientRect();});
	createTest("dr3", function(element){
		let range = document.createRange();
		range.selectNode(element);
		return range.getClientRects()[0];
	});
	createTest("dr4", function(element){
		let range = document.createRange();
		range.selectNode(element);
		return range.getBoundingClientRect();
	});

	// perf: dom rect was the first function called so use the global timer
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section domrect: " + (t1-gt0) + " ms" + " | " + (t1 - gt0) + " ms")};

	// show/hide relevant details sections if dr details is showing
	// but give it slight timer (don't run in perform test=screen jitter)
	setTimeout(function(){
		if (drState == true) {
			showhide("table-row", "D", "&#9650; hide");
		};
	}, 50); // delay to make sure things are loaded
};

function test_domrect() {
	// iframe is ready
	try {
		let testerror = iframeDR.contentWindow.document.getElementById("rect1");
		run_domrect();
	} catch(e) {
		// iframe is blocked
		if ((location.protocol) == "file:") {
			// file: Cross-Origin Request Blocked
			dom.dr1.innerHTML = error_file_cors;
			dom.dr2.innerHTML = error_file_cors;
			dom.dr3.innerHTML = error_file_cors;
			dom.dr4.innerHTML = error_file_cors;
		}
		// perf when blocked by CORS
		let t1 = performance.now();
		if (sPerf) {console.debug("  ** section domrect: " + (t1-gt0) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
}

function outputDomRect() {
	// we need to trap for a blocked iframe
	iframeDR.src = "iframes/domrect.html";
	iframeDR.addEventListener("load", test_domrect);
};

// domrect: we load and run this first so it can
// request an iframe and get on with other js
gt0 = performance.now();
if (sPerf) {console.debug("  ** section start timing: domrect.js loaded")};

// re-calculate global vars from global.js: this is the first script run
function set_global_vars() {
	if ((location.protocol) == "file:") {
		note_file = " <span class='neutral'>[file:]</span>";
	};
	if (isNaN(window.mozInnerScreenX) === false) {isFirefox = true};
}

set_global_vars();
outputDomRect();
