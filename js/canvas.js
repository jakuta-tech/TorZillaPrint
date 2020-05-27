"use strict";

/* outputCancnvas() code courtesy of kkapsner and canvasblocker
https://canvasblocker.kkapsner.de/test/
https://github.com/kkapsner/CanvasBlocker */

var t0canvas

function analyzeCanvas(runtype, res1, res2) {

	// vars
	let chash1 = [],
		diff78 = false,
		is78rfp = false,
		table = dom.tb9,
		error_string = "error while testing",
		t0 = performance.now()

	// RFP
	if (isFF && isVer > 77) {
		if (get_RFP() == true) {is78rfp = true}
	}

	function display_value(item, value1, value2) {
		// vars
		let isRandom = false,
			pushvalue = value1,
			control = "",
			combined = "",
			sname = item.substring(0,4)
		let element = table.querySelector("." + item)
		// simulate random
		let sim = false
		if (sim) {
			if (sname == "toDa" || sname == "toBl" || sname == "getI" || sname == "isPo" || sname == "mozG") {
				if (value1.length == 64) {
					diff78 = true
					value1 = (Math.random().toString(36).replace(/[^a-z]+/g, '') + value1).substring(0,64)
					value2 = (Math.random().toString(36).replace(/[^a-z]+/g, '') + value1).substring(0,64)
				}
			}
		}
		// push/output error if not two valid results
		if (value1 == error_string || value2 == error_string) {
			value1 = error_string
			pushvalue = value1
		} else if (value1.substring(0,14) == "ReferenceError") {
			// blocked e.g. AOPR uses random error messages
			value1 = zB
			pushvalue = blocked
		} else {
			// randomness
			if (value1 !== value2) {
				isRandom = true
				pushvalue = "random"
				combined = "random " + s9 +" [1] "+ sc + value1.substring(0,22) + ".."
					+ s9 +" [2] "+ sc + value2.substring(0,22) + ".."
			}
		}

		// supported/not-supported
		if (isFF) {
			if (sname == "wind" || sname == "fill" || sname == "stro") {
				value1 += (value1 == "supported" ? rfp_green : rfp_red)
			}
			if (sname == "getC") {
				control = "2d: supported"
				value1 += (value1 == control ? rfp_green : rfp_red )
			}
			if (sname == "mozG") {
				if (isVer > 73) {
					// supported
					control = "not supported"
					value1 += (value1 == control ? rfp_green : rfp_red )
				} else {
					// hash
					control = "d87b36e65e37d411ac204db663f0ec05fe94bf7b6df537bab3f11052d1621ecc"
					if (isRandom) {value1 = combined}
					value1 += (value1 == control ? rfp_green : rfp_red)
				}
			}
		}
		// hashes: static RFP
		if (sname == "isPo") {
			control = "957c80fa4be3af7e53b40c852edf96a090f09958cc7f832aaf9a9fd544fb69a8"
			if (isRandom) {
				value1 = combined + (isFF ? rfp_red : "")
			} else {
				if (isFF) {value1 += (value1 == control ? rfp_green : rfp_red)}
			}
		}
		// hashes: 1621433: randomized 78+ or static RFP
		if (sname == "toDa" || sname == "toBl" || sname == "getI") {
			if (value1 == error_string) {
				if (isFF) {
					value1 += (isVer > 77 ? rfp_random_red : rfp_red)
				}
			} else {
				if (isFF) {
					if (isVer > 77) {
						// 78+: random
						if (isRandom) {
							if (is78rfp) {
								pushvalue = "random rfp"
								// toDataURL vs toBlob
								if (sname == "toDa" || sname == "toBl") {
									if (!diff78) {pushvalue = "random ext"}
								}
							} else {
								pushvalue = "random ext"
							}
							value1 = combined + (pushvalue == "random rfp" ? rfp_random_green : rfp_random_red)
						} else {
							value1 += rfp_random_red
						}
					} else {
						// <78: static
						if (isRandom) {
							value1 = combined + rfp_red
						} else {
							if (sname == "getI") {
								control = "ae8d89f4cb47814af5d79e63a1a60b3f3f28d9309189b7518f1ecc23d8bda282"
							} else {
								control = "d87b36e65e37d411ac204db663f0ec05fe94bf7b6df537bab3f11052d1621ecc"
							}
							value1 += (value1 == control ? rfp_green : rfp_red)
						}
					}
				} else {
					// non-FF
					if (isRandom) {value1 = combined}
				}
			}
		}
		// push + display
		chash1.push(item+", "+pushvalue)
		element.innerHTML = value1
	}

	// 78+: track toDataURL vs toBlob randomness
	let valueB = "", valueD = ""
	for (let i=0; i < res1.length; i++) {
		let str1 = res1[i],
			delim = str1.search(","),
			display = str1.substring(0,delim)
		if (display == "toBlob") {
			valueB = str1.substring(delim+1, str1.length)
		} else if (display == "toDataURL") {
			valueD = str1.substring(delim+1, str1.length)
		}
	}
	if (valueB !== valueD) {diff78 = true}

	// sort arrays, output values
	res1.sort()
	res2.sort()
	for (let i=0; i < res1.length; i++) {
		let str1 = res1[i],
			str2 = res2[i],
			delim = str1.search(","),
			display = str1.substring(0,delim),
			value1 = str1.substring(delim+1, str1.length),
			value2 = str2.substring(delim+1, str2.length)
		display_value(display, value1, value2)
	}
	// overall hash
	chash1.sort()
	Promise.all([
		sha256_str(chash1.join())
	]).then(function(hash){
		dom.chash1.innerHTML = hash[0] + (isFile ? note_file : "")
		if (!isFile) {console.log("CANVAS hash: " + hash[0] +"\n" + chash1.join("\n"))}
		// perf
		if (logPerf) {debug_log("analyze " + runtype + " [canvas]",t0)}
		debug_page("perf","canvas",t0canvas,gt0)
	})
}

