/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

var t0dr;

function reset_domrect() {
	// clear details
	for (let i = 1; i < 5; i++) {
		document.getElementById("dr"+i).innerHTML = "&nbsp";
		for (let j = 1; j < 49; j++) {
			document.getElementById("dr"+i+j).innerHTML = "&nbsp";
		}
	};
}

function run_domrect() {
	console.debug("domrect test is running");

	function getElements(){
		let iframeA = dom.drect;
		let doc = iframeA.contentDocument;
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

	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section domrect: " + (t1-t0dr) + " ms" + " | " + (t1 - gt0) + " ms")};

	// show/hide relevant details sections if dr details is showing
	setTimeout(function(){
		if (drState == true) {
			showhide("table-row", "D", "&#9650; hide");
		};
	}, 50); // delay to make sure things are loaded

};

function test_domrect() {
	// iframe is ready
	try {
		let iframeB = dom.drect;
		let testerror = iframeB.contentWindow.document.getElementById("rect1");
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
		// perf
		let t1 = performance.now();
		if (sPerf) {console.debug("  ** section domrect: " + (t1-t0dr) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
}

function outputDomRect() {
	t0dr = performance.now();
	let iframeC = dom.drect;
	console.debug("src", iframeC.src)

	// start timer to detect blocked iframe
	if (location.protocol !== "file:") {
		let delay = (isMajorOS == "android" ? 1000 : 600);
		delay = (isTorBrowser == true ? 1000 : 600);
		setTimeout(function(){
			// check if anything output yet
			if (dom.dr1.textContent == "" | sha1(dom.dr1.textContent) == "ab90d23f7402359d51e25399fe46dac3401a3352") {
				dom.dr1.innerHTML = error_iframe;
				dom.dr2.innerHTML = error_iframe;
				dom.dr3.innerHTML = error_iframe;
				dom.dr4.innerHTML = error_iframe;

				// cancel listener, change src
				iframeC.removeEventListener("load", test_domrect);
				iframeC.src = "iframes/test.html";

				// perf
				let t1 = performance.now();
				if (sPerf) {console.debug("  ** section domrect: " + (t1-t0dr) + " ms" + " | " + (t1 - gt0) + " ms")};
			}
		}, delay);
	}

	// set src
	iframeC.src = "iframes/domrect.html";
	iframeC.addEventListener("load", test_domrect);
};

outputDomRect();
