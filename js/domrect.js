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
	function createTest(method, runtype, callback){
		const properties = ["x","y","width","height","top","left","right","bottom"]
		function performTest(runtype){
			const rects = getElements().map(callback)
			const data = new Float64Array(rects.length * properties.length)
				rects.forEach(function(rect, i){
					properties.forEach(function(property, j){
						// select rect: "top","left","right","bottom"
						if (i == 3 && j > 3) {
							compare.push(method+":"+ property +":"+ runtype +":"+ rect[property])
						}
						data[i * properties.length + j] = rect[property]
					})
				})
				// hash
				if (runtype == 1) {
					crypto.subtle.digest("SHA-256", data).then(function(hash){
						document.getElementById(method).innerHTML = byteArrayToHex(hash) + note_file
					})
				}
				// results
				let item=0
				properties.map(function(property){
					return rects.map(function(rect, i){
						item++
						if (runtype == 1) {
							document.getElementById(method+item).textContent = rect[property]
						}
						return rect[property]
					}).join("")
				}).join("")
		}
		performTest(runtype)
	}

	let t0 = performance.now()
	let compare = []

	// run
	function run(runtype) {
		try {
			createTest("dr1", runtype, function(element){return element.getClientRects()[0]})
		} catch(e) {dom.dr1.innerHTML = zB; console.debug(e.name, e.message)}
		try {
			createTest("dr2", runtype, function(element){return element.getBoundingClientRect()})
		} catch(e) {dom.dr2.innerHTML = zB}
		try {
			createTest("dr3", runtype, function(element){
				let range = document.createRange()
				range.selectNode(element)
				return range.getClientRects()[0]
			})
		} catch(e) {dom.dr3.innerHTML = zB}
		try {
			createTest("dr4", runtype, function(element){
				let range = document.createRange()
				range.selectNode(element)
				return range.getBoundingClientRect()
			})
		} catch(e) {dom.dr4.innerHTML = zB}
	}

	// reset div
	document.getElementById("divrect").classList.add("divrect1");
	document.getElementById("divrect").classList.remove("divrect2");
	run(1)
	// move div
	document.getElementById("divrect").classList.add("divrect2");
	document.getElementById("divrect").classList.remove("divrect1");
	run(2)
	// debug select values
	compare.sort()
	console.debug(compare.join("\n"))

	// cleanup details
	setTimeout(function(){
		if (stateDR == true) {showhide("table-row","D","&#9650; hide")}
	}, 50)
	// perf
	debug_page("perf","domrect",t0,gt0)
}

outputDomRect()
