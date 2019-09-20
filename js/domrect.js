/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

var iframeDR = document.getElementById("drect");

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
					document.getElementById(method).innerHTML = byteArrayToHex(hash) + note_file;
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
	// make sure the iframe is ready / still there
	try {
		let testerror = iframeDR.contentWindow.document.getElementById("rect1");
		run_domrect();
	} catch(e) {
		// iframe didn't load
		if ((location.protocol) == "file:") {
			// file: Cross-Origin Request Blocked
			dom.dr1.innerHTML = error_file_cors;
			dom.dr2.innerHTML = error_file_cors;
			dom.dr3.innerHTML = error_file_cors;
			dom.dr4.innerHTML = error_file_cors;
		} else {
			// iframe is blocked
			dom.dr1.innerHTML = error_iframe;
			dom.dr2.innerHTML = error_iframe;
			dom.dr3.innerHTML = error_iframe;
			dom.dr4.innerHTML = error_iframe;
		};
	};	
}

function outputDomRect() {
	// load the iframe
	if (iframeDR.src == "") {
		iframeDR.src = "iframes/domrect.html";
		iframeDR.addEventListener("load", function(){
			test_domrect();
		});
	} else {
		// already loaded
		test_domrect();
	}
};

// domrect: we load and run this first so it can
// request an iframe and get on with other js
gt0 = performance.now();
if (sPerf) {console.debug("  ** section start timing: domrect.js loaded")};
outputDomRect();
