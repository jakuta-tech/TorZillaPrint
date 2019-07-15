/* TABLE: DOMRect */

"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

function outputDomRect() {
	function getElements(){
		let doc = iframe.contentDocument;
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
					// FF append file:// notation
					if ((location.protocol) == "file:") {
						document.getElementById(method).innerHTML = byteArrayToHex(hash) + note_file;
					} else {
						document.getElementById(method).innerHTML = byteArrayToHex(hash);
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

	// clear detailed data
	for (let i = 1; i < 5; i++) {
		document.getElementById("dr"+i).innerHTML = "&nbsp";
		for (let j = 1; j < 49; j++) {
			document.getElementById("dr"+i+j).innerHTML = "&nbsp";
		}
	};

	// set iframe source
	let iframe = document.getElementById("iframeDR");
	iframe.src = "iframes/domrect.html";
	iframe.addEventListener("load", function(){
		// catch iframe error
		try {
			let testerror = iframe.contentWindow.document.getElementById("rect1");

			setTimeout(function(){
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
				// show/hide relevant details sections if dr details is showing
				// but give it slight timer (don't run in perform test=screen jitter)
				setTimeout(function(){
					if (drState == true) {
						showhide("table-row", "D", "&#9650; hide");
					};
				}, 50); // delay to make sure things are loaded
			}, 120); // artifical delay to show clearing and stop jitter

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
	});

};

outputDomRect();