function outputCanvas() {

	var canvas = {
		createHashes: function(window){
			let outputs = [
				{
					name: "getContext",
						value: function(){
						return ["2d"].map(function(type){
							var canvas = getCanvas()
							try {
								var context = canvas.getContext(type)
								if (!context){
									throw new Error()
								}
								return type + ": supported"
							}
							catch (e){
								return type + ": not supported"
							}
						}).join(", ")
					}
				},
				{
					name: "toDataURL",
					value: function(){
						return hashDataURL(getFilledContext().canvas.toDataURL())
					}
				},
				{
					name: "toBlob",
					value: function(){
						return new Promise(function(resolve, reject){
							try {
								var timeout = window.setTimeout(function(){
									reject("timout in toBlob")
								}, 750)
							getFilledContext().canvas.toBlob(function(blob){
								window.clearTimeout(timeout)
								var reader = new FileReader()
								reader.onload = function(){
									resolve(hashDataURL(reader.result))
								}
								reader.onerror = function(){
									reject("Unable to read blob!")
								}
								reader.readAsDataURL(blob)
							})
							}
							catch (e){
								resolve(e.name + ": " + e.message)
							}
						})
					}
				},
				{
					name: "mozGetAsFile",
					value: function(){
						return new Promise(function(resolve, reject){
							var file = getFilledContext().canvas.mozGetAsFile("canvas.png")
							var reader = new FileReader()
							reader.onload = function(){
								resolve(hashDataURL(reader.result))
							}
							reader.readAsDataURL(file)
						})
					}
				},
				{
					class: window.CanvasRenderingContext2D,
					name: "getImageData",
					value: function(){
						var context = getFilledContext()
						var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
						return window.crypto.subtle.digest("SHA-256", imageData.data).then(hashToString)
					}
				},
				{
					supported: function(){
						// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
						var context = getContext()
						context.rect(0, 0, 10, 10)
						context.rect(2, 2, 6, 6)
						return context.isPointInPath(5, 5, 'evenodd') === false
					},
					name: "winding",
					value: function(){
						return "supported"
					}
				},
				{
					class: window.CanvasRenderingContext2D,
					name: "isPointInPath",
					value: function(){
						var context = getPathContext()
						var data = new Uint8Array(30 * 30)
						for (var x = 0; x < 30; x += 1){
							for (var y = 0; y < 30; y += 1){
								data[y * 30 + x] = context.isPointInPath(x, y)
							}
						}
						return window.crypto.subtle.digest("SHA-256", data).then(hashToString)
					}
				},
				{
					class: window.CanvasRenderingContext2D,
					name: "isPointInStroke",
					value: function(){
						var context = getPathContext()
						var data = new Uint8Array(30 * 30)
						for (var x = 0; x < 30; x += 1){
							for (var y = 0; y < 30; y += 1){
								data[y * 30 + x] = context.isPointInStroke(x, y)
							}
						}
						return window.crypto.subtle.digest("SHA-256", data).then(hashToString)
					}
				},
				{
					class: window.CanvasRenderingContext2D,
					name: "fillText",
					value: function(){
						getContext().fillText("test", 0, 0)
						return "supported"
					}
				},
				{
					class: window.CanvasRenderingContext2D,
					name: "strokeText",
					value: function(){
						getContext().strokeText("test", 0, 0)
						return "supported"
					}
				},
			];
			function isSupported(output){
				return !!(output.class? output.class: window.HTMLCanvasElement).prototype[output.name]
			}
			function getCanvas(){
				return window.document.createElement("canvas")
			}
			function getContext(type){
				return getCanvas().getContext(type || "2d")
			}
			function getFilledContext(){
				// taken from https://panopticlick.eff.org/static/fp2.js
				var context = getContext()
				var canvas = context.canvas
				canvas.width = 2000
				canvas.height = 200
				canvas.style.display = "inline"
				// detect browser support of canvas winding
				// http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
				// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
				context.rect(0, 0, 10, 10)
				context.rect(2, 2, 6, 6)

				context.textBaseline = "alphabetic"
				context.fillStyle = "#f60"
				context.fillRect(125, 1, 62, 20)
				context.fillStyle = "#069"
				context.font = "11pt no-real-font-123"
				context.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15)
				context.fillStyle = "rgba(102, 204, 0, 0.7)"
				context.font = "18pt Arial"
				context.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45)

				// canvas blending
				// http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
				// http://jsfiddle.net/NDYV8/16/
				context.globalCompositeOperation = "multiply"
				context.fillStyle = "rgb(255,0,255)"
				context.beginPath()
				context.arc(50, 50, 50, 0, Math.PI * 2, true)
				context.closePath()
				context.fill()
				context.fillStyle = "rgb(0,255,255)"
				context.beginPath()
				context.arc(100, 50, 50, 0, Math.PI * 2, true)
				context.closePath()
				context.fill()
				context.fillStyle = "rgb(255,255,0)"
				context.beginPath()
				context.arc(75, 100, 50, 0, Math.PI * 2, true)
				context.closePath()
				context.fill()
				context.fillStyle = "rgb(255,0,255)"
				// canvas winding
				// http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
				// http://jsfiddle.net/NDYV8/19/
				context.arc(75, 75, 75, 0, Math.PI * 2, true)
				context.arc(75, 75, 25, 0, Math.PI * 2, true)
				context.fill("evenodd")
				return context
			}
			function getPathContext(){
				var context = getContext()
				context.canvas.width = 30
				context.canvas.height = 30
				context.fillStyle = "#000"
				context.beginPath()
				context.arc(15.49, 15.51, 10.314, 0, Math.PI * 2)
				context.closePath()
				context.fill()
				return context
			}
			function hashToString(hash){
				var chunks = [];
				(new Uint32Array(hash)).forEach(function(num){
					chunks.push(num.toString(16))
				})
				return chunks.map(function(chunk){
					return "0".repeat(8 - chunk.length) + chunk
				}).join("")
			}
			function hashDataURL(url){
				return crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(url)).then(hashToString)
			}
			var finished = Promise.all(outputs.map(function(output){
				return new Promise(function(resolve, reject){
					var displayValue
					try {
					var supported = output.supported? output.supported(): isSupported(output);
					if (supported){
							displayValue = output.value()
						}
						else {
							displayValue = "not supported"
						}
					}
						catch (e){
							displayValue = (e.name == "TypeError" ? "" : e.name + ": ") + e.message
						}
					Promise.resolve(displayValue).then(function(displayValue){
						output.displayValue = displayValue
						resolve(output)
					}, function(e){
						output.displayValue = "error while testing"
						resolve(output)
					})
				})
			}))
			return finished
		}
	}

	// vars
	t0canvas = performance.now()
	let t0 = performance.now(),
		main1 = [], main2 = []

	Promise.all([
		canvas.createHashes(window),
		canvas.createHashes(window)
	]).then(function(outputs){
		outputs[0].forEach(function(output){
			main1.push(output.name+","+output.displayValue)
		})
		outputs[1].forEach(function(output){
			main2.push(output.name+","+output.displayValue)
		})
		if (logPerf) {debug_log("main [canvas]",t0)}
		analyzeCanvas("main", main1, main2)
	})
	// ToDo: canvas: iframes: each with two passes

}

outputCanvas()
