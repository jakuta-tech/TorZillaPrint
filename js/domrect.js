"use strict";

/* code based on work by kkapsner and canvasblocker
	 https://canvasblocker.kkapsner.de/test/
	 https://github.com/kkapsner/CanvasBlocker */

function reset_domrect() {
	for (let i=1; i < 5; i++) {
		document.getElementById("dr"+i).innerHTML = "&nbsp"
		for (let j=1; j < 49; j++) {
			document.getElementById("dr"+i+j).innerHTML = "&nbsp"
		}
	}
}

function outputDomRect() {
	function getElements(){
		return Array.from(document.querySelectorAll(".testRect"))
	}
	function createTest(method, callback){
		const properties = ["x","y","width","height","top","left","right","bottom"]
		function performTest(){
			const rects = getElements().map(callback)
			const data = new Float64Array(rects.length * properties.length)
				rects.forEach(function(rect, i){
					properties.forEach(function(property, j){
						data[i * properties.length + j] = rect[property]
					})
				})
				// hash
				crypto.subtle.digest("SHA-256", data).then(function(hash){
					document.getElementById(method).innerHTML = byteArrayToHex(hash) + note_file
				})
				// results
				let item=0
				properties.map(function(property){
					return rects.map(function(rect, i){
						item++
						document.getElementById(method+item).textContent = rect[property]
						return rect[property]
					}).join("")
				}).join("")
		}
		performTest()
	}

	let t0 = performance.now()
	// unhide
	document.getElementById("divrect").style.display = "block"
	// run
	createTest("dr1", function(element){return element.getClientRects()[0]})
	createTest("dr2", function(element){return element.getBoundingClientRect()})
	createTest("dr3", function(element){
		let range = document.createRange()
		range.selectNode(element)
		return range.getClientRects()[0]
	})
	createTest("dr4", function(element){
		let range = document.createRange()
		range.selectNode(element)
		return range.getBoundingClientRect()
	})
	// hide
	document.getElementById("divrect").style.display = "none"
	// cleanup details
	setTimeout(function(){
		if (stateDR == true) {showhide("table-row","D","&#9650; hide")}
	}, 50)
	// perf
	debug_page("perf","domrect",t0,gt0)
}

outputDomRect()
