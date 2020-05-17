"use strict";

/* code courtesy of kkapsner and canvasblocker
- https://canvasblocker.kkapsner.de/test/
- https://github.com/kkapsner/CanvasBlocker
- tiny modifications by newbie Thorin-Oakenpants */

function outputCanvas() {
	// vars
	let count = 0, expected = 11, res1 = [], res2 = [], chash1 = []

	function display_canvas(item, value1, value2) {
		// vars
		let table = dom.tb8
		let is78rfp = false,
			pushvalue = value1,
			control = "",
			isRandom = false
		// hash notation strings
		let red = rfp_red,
			grn = rfp_green,
			redr = rfpr_red,
			grnr = rfpr_green,
			random = s8 + note_random
		let element = table.querySelector("." + item)

		// tweak
		if (isFile) {red = note_file; grn = red; redr = red; grnr = red}
		if (!window.PerformanceNavigationTiming) {is78rfp = true}
		if (value1 !== value2) {isRandom = true; pushvalue = "random"}

		// supported/not-supported
		if (isFF) {
			if (item == "winding" || item == "fillText" || item == "strokeText") {
				value1 += (value1 == "supported" ? rfp_green : rfp_red)
			}
			if (item == "getContext") {
				if (value1.substring(0,5) == "2d: s") {
					value1 = value1.replace("2d: supported", "2d: supported" + rfp_green)
				} else {
					value1 = value1.replace("2d: not supported", "2d: not supported" + rfp_red)
				}
			}
			// FF only
			if (item == "mozGetAsFile") {
				if (isVer > 73) {
					// supported
					control = "not supported"
					value1 += (value1 == control ? rfp_green : rfp_red )
				} else {
					// hash
					control = "d87b36e65e37d411ac204db663f0ec05fe94bf7b6df537bab3f11052d1621ecc"
					value1 += (value1 == control ? grn : red)
					value1 += (isRandom ? random + "<br>" + value2 : "")
				}
			}
		}
		// hash: webgl
		if (item == "readPixels") {
			if (isRandom) {
				value1 += (isFile ? note_file : "")
				value1 += (isRandom ? random + "<br>" + value2 : "")
			} else if (isFF) {
				if (sha1(value1) == "47bf7060be2764c531da228da96bd771b14917a1") {
					// NotSupportedError: Operation is not supported
					value1 += tb_standard
				} else if (sha1(value1) == "80505e817edc581bfff3e1f9137d52efbc183f03") {
					// Error: Permission denied to access property "createBuffer"
					value1 += tb_safer
				}
			}
		}
		// hashes: static RFP
		if (item.substring(0,3) == "isP") {
			control = "957c80fa4be3af7e53b40c852edf96a090f09958cc7f832aaf9a9fd544fb69a8"
			if (isRandom) {
				value1 += (isFile ? note_file : rfp_red)
				value1 += (isRandom ? random + "<br>" + value2 : "")
			} else {
				if (isFF) {value1 += (value1 == control ? grn : red)}
			}
		}
		// hashes: 1621433: randomized 78+ or static RFP
		if (item == "toDataURL" || item == "toBlob" || item == "getImageData") {
			if (isFF) {
				if (isVer > 77) {
					// new random behavior
					value1 += (isRandom ? grnr + "\n" + value2 : redr)
					// distinguish randomness
					if (isRandom) {
						if (is78rfp) {pushvalue = "random RFP good"} else {pushvalue = "random RFP extension"}
					}
				} else {
					// old static behavior
					if (isRandom) {
						value1 += red + random + "\n" + value2
					} else {
						if (item == "getImageData") {
							control = "ae8d89f4cb47814af5d79e63a1a60b3f3f28d9309189b7518f1ecc23d8bda282"
						} else {
							control = "d87b36e65e37d411ac204db663f0ec05fe94bf7b6df537bab3f11052d1621ecc"
						}
						value1 += (value1 == control ? grn : red )
					}
				}
			} else {
				// non-FF
				if (isRandom) {value1 += (isRandom ? random + "<br>" + value2 : "")}
			}
		}
		// push + output
		if (item !== "readPixels") {
			chash1.push(item+", "+pushvalue)
		}
		element.innerHTML = value1
	}

	function run_results() {
		for (let i=0; i < res1.length; i++) {
			let str1 = res1[i],
				str2 = res2[i],
				delim = str1.search(","),
				display = str1.substring(0,delim),
				value1 = str1.substring(delim+1, str1.length),
				value2 = str2.substring(delim+1, str1.length)
			display_canvas(display, value1, value2)
		}
		// overall hash
		chash1.sort()
		console.debug("OVERALL HASH\n" + chash1.join("\n"))
		let note = ""
		Promise.all([
			sha256_str(chash1.join())
		]).then(function(hash){
			hash = hash[0]
			if (isFF) {
				if (isFile) {
					note = note_file
				} else if (hash == "52f1642531c3a1b5dcb1eb8b45f6b063d169bbc0f2345c7560b1c51e057f3634") {
					// randomizing
					note = rfp_green + " [FF78+]"
				} else if (hash == "09a923c4a70817b75d49a6446895faac505375bca45ee5a785aec9ae215500c9" && isVer < 78) {
					// moz dropped
					note = rfp_green + " [FF74-77]"
				} else if (hash == "f3f988d1a390eddb13f26d602a129f7c8d6d3efedc04569cc09c72608b011654" && isVer < 74) {
					// older
					note = rfp_green + " [FF73 or lower]"
				} else {
					note = rfp_red
				}
			}
			dom.chash1.innerHTML = hash + note
		})
		// perf
		debug_page("perf","canvas",t0,gt0)		
	}

	var canvas = {
		createHashes: function(window){
			let outputs = [
				{
					name: "getContext",
						value: function(){
						return ["2d", "webgl", "webgl2"].map(function(type){
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
								}, 500)
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
								resolve(e.message)
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
				{
					class: window.WebGLRenderingContext,
					name: "readPixels",
					value: function(){
						var context = getFilledWebGlContext()
						if (!context){
							return "webgl not supported"
						}
						var pixels = new Uint8Array(context.drawingBufferWidth * context.drawingBufferHeight * 4)
						context.readPixels(0, 0, context.drawingBufferWidth, context.drawingBufferHeight, context.RGBA, context.UNSIGNED_BYTE, pixels)
						return window.crypto.subtle.digest("SHA-256", pixels).then(hashToString)
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
			function getFilledWebGlContext(){
				// taken from https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
				var context = getContext("webgl") || getContext("webgl2")
				if (!context){
					return null
				}
				var vertexShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
				var fragmentShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
				var vertexPosBuffer = context.createBuffer()
				context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer)
				var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0])
				context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW)
				vertexPosBuffer.itemSize = 3
				vertexPosBuffer.numItems = 3
				var program = context.createProgram()
				var vertexShader = context.createShader(context.VERTEX_SHADER)
				context.shaderSource(vertexShader, vertexShaderTemplate)
				context.compileShader(vertexShader)
				var fragmentShader = context.createShader(context.FRAGMENT_SHADER)
				context.shaderSource(fragmentShader, fragmentShaderTemplate)
				context.compileShader(fragmentShader)
				context.attachShader(program, vertexShader)
				context.attachShader(program, fragmentShader)
				context.linkProgram(program)
				context.useProgram(program)
				program.vertexPosAttrib = context.getAttribLocation(program, "attrVertex")
				program.offsetUniform = context.getUniformLocation(program, "uniformOffset")
				context.enableVertexAttribArray(program.vertexPosArray)
				context.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, context.FLOAT, !1, 0, 0)
				context.uniform2f(program.offsetUniform, 1, 1)
				context.drawArrays(context.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
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
						//console.error(e)
						output.displayValue = "error while testing"
						resolve(output)
					})
				})
			}))
			return finished
		},
		output: function(dataPromise){
			dataPromise.then(function(outputs){
				outputs.forEach(function(output){
					res1.push(output.name+","+output.displayValue)
				})
			})
		},
		output2: function(dataPromise){
			dataPromise.then(function(outputs){
				outputs.forEach(function(output){
					res2.push(output.name+","+output.displayValue)
					count++
					if (count==expected) {
						run_results()
					}
				})
			})
		}
	}

	let t0 = performance.now()
	canvas.output(canvas.createHashes(window))
	canvas.output2(canvas.createHashes(window))
}

outputCanvas()
