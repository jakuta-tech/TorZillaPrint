/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

var t0dr;
var timerdr = 2000;

function reset_domrect() {
	// clear details
	for (let i = 1; i < 5; i++) {
		document.getElementById("dr"+i).innerHTML = "&nbsp";
		for (let j = 1; j < 49; j++) {
			document.getElementById("dr"+i+j).innerHTML = "&nbsp";
		}
	};
}

function remove_domrect(type) {

	// remove listener and iframe
	let ifdr = dom.ifdr;
	ifdr.removeEventListener("load", test_domrect);
	document.getElementById("drect").removeChild(ifdr);

	// output error notation
	if (type !== "") {
		let str = "";
		if (type == "cors") {str = error_file_cors};
		if (type == "404") {str = error_file_404};
		if (type == "iframe") {str = error_iframe};
		dom.dr1.innerHTML = str;
		dom.dr2.innerHTML = str;
		dom.dr3.innerHTML = str;
		dom.dr4.innerHTML = str;
	}

	// perf
	if (sPerf) {
		let t1 = performance.now(), warning = "";
		if (type == "iframe") {warning = "timed out [" + timerdr + "]"}
		outputDebug("1", "domrect", t1-t0dr, (t1 - gt0), warning);
	};

}

function run_domrect() {

	function getElements(){
		let iframeA = dom.ifdr;
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

	// cleanup
	remove_domrect("");

	// show/hide relevant details sections if dr details is showing
	setTimeout(function(){
		if (drState == true) {
			showhide("table-row", "D", "&#9650; hide");
		};
	}, 50); // delay to make sure things are loaded

}

function test_domrect() {
	try {
		let ifdr = dom.ifdr;
		let element = ifdr.contentWindow.document.getElementById("rect6");
		element.innerHTML="success";
		run_domrect();
	} catch(e) {
		remove_domrect("cors");
	}
}

function outputDomRect() {
	t0dr = performance.now();

	// adjust timer
	timerdr = 2000;
	if (isMajorOS == "android" | isTorBrowser) {timerdr = 3000};
	if (location.protocol == "file:") {timerdr = 600};
	if (sRerun == true) { timerdr = (timerdr/2) };

	// start timer
	setTimeout(function(){
		// we're still empty
		if (dom.dr1.textContent == "" | sha1(dom.dr1.textContent) == "ab90d23f7402359d51e25399fe46dac3401a3352") {
			if (location.protocol == "file:") {
				remove_domrect("404");
			} else {
				remove_domrect("iframe");
			}
		}
	}, timerdr);

	// create & append iframe, set src, start listener
	let iframe = document.createElement("iframe");
	iframe.id = "ifdr";
	document.getElementById("drect").appendChild(iframe);
	iframe.src = "iframes/domrect.html";
	iframe.addEventListener("load", test_domrect);

}

outputDomRect();
