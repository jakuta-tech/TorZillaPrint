/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

(function(){
	const iframeDR = document.getElementById("iframeDR");
	function getElements(){
		const docDR = iframeDR.contentDocument;
		//return Array.from(docDR.querySelectorAll("*[id^=rect]"));
		return Array.from(docDR.querySelectorAll(".testRect"));
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
					document.getElementById(method).textContent = byteArrayToHex(hash);
				});
				// output results
				var item=0;
				properties.map(function(property){
					return rects.map(function(rect, i){
						item=item+1;
						document.getElementById(method+item).textContent = rect[property];
						return rect[property];
					}).join("")
				}).join("")
		}
		performTest();
	}
	// iframe-load & button-eventListener
	function drTest() {
		// clear data regardless of auto-run or re-run
		var drA = 1;
		while (drA < 5) {
			document.getElementById("dr"+drA).innerHTML = "&nbsp"; var drB = 1;
			while (drB < 49) {document.getElementById("dr"+drA+drB).innerHTML = "&nbsp"; drB++;}
			drA++;
		};
		setTimeout(function(){
			// run the four tests
			createTest("dr1", function(element){return element.getClientRects()[0];});
			createTest("dr2", function(element){return element.getBoundingClientRect();});
			createTest("dr3", function(element){
				var range = document.createRange();
				range.selectNode(element);
				return range.getClientRects()[0];
			});
			createTest("dr4", function(element){
				var range = document.createRange();
				range.selectNode(element);
				return range.getBoundingClientRect();
			});
			// show/hide relevant details sections if dr details is showing
			// but give it slight timer (don't run in perform test=screen jitter)
			setTimeout(function(){
				if (drState == true) {
					showhide("table-row", "D", "&#9650; hide");
				};
			}, 50); // delay to make sure things are loaded
		}, 120); // artifical delay to show clearing and stop jitter
	};
	// set the iframe source here
	iframeDR.src = "iframes/domrect.html";
	// listen for it
	iframeDR.addEventListener("load", function(){
		drTest();
		// add event listener to rerun button
		document.getElementById("drRun").addEventListener("click", drTest);
	});
}());
