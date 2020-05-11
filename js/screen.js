'use strict';

var jsZoom, varDPI, dpi_x, dpi_y;

/* FUNCTIONS */

function return_lb_nw(w,h) {
	// LB
	let wstep = 200, hstep = 200, bw = false, bh = false
	if (w < 501) {wstep = 50} else if (w < 1601) {wstep = 100}
	if (h < 501) {hstep = 50} else if (h < 1601) {hstep = 100}
	bw = Number.isInteger(w/wstep)
	bh = Number.isInteger(h/hstep)
	let r = (bw && bh) ? lb_green : lb_red
	// NW
	wstep = 200, hstep = 100, bw = false, bh = false
	if (w < 1001) {bw = Number.isInteger(w/wstep)}
	if (h < 1001) {bh = Number.isInteger(h/hstep)}
	r += (bw && bh) ? nw_green : nw_red
	return r
}

function return_mm_dpi(type) {
	let r = ""
	try {
		r = (function () {
			for (let i=1; i < 2000; i++) {
				if (matchMedia("(max-resolution:"+i+type+")").matches === true) {
					return i}
			} return i
		})()
	} catch(e) {
		r = "error"
	}
	return r
}

function get_chrome() {
	let c = "chrome://browser/content/extension-",
		p = "-panel.css",
		list = [c+'win'+p, c+'mac'+p],
		os = "Linux",
		x = 0,
		t0 = performance.now()
	// run isTB2 once
	if (isTB2 == "") {list.push('resource://torbutton-assets/aboutTor.css')}
	// output
	function output(r) {
		// os-check (runS already sets isOS ="")
		if (r.toLowerCase() !== isOS) {r += sb+"[!= widget]"+sc + (runS ? zSIM : "")}
		dom.fdChromeOS.innerHTML = r
		if (logPerf) {debug_log("chrome [ua]",t0)}
	}
	// run
	function run() {
		// win/mac
		list.forEach(function(item) {
			let css = document.createElement("link")
			css.href = item
			css.type = "text/css"
			css.rel = "stylesheet"
			document.head.appendChild(css)
			css.onload = function() {
				if (item === c+"win"+p) {os="Windows"; x++; output(os)}
				if (item === c+"mac"+p) {os="Mac"; x++; output(os)}
				// isTB2
				if (item.substring(0,3) === "res") {
					isTB = true; debug_page("tb","     resource:// = aboutTor.css")
					isTB2 = "y"
					if (logPerf) {debug_log("[yes] tb resource [ua]",t0)}
				}
			}
			css.onerror = function() {
				if (item.substring(0,3) === "res") {
					isTB2 = "n"
					if (logPerf) {debug_log("[no] tb resource [ua]",t0)}
				} else {x++}
			}
			document.head.removeChild(css)
		})
		// android
		let img = new Image()
		img.src = "chrome://branding/content/icon64.png"
		img.style.visibility = "hidden"
		document.body.appendChild(img)
		img.onload = function() {x++}
		img.onerror = function() {os="Android"; x++; output(os)}
		document.body.removeChild(img)
		// linux: default
		function check_linux() {
			if (x == 3) {
				clearInterval(checking)
				if (os == "Linux") {output(os)}
			}
		}
		let checking = setInterval(check_linux, 20)
	}
	run()
}

function get_collation() {
	let list = ['ka','ku','lo','no','pa','tk'],
		chars = ['\u00F1','\u00E4','\u0109','\u0649','\u10D0','\u0E9A'],
		results = [],
		missing = [],
		t0 = performance.now()
	// output
	function output(hash) {
		let r = "",
			c = ""
		if (missing.length > 0) {
			c = " [missing locale code" + (missing.length > 1 ? "s" : "")
				+ ":" + missing.join(", ") + "]"
		}
		if (hash == "d0e83d1d652f95d686870a59def6ddcc7cde5e28") {
			r = zFF + " [FF70+]" + c
		} else if (hash == "e4a32b021b6743d34573ab91a9a31d1068e5b01e") {
			r = zFF + " [FF65-69]" + c
		} else if (hash == "78c0998f75b0da6b11dd55e2f29dc054e14aae9e") {
			r = zFF + " [FF64 or lower]" + c
		} else if (isFF) {
			r = not_seen+" collation combo before"+sc + c + (runS ? zSIM : "")
		}
		dom.fdCollation.innerHTML = r
		if (logPerf) {debug_log("collation [ua]",t0)}
	}
	// run
	function run() {
		let control = chars.sort(Intl.Collator("en-US").compare)
		control = sha1(control.join())
		for (let i=0; i < list.length; i++) {
			chars.sort(Intl.Collator(list[i]).compare)
			let test = sha1(chars.join())
			results.push(test)
			if (control == test) {missing.push("<code>" + list[i] + "</code>")}
		}
		output(sha1(results.join()) + (runS ? "a" : ""))
	}
	run()
}

function get_color() {
	// depth
	let r1 = screen.pixelDepth, r2 = screen.colorDepth
	let r = r1+" | "+r2
	dom.ScrColor.innerHTML = r += (r == "24 | 24" ? rfp_green : rfp_red)
	// color
	r = (function () {
		for (let i=0; i < 1000; i++) {
			if (matchMedia("(color:"+i+")").matches === true) {return i}
		}
		return i
	})()
	dom.mmC.innerHTML = (r == 8 ? r+rfp_green : r+rfp_red)
	store_data("sc","bits",r1+", "+r2+", "+r)
}

function get_errors() {
	let res = [],
		test = "",
		hash = "",
		code = "",
		ff = "",
		t0 = performance.now()
	// output
	function output() {
		let unusual = false
		hash = sha1(res.join())
		let temp = hash.substring(0,10)
		if (isErr == "") {isErr = hash.substring(0,4)}
		if (isErr == "X") {
			code = "X"; ff = "[FF59 or lower]"
		} else if (temp == "e09e23efbf") {	
			code = "A"; ff = "[FF60-67]"
		} else if (temp == "9be311282c") {
			code = "B"; ff = "[FF68-69]"
		} else if (temp == "1492f1bd13") {
			code = "C"; ff = "[FF70]"
		} else if (temp == "7121c507d7") {
			code = "D"; ff = "[FF71]"
		// 74+: 1259822: pref alters err2: 2 outcomes
		} else if (temp == "fa8efa5727") {
			code = "E1"; ff = "[FF72-74]"
		} else if (temp == "fb19e1bedb") {
			code = "E2"; ff = "[FF74]"; unusual = true
		} else if (temp == "214fc55f92") {
			code = "F1"; ff = "[FF75+]"
		} else if (temp == "5186bfbb76") {
			code = "F2"; ff = "[FF75+]"; unusual = true
		} else if (temp == "0dc5e92b7d") {
			code = "N1"; ff = "[Nightly]"
		} else if (temp == "b75bad7247") {
			code = "N2"; ff = "[Nightly]"; unusual = true
		}
		dom.labelErr2.innerHTML = (unusual ? sb+"[non-standard] "+sc + "error2" : "error2")
		if (code !== "") {
			code = s2+"["+code+"]"+sc
			isFF = true
			dom.fdError.innerHTML = zFF +" "+ ff + (unusual ? sb+"[non-standard: see details]"+sc : "")
		} else if (isFF) {
			code = zNEW
			dom.fdError.innerHTML = not_seen+" error combo before"+sc + (runS ? zSIM : "")
		}
		dom.errh.innerHTML = hash + code + (runS ? zSIM : "")
		store_data("ua","1 err",hash)
		if (logPerf) {debug_log("errors [ua]",t0)}
	}
	// run
	function run() {
		//1
		try {eval("alert('A)")} catch(e) {
			dom.err1=e; res.push(e)
			if (e.message == "unterminated string literal") {isErr = "X"}
		}
		//2
		try {
			function foobar() {let foo = document.getElementById("bar"); foo.value = screen.width}
			window.onload = foobar()
		} catch(e) {
			if (runS) {e += zSIM}
			dom.err2=e; res.push(e)
		}
		//3
		try {
			test = BigInt(2.5)
		} catch(e) {
			test = e.message.substring(0,3)
			if (test == "can") {
				try {
					test = eval("987654321987654321n")
					let num = new Intl.NumberFormat(undefined)
					test = num.format(test)
					test = e.name+": "+ e.message
				} catch (e) {
					test = e.name+": "+ e.message
				}
			} else if (test == "Big") {
				test = e.name+": "+ e.message
			} else {
				test = e.name+": "+ e.message
			}
			dom.err3=test; res.push(test)
		}
		//4
		try {test = eval("let a = 1_00_;")
		} catch(e) {
			test = e.name+": "+e.message; dom.err4=test; res.push(test)
		}
		//5
		try {
			test = new Intl.NumberFormat("en", {style:"unit", unit:"percent"}).format(1/2)
		} catch(e) {
			test = e.name+": "+e.message; dom.err5=test; res.push(test)
		}
		output()
	}
	run()
}

function get_fullscreen() {
	let r = ""
	try {
		if (document.mozFullScreenEnabled) {
			r = zE
		}	else {
			r = zD; dom.fsLeak = zNA
		}
	} catch(e) {
		r = "no: "+e.name; dom.fsLeak = zNA
	}
	dom.fsSupport = r
	store_data("sc","fs-api",r)
}

function get_line_scrollbar() {
	let osW = "[Windows]",
		osWL = "[Windows or Linux]",
		osWM = "[Windows or Mac]",
		osWLM = "[Windows, Linux or Mac]",
		osL = "[Linux]",
		osLA = "[Linux or Android]",
		osLM = "[Linux or Mac]",
		osM = "[Mac]",
		osTBL = " [Linux]"+tb_green,
		os = "",
		sbZoom = ""

	// scrollbar
	function run_scrollbar() {
		let t0 = performance.now()
		// recalc zoom/viewport
		get_zoom("ua")
		let vw = get_viewport("ua")
		// get width, remember it for later
		let w = (window.innerWidth-vw),
			wZoom = w
		// start
		if (w == 0) {
			os= "[Mac OS X, mobile or floating scrollbars]"
		} else if (w < 0) {
			os= "[mobile]"
		}	else {
		// known metrics
			if (jsZoom == 100) {
				if (w==17) {os=osW};
				if (w==16) {os=osL}
				if (w==15) {os=osM}
				if (w==12) {os=osL}
			} else if (jsZoom == 300) {
				if (w==6) {os=osWL}
				if (w==5) {os=osWM}
				if (w==4) {os=osL}
			} else if (jsZoom == 240) {
				if (w==7) {os=osWM}
				if (w==6) {os=osL}
				if (w==5) {os=osL}
			} else if (jsZoom == 200) {
				if (w==9) {os=osW}
				if (w==8) {os=osWLM}
				if (w==7) {os=osM}
				if (w==6) {os=osL}
			} else if (jsZoom == 170) {
				if (w==10) {os=osWL}
				if (w==8) {os=osM}
				if (w==7) {os=osL}
			} else if (jsZoom == 150) {
				if (w==12) {os=osW}
				if (w==11) {os=osW}
				if (w==10) {os=osLM}
				if (w==8) {os=osL}
			} else if (jsZoom == 133) {
				if (w==13) {os=osW}
				if (w==12) {os=osWL}
				if (w==11) {os=osM}
				if (w==9) {os=osL}
			} else if (jsZoom == 120) {
				if (w==15) {os=osW}
				if (w==14) {os=osWL}
				if (w==12) {os=osM}
				if (w==10) {os=osL}
			} else if (jsZoom == 110) {
				if (w==16) {os=osW}
				if (w==15) {os=osW}
				if (w==14) {os=osLM}
				if (w==11) {os=osL}
			} else if (jsZoom == 90) {
				if (w==19) {os=osW}
				if (w==18) {os=osL}
				if (w==17) {os=osM}
				if (w==16) {os=osM}
				if (w==13) {os=osL}
			} else if (jsZoom == 80) {
				if (w==21) {os=osW}
				if (w==20) {os=osL}
				if (w==19) {os=osM}
				if (w==15) {os=osL}
			} else if (jsZoom == 67) {
				if (w==26) {os=osW}
				if (w==25) {os=osW}
				if (w==24) {os=osL}
				if (w==23) {os=osM}
				if (w==22) {os=osM}
				if (w==18) {os=osL}
			} else if (jsZoom == 50) {
				if (w==34) {os=osW}
				if (w==32) {os=osL}
				if (w==30) {os=osM}
				if (w==24) {os=osL}
			} else if (jsZoom == 30) {
				if (w==57) {os=osW}
				if (w==56) {os=osW}
				if (w==54) {os=osL}
				if (w==50) {os=osM}
				if (w==40) {os=osL}
			}
			if (os != "") {
				// known
				os += " [known metric]"
			} else {
				// still unknown
				if (jsZoom !== 100) {
					// recalc scrollbar at 100% for final guess: not perfect
					if (window.devicePixelRatio !== 1 || dpi_y == 0) {
						// RFP is off or css is blocked
						wZoom = w * window.devicePixelRatio
					} else {
						wZoom = w * (((varDPI/dpi_x)*100)/100)
					}
				}
				// final guess
				if (wZoom >= 16.5) {
					os=osW // in testing = windows only
				} else {
					os=osL // guess linux (andoid s/be 0, mac s/be covered)
				}
				// guess
				os += " [logical guess]"
			}
		}
		// output
		if (jsZoom !== 100) {sbZoom=" at "+jsZoom+"% "}
		dom.vScroll = w+"px "+sbZoom+os
		// element scrollbar
		let eW = (100-dom.tScroll.scrollWidth)
		if (jsZoom == 100) {
			eW += "px" + (eW == w ? "" : sb+"[!= viewport scrollbar]"+sc)
		}
		dom.eScroll.innerHTML = eW
		// perf
		if (logPerf) {debug_log("scrollbar [ua]",t0)}
	}

	// css lineheight
	function run_lineheight() {
		let method = "computedstyle",
			strFont = "",
			t0 = performance.now()
		os = ""
		// computedStyle
		let element = dom.spanLH,
			lh = getComputedStyle(element).getPropertyValue("line-height")
		// font
		let font = getComputedStyle(element).getPropertyValue("font-family")
		if (font.slice(1,16) !== "Times New Roman") {strFont = sb+"[document fonts are disabled]"+sc}
		// clientrect
		if (lh == "normal") {
			element = dom.divLH
			try {
				let elDiv = element.getBoundingClientRect()
				lh = elDiv.height
				// trim decimals
				if (count_decimals(lh) > 4) {lh = lh.toFixed(4)}
				lh = lh.toString()
				method = "clientrect"
			} catch(err) {
				method = "none"
			}
		}
		// build
		if (method !== "none") {
			// trim
			if (lh.substr(-2) == "px") {lh = lh.slice(0, -2)}
			// check font
			if (strFont !== "") {
				os = strFont
			} else if (lh == "19.2") {
				// TB DESKTOP: 19.2 seems TB unique any-zoom/any-platform
				os = tb_green
				isTB = true; debug_page("tb"," css line height = 19.2")
			} else {
				// isTNR + not 19.2
				// WINDOWS / LINUX: some known metrics
				if (jsZoom == 100) {
					if (lh=="20") {os=osW}
					if (lh=="19") {os=osL}
					if (lh=="18") {os=osW}
					if (lh=="17") {os=osL}
				} else if (jsZoom == 300) {
					if (lh=="19") {os=osW}
					if (lh=="18.6667") {os=osW}
					if (lh=="18") {os=osL}
					if (lh=="17.6667") {os=osL}
				} else if (jsZoom == 240) {
					if (lh=="19.1667") {os=osW}
					if (lh=="19") {os=osTBL}
					if (lh=="18.3333") {os=osWL}
					if (lh=="17.5") {os=osL}
				} else if (jsZoom == 200) {
					if (lh=="19") {os=osW}
					if (lh=="18") {os=osL}
				} else if (jsZoom == 170) {
					if (lh=="19.25") {os=osW}
					if (lh=="18.9") {os=osTBL}
					if (lh=="18.6667") {os=osW}
					if (lh=="18.0833") {os=osL}
					if (lh=="17.5") {os=osL}
				} else if (jsZoom == 150) {
					if (lh=="20") {os=osW}
					if (lh=="18.6667") {os=osWL}
					if (lh=="17.3333") {os=osL}
				} else if (jsZoom == 133) {
					if (lh=="19.5") {os=osW}
					if (lh=="18.9") {os=osTBL}
					if (lh=="18") {os=osL}
					if (lh=="18.75") {os=osW}
				} else if (jsZoom == 120) {
					if (lh=="20") {os=osW}
					if (lh=="19.1667") {os=osL}
					if (lh=="19") {os=osTBL}
					if (lh=="18.3333") {os=osW}
					if (lh=="17.5") {os=osL}
				} else if (jsZoom == 110) {
					if (lh=="19.25") {os=osW}
					if (lh=="18.7") {os=osTBL}
					if (lh=="18.3333") {os=osL}
					if (lh=="17.4167") {os=osL}
				} else if (jsZoom == 90) {
					if (lh=="20.1") {os=osW}
					if (lh=="18.9833") {os=osWL}
					if (lh=="18.7667") {os=osTBL}
					if (lh=="16.75") {os=osL}
				} else if (jsZoom == 80) {
					if (lh=="20") {os=osW}
					if (lh=="19.5") {os=osTBL}
					if (lh=="18.75") {os=osWL}
				} else if (jsZoom == 67) {
					if (lh=="21") {os=osW}
					if (lh=="19.8") {os=osTBL}
					if (lh=="19.5") {os=osWL}
					if (lh=="18") {os=osL}
				} else if (jsZoom == 50) {
					if (lh=="22") {os=osW}
					if (lh=="20") {os=osWL}
					if (lh=="18") {os=osL}
				} else if (jsZoom == 30) {
					if (lh=="20") {os=osWL}
					if (lh=="26.6667") {os=osW}
				}
			}
			// MAC
			if (os == "") {
			/*  unique: .0167 .05 .0833 .1833 .35 .4333 .6833 .8333 .85
			not unique: .7667 .6667 (but unique at those zoom values)
			hackernews: .5167 (can't repro) */
				let lhDec = (lh+"").split(".")[1]
				if (lhDec=="0167" | lhDec=="05" | lhDec=="0833" | lhDec=="1833" | lhDec=="35" | lhDec=="4333" | lhDec=="6833"
					| lhDec=="8333" | lhDec=="85" | lhDec=="7667" | lhDec=="6667" | lhDec=="5167") {os=osM}
			}
			// ANDROID
			if (os == "") {
				// ToDo: css line height: Android affected by devicePixelRatio
			}
			if (os == "") {
				// guess
				os = osLA+" [logical guess]"
			} else {
				if (font.slice(1,16) == "Times New Roman") {
					// known
					os += " [known metric]"
				}
			}
		}
		// output
		if (method == "none") {
			dom.cssLH.innerHTML = sb+"[api is blocked]"+sc + strFont
		} else {
			dom.cssLH.innerHTML = lh + "px "+ sbZoom + os + s2+"["+method+"]"+sc
		}
		if (logPerf) {debug_log("css line height [ua]",t0)}
	}

	run_scrollbar()
	run_lineheight()
}

function get_mm_metrics(runtype) {
	let t0 = performance.now(),
		count = 0
	// perf
	function perf() {
		if (count == 4) {
			let str = (runtype == "load" ? "" : "ignore")
			if (logPerf) {debug_log("mm various [screen]",t0, str)}
		}
	}
	// output
	function runTest(callback){
		// screen
		Promise.all([
			callback("device-width", "max-device-width", "px", 512, 0.01),
			callback("device-height", "max-device-height", "px", 512, 0.01)
		]).then(function(device){
			dom.ScrMM = device.join(" x ")
			count++; perf()
		}).catch(function(err){
			dom.ScrMM = err
			count++; perf()
		})
		// inner
		Promise.all([
			callback("width", "max-width", "px", 512, 0.01),
			callback("height", "max-height", "px", 512, 0.01)
		]).then(function(inner){
			dom.WndInMM = inner.join(" x ")
			count++; perf()
		}).catch(function(err){
			dom.WndInMM = err
			count++; perf()
		})
		// moz
		if (isFF) {
			callback("-moz-device-pixel-ratio", "max--moz-device-pixel-ratio", "", 2, 0.0000001
			).then(function(moz){
				dom.mmDPRm.innerHTML = moz += (moz == 1 ? rfp_green : rfp_red)
				count++; perf()
			}).catch(function(err){
				dom.mmDPRm = err
				count++; perf()
			})
		} else {
			dom.mmDPRm = zNS
			count++; perf()
		}
		// webkit
		if (!isFF || isVer > 62) {
			callback("-webkit-device-pixel-ratio", "-webkit-max-device-pixel-ratio", "", 2, 0.0000001
			).then(function(web){
				dom.mmDPRw = web
				count++; perf()
			}).catch(function(err){
				dom.mmDPRw = err
				count++; perf()
			})
		} else {
			dom.mmDPRw = zNS
			count++; perf()
		}
	}

	function searchValue(tester, maxValue, precision){
		let minValue = 0
		let ceiling = Math.pow(2, 32)
		function stepUp(){
			if (maxValue > ceiling){
				return Promise.reject("unable to find upper bound")
			}
			return tester(maxValue).then(function(testResult){
				if (testResult === searchValue.isEqual){
					return maxValue
				}
				else if (testResult === searchValue.isBigger){
					minValue = maxValue
					maxValue *= 2
					return stepUp()
				}
				else {
					return false
				}
			})
		}
		function binarySearch(){
			if (maxValue - minValue < precision){
				return tester(minValue).then(function(testResult){
					if (testResult.isEqual){
						return minValue
					}
					else {
						return tester(maxValue).then(function(testResult){
							if (testResult.isEqual){
								return maxValue
							}
							else {
								return Promise.reject(
									"between "+minValue+" and "+maxValue
								)
							}
						})
					}
				})
			}
			else {
				let pivot = (minValue + maxValue) / 2
				return tester(pivot).then(function(testResult){
					if (testResult === searchValue.isEqual){
						return pivot
					}
					else if (testResult === searchValue.isBigger){
						minValue = pivot
						return binarySearch()
					}
					else {
						maxValue = pivot
						return binarySearch()
					}
				})
			}
		}
		return stepUp().then(function(stepUpResult){
			if (stepUpResult){
				return stepUpResult
			}
			else {
				return binarySearch()
			}
		})
	}
	searchValue.isSmaller = -1
	searchValue.isEqual = 0
	searchValue.isBigger = 1

	runTest(function(prefix, maxPrefix, suffix, maxValue, precision){
		return searchValue(function(valueToTest){
			if (window.matchMedia("("+prefix+": "+valueToTest+suffix+")").matches){
				return Promise.resolve(searchValue.isEqual)
			}
			else if (window.matchMedia("("+maxPrefix+": "+valueToTest+suffix+")").matches){
				return Promise.resolve(searchValue.isSmaller)
			}
			else {
				return Promise.resolve(searchValue.isBigger)
			}
		}, maxValue, precision)
	})
}

function get_orientation(runtype) {
	let t0 = performance.now()
	// mm
	let l="landscape", p="portrait", q="(orientation: ", s="square",
		a="aspect-ratio", o1=zNS, o2=zNS, o3=zNS, o4=zNS;
	o1 = (function () {
		if (window.matchMedia("(-moz-device-orientation:"+l+")").matches) return l
		if (window.matchMedia("(-moz-device-orientation:"+p+")").matches) return p
	})()
	o2 = (function () {
		if (window.matchMedia(q+p+")").matches) return p
		if (window.matchMedia(q+l+")").matches) return l
	})()
	o3 = (function () {
		if (window.matchMedia("("+a+":1/1)").matches) return s
		if (window.matchMedia("(min-"+a+":10000/9999)").matches) return l
		if (window.matchMedia("(max-"+a+":9999/10000)").matches) return p
	})()
	o4 = (function () {
		if (window.matchMedia("(device-"+a+":1/1)").matches) return s
		if (window.matchMedia("(min-device-"+a+":10000/9999)").matches) return l
		if (window.matchMedia("(max-device-"+a+":9999/10000)").matches) return p
	})()
	dom.mmO = o1+" | "+o2+" | "+o3+" | "+o4
	// screen*
	dom.ScrOrient.innerHTML = (function () {
		let r = screen.orientation.type+" | "+screen.mozOrientation+" | "+screen.orientation.angle
		r = r.replace(/landscape-secondary/g, "upside down")
		r = r.replace(/-primary/g, "")
		r = r.replace(/-secondary/g, "")
		r = (r == "landscape | landscape | 0" ? r+rfp_green : r+rfp_red)
		return r
	})()
	// display-mode
	dom.mmDM = (function () {
		q="(display-mode:"
		if (window.matchMedia(q+"fullscreen)").matches) return "fullscreen"
		if (window.matchMedia(q+"browser)").matches) return "browser"
		if (window.matchMedia(q+"minimal-ui)").matches) return "minimal-ui"
		if (window.matchMedia(q+p+")").matches) return p
	})()
	// perf
	let str = (runtype == "load" ? "" : "ignore")
	if (logPerf) {debug_log("orientation [screen]",t0, str)}
}

function get_pbmode() {
	let t0 = performance.now()
	function output(r) {
		dom.IsPBMode = r
		store_data("sc","pbm",r)
		if (logPerf) {debug_log("pbmode [screen]",t0)}
	}
	try {
		let db = indexedDB.open("PB")
		db.onerror = function() {output("true")}
		db.onsuccess = function() {output("false")}
	} catch(e) {
		output("unknown: "+e.name)
	}
}

function get_resources() {
	let t0 = performance.now(),
		browser = "",
		branding = "",
		channel = "",
		result = "",
		wFF = "",
		hFF = "",
		extra = "n",
		nob = "[no branding detected]",
		el = dom.branding

	// output
	function output() {
		dom.fdResource.innerHTML = browser + " " + result
		store_data("ua","2 res",browser+" "+wFF+"x"+hFF+" "+extra)
		if (logPerf) {debug_log("resource [ua]",t0)}
	}
	// FF
	function build_FF(wFF, hFF) {
		browser = zFF
		if (wFF == 336 && hFF == 48) {
			//70+
			branding = "Browser"
			channel = "Release/Beta"
		} else if (wFF == 336 && hFF == 64) {
			//70+
			branding = "Browser"
			channel = "Developer/Nightly"
		} else if (wFF == 300 && hFF == 38) {
			//60-69, ESR60/68
			branding = "Quantum"
			channel = "Release/Beta"
		} else if (wFF == 132 && hFF == 62) {
			//60-69
			channel = "Developer Edition"
		} else if (wFF == 270 && hFF == 48) {
			//60-69
			channel = "Nightly"
		}
		if (channel !== "") {
			result = branding+" - "+channel+" ["+wFF+" x "+hFF+"]"
		} else if (hFF > 0) {
			//new
			result = "["+wFF+" x "+hFF+"]" + not_seen+" branding before"+sc + (runS ? zSIM : "")
		} else {
			//none: red=desktop orange=android
			result = (isOS == "android" ? s2 : sb) +nob+sc
		}
	}
	// TB
	function build_TB(wFF, hFF) {
		browser = zTB
		channel = ""
		if (wFF == 270 && hFF == 48) {
			//alpha: 8.5a7+ [60.5.0esr]
			channel = "alpha"
			result = s2+"["+channel+"]"+sc+" ["+wFF+" x "+hFF+"]"
			debug_page("tb","    css branding = 270 x 48 px = alpha")
		} else if (wFF == 300 && hFF == 38) {
			if (isVer > 67) {
				//68+ therefore release
				channel = "release"
				result = s2+"["+channel+"]"+sc+" ["+wFF+" x "+hFF+"]"
			} else {
				//idk
				result = " ["+wFF+" x "+hFF+"]"
			}
		} else if (hFF > 0) {
			//new
			result = "["+wFF+" x "+hFF+"]" + not_seen+" branding before"+sc + (runS ? zSIM : "")
		} else {
			//none: red=desktop orange=android
			result = (isOS == "android" ? s2 : sb) +nob+sc
		}
	}
	function run() {
		// load about:logo
		let imgA = new Image()
		imgA.src = "about:logo"
		imgA.style.visibility = "hidden"
		document.body.appendChild(imgA)
		imgA.addEventListener("load", function() {
			if (imgA.width == 300) {
				// desktop = 300x236: -> icon64
				dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')"
			} else {
				// android = 258x99: -> favicon64 (which gives us tor's icon)
				dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/favicon64.png')"
			}
			if (imgA.width > 0) {
				// brand: get after logo loaded by js: allows time for
				// the two branding images (set by html) to be loaded
				wFF = el.width
				hFF = el.height
				el = dom.torbranding
				let wTB = el.width, hTB = el.height

				if (runS) {
					wFF = 110, hFF = 50 // new to both TB and FF
					//wFF = 336, hFF = 48 // new TB but not new FF
					// to simulate missing, change html img src
				}

				// FF
				build_FF(wFF, hFF)
				// TB
				if (wTB > 0) {
					isTB = true; debug_page("tb","     resource:// = tor-watermark.png")
					extra = "y"
				}
				function check_TB2() {
					if (isTB2 !== "") {
						clearInterval(checking)
						extra += isTB2 // "", "n" or "y"
						if (isTB) {
							build_TB(wFF, hFF)
							if (isOS !== "android" && wTB < 1) {
								result += sb+"[missing tor-watermark.png]"+sc
							}
						}
						// now we output
						output()
					}
				}
				// wait for isTB2
				let checking = setInterval(check_TB2, 10)
			}
		})
		document.body.removeChild(imgA)
	}
	run()

}

function get_screen_metrics(runtype) {
	let t0 = performance.now()
	// measure
	let w1 = screen.width, h1 = screen.height,
		w2 = screen.availWidth, h2 = screen.availHeight,
		w3 = window.outerWidth, h3 = window.outerHeight,
		w = window.innerWidth, h = window.innerHeight,
		p1 = screen.left, p2 = screen.top,
		p3 = screen.availLeft, p4 = screen.availTop,
		p5 = window.screenX, p6 = window.screenY,
		p7 = window.mozInnerScreenX, p8 = window.mozInnerScreenY
	dom.ScrRes = w1+" x "+h1+" ("+p1+","+p2+")"
	dom.ScrAvail = w2+" x "+h2+" ("+p3+","+p4+")"
	dom.WndOut = w3+" x "+h3+" ("+p5+","+p6+")"
	// RFP
	if (isFF) {
		// size
		let m1 = true, m2 = true, r = "", c = "#ff4f4f"
		if (w1+"x"+h1 !== w2+"x"+h2) {m1 = false}
		else if (w2+"x"+h2 !== w3+"x"+h3) {m1 = false}
		else if (w3+"x"+h3 !== w+"x"+h) {m1 = false}
		r = (m1 ? sg : sb) + "[sizes match x4]"+sc
		// pos
		let items = [p1,p2,p3,p4,p5,p6,p7,p8]
		for(let i=0; i < items.length; i++) {if (items[i] != 0) {m2 = false}}
		r += " +" + (m2 ? sg : sb) + "[0,0 x4]"+sc
		dom.match.innerHTML = r
		// color
		if (m1 && m2) {c = "#8cdc8c"}
		items = document.getElementsByClassName("group")
		for(let i=0; i < items.length; i++) {	items[i].style.color = c}
	}
	// update zoom/viewport except on load
	if (runtype !== "load") {
		get_zoom("screen")
		get_viewport("screen")
	}
	// inner
	let strTemp = w+" x "+h+" ("+p7+","+p8+")"
	if (isOS == "android") {
		dom.WndIn = strTemp
	} else {
		// LB+NW
		if (isFF == true) {
			if (jsZoom == 100) {strTemp += return_lb_nw(w,h)} else {strTemp += "<br>"+lb_orange}
		}
		dom.WndIn.innerHTML = strTemp
		if (logExtra) {console.log("C [must follow zoom]: ", runtype, ": screen_metrics")}
	}
	// the rest
	get_mm_metrics(runtype)
	get_orientation(runtype)
	dom.fsState = window.fullScreen
	if (logExtra) {console.log("D [must follow zoom]: ", runtype, ": mm_metrics, orientation, fullscreen")}
}

function get_ua_nav() {
	let list = ['userAgent','appCodeName','appName','product','appVersion',
		'oscpu','platform','buildID','productSub','vendor','vendorSub'],
		res = []
	for(let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = zU}
		let n = (i).toString().padStart(2,"0")
		res.push(n+" "+r)
		document.getElementById("nUA"+n).innerHTML = r
		// show/hide vendor* if not undefined
		if (n == "09" || n == "10") {
			document.getElementById("togUA"+n).style.display = (r == "undefined" ? "none" : "table-row")
		}
	}
	res.sort()
	dom.sectionUA1.innerHTML = sha1(res.join()) + (isFF ? s2+"[spoofable + detectable]"+sc : "")

	// start nav checks
	get_ua_nav_iframe()
	get_ua_nav_worker()
}

function get_ua_nav_iframe() {
	let hash = "",
		el = dom.sectionUA6
	dom.sectionUA7.innerHTML = note_ttc //nested

	function remove_iframe(reason) {
		try {
			let ifua = dom.ifua
			ifua.removeEventListener("load", test)
			dom.iframes.removeChild(ifua)
		} catch(e) {}
		// errors
		if (reason !== "") {
			let s = ""
			if (reason == "cors") {s = error_file_cors}
			if (reason == "404") {s = error_file_404}
			if (reason == "iframe") {s = error_iframe}
			el.innerHTML = s
		}
	}
	function compare() {
		let hash2 = (dom.sectionUA1.textContent).substring(0,40)
		let list = ['userAgent','appCodeName','appName','product','appVersion',
			'oscpu','platform','buildID','productSub','vendor','vendorSub'],
			res = []
		let target = dom.ifua,
			win = target.contentWindow,
			navigator = win.navigator
		for (let i=0; i < list.length; i++) {
			let r = navigator[list[i]]
			if (r == "") {r = "undefined"}
			res.push((i).toString().padStart(2,"0")+" "+r)
		}
		res.sort()
		let hash = sha1(res.join())
		el.innerHTML = hash + (hash == hash2 ? match_green : match_red)
		remove_iframe("")
	}
	function test() {
		setTimeout(function() {
			try {
				let ifua = dom.ifua
				let check = ifua.contentWindow.document.getElementById("test").textContent
				compare()
			} catch(e) {
				if (isFile) {
					remove_iframe("cors")
				} else {
					el.innerHTML = e.message
					remove_iframe("")
				}
			}
		}, 15)
	}
	// start timer
	let delay = 2500
	if (isOS == "android" | isTB) {delay = 3500}
	setTimeout(function(){
		// we're still empty
		if (el.textContent == "") {
			if (isFile) {
				remove_iframe("404")
			} else {
				remove_iframe("iframe")
			}
		}
	}, delay)
	// create & load iframe
	let iframe = document.createElement("iframe")
	iframe.id = "ifua"
	dom.iframes.appendChild(iframe)
	iframe.src = "iframes/test.html"
	iframe.addEventListener("load", test)
}

function get_ua_nav_worker() {
	// control
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = []
	for (let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = "undefined"}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	let control = sha1(res.join())

	function update(data) {
		// compare shared worker to control: output diffs
		let target = "", output = ""
		for (let i=0; i < res.length; i++) {
			if (res[i] !== data[i]) {
				output = data[i].slice(3, data[i].length)
				target = data[i].substring(0,2)
				// match to correct element: nUAxx
				if (target == "05") {target = "06"}
				target = document.getElementById("nUA"+target)
				// append
				target.innerHTML += "<br>" + sb.trim() + output + sc
			}
		}
	}

	function exit(s) {
		dom.sectionUA2.innerHTML = s //web
		dom.sectionUA3.innerHTML = s //shared
		dom.sectionUA4.innerHTML = s //nested
	}
	// workers
	if (isFile) {
		// file
		exit(zNA + note_file)
	} else if (typeof(Worker) == "undefined") {
		// none
		exit(zF)
	} else {

		// web
		let el2 = dom.sectionUA2, test2 = ""
		try {
			let workernav = new Worker("js/worker_ua.js")
			el2.innerHTML = zF
			workernav.addEventListener("message", function(e) {
				test2 = sha1((e.data).join())
				el2.innerHTML = test2 + (test2 == control ? match_green : match_red)
			}, false)
			workernav.postMessage("hi")
		} catch(e) {
			el2.innerHTML = zF
		}

		// shared
		let el3 = dom.sectionUA3, test3 = ""
		try {
			let sharednav = new SharedWorker("js/workershared_ua.js")
			el3.innerHTML = zF
			sharednav.port.addEventListener("message", function(e) {
				test3 = sha1((e.data).join())
				el3.innerHTML = test3 + (test3 == control ? match_green : match_red)
				if (test3 !== control) {
					update(e.data)
				}
			}, false)
			sharednav.port.start()
			sharednav.port.postMessage("hi")
		} catch(e) {
			el3.innerHTML = zF
		}

		// nested
		dom.sectionUA4.innerHTML = note_ttc
	}

	// service
	let el5 = dom.sectionUA5, test5 = ""
	if (isFile) {
		el5.innerHTML = zNA + note_file
	} else if (isSecure) {
		if ("serviceWorker" in navigator) {
			// assume failure
			el5.innerHTML = zF + " [A: assumed]"
			// register
			console.debug(performance.now(), "sw: client: about to register")
			navigator.serviceWorker.register("js/workerservice_ua.js").then(function(swr) {

				// debug
				let sw
				if (swr.installing) {sw = swr.installing}
				else if (swr.waiting) {sw = swr.waiting}
				else if (swr.active) {sw = swr.active}
				sw.addEventListener("statechange", function(e) {
					console.debug(performance.now(), "sw: client sees state " + e.target.state)
					if (e.target.state == "activated") {
						console.debug(performance.now(), "sw: client about to send message")
						sw.postMessage("hi")
						console.debug(performance.now(), "sw: client message sent")
					}
				})

				if (sw) {
					// listen
					console.debug(performance.now(), "sw: client about to set up broadcast channel")
					let channel = new BroadcastChannel("sw-ua")
					console.debug(performance.now(), "sw: client broadcast channel set, now listening")
					channel.addEventListener("message", event => {
						console.debug(performance.now(), "sw: client recieved message from sw")
						test5 = sha1((event.data.msg).join())
						el5.innerHTML = test5 + (test5 == control ? match_green : match_red)
						// unregister
						swr.unregister().then(function(boolean) {})
						console.debug(performance.now(), "sw: client unregisters sw")
						// close
						channel.close()
						console.debug(performance.now(), "sw: client closes channel")
					})
				} else {
					el5.innerHTML = zF + " [B: not swr.installing]"
				}
			},
			function(e) {
				el5.innerHTML = zF + " [C: not registering]: "  + e.message
			})
		} else {
			el5.innerHTML = zF + " [D: no sw]"
		}
	}
}

function get_version() {
	let go = true,
		verNo = "",
		test = "",
		isNew = false,
		t0 = performance.now()
	function output(){
		// set isVer
		if (isVer == "") {isVer = verNo.replace(/\D/g,'')}
		dom.versionNo.innerHTML = verNo + (isNew ? zNEW : "") + (runS ? zSIM : "")
		store_data("ua","3 ver",verNo)
		if (logPerf) {debug_log("version [ua]",t0)}
	}
	// use isErr
	if (isErr == "X") { verNo = "59 or lower"
	} else if (isErr == "e09e") { v67minus()
	} else if (isErr == "9be3") { v69minus()
	} else if (isErr == "1492") { verNo = "70"
	} else if (isErr == "7121") { verNo = "71"
	// 74+: 1259822: pref alters err2: now 2 outcomes per bucket
	// javascript.options.property_error_message_fix
	} else if (isErr == "fa8e" || isErr == "fb19") { v74minus()
	} else if (isErr == "214f" || isErr == "5186") { v75plus()
	} else if (isErr == "0dc5" || isErr == "b75b") { v75plus() // nightly
	} else {
		// new
		isNew = true
		//75: 1615600
		// we only care about 75+ but catch 68+/67- for runS+runUA
		// we still get a new error hash notation for good measure
		try {
			let test = BigInt(2.5)
		} catch(e) {
			let str = e.message.substring(0,3)
			if (str == "2.5") {
				v75plus()
			} else if (str == "can") {
				verNo = "68+"
			} else {
				v67minus()
			}
		}
	}
	// run
	function v75plus() {
		//78: 1633836
		if (go) {
			try {
				test = new Intl.NumberFormat(undefined, {style: "unit", unit: "percent"}).format(1/2)
				verNo = "78+"; go = false
			} catch(e) {}
		}
		//77: 1627285
		if (go) {if (isNaN(new DOMRect(0, 0, NaN, NaN).top)) {verNo = "77"; go = false}}
		//76: 1608010
		if (go) {if (test76.validity.rangeOverflow) {} else {verNo = "76"; go = false}}
		if (go) {verNo = "75"}
		// current nghtly only sigs
		verNo += ((isErr == "0dc5" || isErr == "b75b") ? " [Nightly]": "")
	}
	function v74minus () {
		//74:1605835
		if (go) {try {eval("let t = ({ 1n: 1 })"); verNo = "74"; go = false;} catch(e) {}}
		//73:1594241
		if (go) {
			test = dom.test73.sheet.cssRules[0]
			if (test.style.border == "") {verNo = "73"} else {verNo = "72"}
		}
	}
	function v69minus() {
		//69:1558387
		if (go) {try {test = new DOMError('a'); verNo = "68"} catch(e) {verNo = "69"}}
	}
	function v67minus() {
		//67:1531830
		if (go) {if (!Symbol.hasOwnProperty('matchAll')) {} else {verNo="67"; go = false}}
		//66
		if (go) {
			try {
				let txt = new TextEncoder(), utf8 = new Uint8Array(1)
				test = txt.encodeInto("a", utf8)
				verNo="66"; go = false
			} catch(e) {}
		}
		//65
		if (go) {
			try {
				test = new Intl.RelativeTimeFormat("en",{style:"long"}); verNo="65"; go = false
			} catch(e) {}
		}
		//64
		if (go) {if (window.screenLeft == undefined){} else {verNo="64"; go = false}}
		//63
		if (go) {if (Symbol.for(`a`).description == "a") {verNo="63"; go = false}}
		//62
		if (go) {
			console.time("v62")
			try {console.timeLog("v62"); verNo="62"; go = false} catch(e) {}
			console.timeEnd("v62")
		}
		//61
		if (go) {try {test = (" a").trimStart(); verNo="61"; go = false} catch(e) {}}
		//60: TB+test73 (windows, not linux, NFI mac), FF doesn't
		if (go) {
			try {
				test = dom.test73.sheet.cssRules[0]
				if (test.style.border == "") {
					isTB = true; debug_page("tb"," version 73 test = successful")
					verNo= "60 [Tor Browser]"; go = false
				}
			} catch(e) {}
		}
		//60
		if (go) {verNo="60" + (isNew ? " or lower": "")}
	}
	output()
}

function get_viewport(runtype) {
	let e=document.createElement("div")
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;"
	document.documentElement.insertBefore(e,document.documentElement.firstChild)
	let vw=e.offsetWidth,
		vh=e.offsetHeight
	document.documentElement.removeChild(e)
	dom.Viewport = vw+" x "+vh

	if (logExtra) {console.log("B [must follow zoom]: ", runtype, ": viewport")}

	// get viewport height once on first load
	// this s/be with toolbar visible (not FS)
	if (avh == "") {avh = vh}
	// return
	if (runtype == "ua") {
		return vw // scrollbar
	} else {
		return vh // android tests
	}
}

function get_widgets() {
	let list = ['button','checkbox','color','combobox','datetime-local','radio','text'],
		font = "",
		font0 = "",
		fontdiff = false,
		size = "",
		size0 = "",
		sizediff = false,
		output = "",
		os = "",
		hash = [],
		combined = [],
		t0 = performance.now()

	// loop elements
	for (let i=0; i < 9; i++) {
		let el = document.getElementById("widget"+i)
		font = getComputedStyle(el).getPropertyValue("font-family")
		size = getComputedStyle(el).getPropertyValue("font-size")
		if (runS) {
			if (i == 1) {font = "-apple-system"; size="11px"} // font + size
			//if (i == 4) {font = "-apple-system"} // font
			//if (i == 2) {size="13px"} // size
		}
		output = font+", "+size
		// 1-7: compare to 1
		if (i < 7) {
			combined.push(list[i].padStart(14) + ": "+output)
			if (i == 0) {size0 = size; font0 = font}
			if (i > 0) {if (size !== size0) {sizediff = true}}
			if (i > 0) {if (font !== font0) {fontdiff = true}}
		}
		// all
		document.getElementById("wid"+i).innerHTML = output
		hash.push(output)
	}

	// output
	if (fontdiff + sizediff > 0) {
		// combined
		dom.widfirst.innerHTML = "various"
		dom.wid0.innerHTML = combined.join("<br>")
		dom.wid0.style.fontFamily = "monospace, monospace"
	} else {
		// individual
		dom.widfirst.innerHTML = list.join("|")
		dom.wid0.style.fontFamily = ""
	}
	// os
	if (sizediff) {size0 = "mixed sizes"}
	if (fontdiff) {
		font0 = "mixed fonts";
		os = not_seen+" mix before"+sc
	} else {
			// set isOS
			if (font0.slice(0,12) == "MS Shell Dlg") {os="Windows"}
			else if (font0 == "Roboto") {os="Android"}
			else if (font0 == "-apple-system") {os="Mac"}
			else {os="Linux"}
			isOS = os.toLowerCase()
	}
	os += " ["+font0+", "+size0+"]"

	// output
	dom.widgetH = sha1(hash.join()) + (runS ? zSIM : "")
	dom.widgetOS.innerHTML = os + (runS ? zSIM : "")
	store_data("ua","4 wid",sha1(hash.join()))
	if (logPerf) {debug_log("widgets [ua]",t0)}
}

function get_zoom(runtype) {
	let t0 = performance.now()

	// devicePixelRatio
	let dpr = window.devicePixelRatio || 1;
	let dprStr = (dpr == 1 ? "1"+rfp_green : dpr+rfp_red)
	// add extra dpr: 477157
	if (isFF) {
		let element = document.getElementById("dprdroid")
		let dpr2 = getComputedStyle(element).borderTopWidth
		dpr2 = dpr2.slice(0, -2) // trim "px"
		if (dpr2 > 0) {
			dpr2 = (1/dpr2)
			if (dpr2 != 1 ) {dprStr += " | "+dpr2+rfp_red}
		}
	}
	dom.dpr.innerHTML = dprStr

	// dpi
	// ToDo: when zooming, getting divDPI is much slower
	// divDPI relies on css: if css is blocked (dpi_y = 0) this causes issues
	let t1 = performance.now()
	varDPI = return_mm_dpi("dpi")
	dom.mmDPI = varDPI+" | "+return_mm_dpi("dppx")+" | "+return_mm_dpi("dpcm")
	dpi_x = Math.round(dom.divDPI.offsetWidth * dpr)
	dpi_y = Math.round(dom.divDPI.offsetHeight * dpr)
	dom.jsDPI = dpi_x
	if (logPerf) {debug_log("dpi [part of zoom]",t1,"ignore")}

	// zoom: chose method
	if (dpr !== 1 || dpi_y == 0) {
		// use devicePixelRatio if we know RFP is off
		// or if css is blocked (dpi_y = 0, dpi_x = body width)
		jsZoom = Math.round(dpr*100).toString()
	} else {
		// otherwise it could be spoofed
		jsZoom = Math.round((varDPI/dpi_x)*100).toString()
	}

	// ToDo: zoom: css=blocked (dpi_y == 0) AND RFP=true: detect this state
	// Can't guarantee zoom: notate output for zoom, css line height, scollbar width

	// fixup some numbers
	if (jsZoom !== 100) {
		if (jsZoom == 79) {jsZoom=80}
		if (jsZoom == 92) {jsZoom=90}
		if (jsZoom == 109) {jsZoom=110}
		if (jsZoom == 111) {jsZoom=110}
		if (jsZoom == 121) {jsZoom=120}
		if (jsZoom == 131) {jsZoom=133}
		if (jsZoom == 167) {jsZoom=170}
		if (jsZoom == 171) {jsZoom=170}
		if (jsZoom == 172) {jsZoom=170}
		if (jsZoom == 241) {jsZoom=240}
		if (jsZoom == 250) {jsZoom=240}
	}
	if (logExtra) {console.log("A [ must come first]: ", runtype, ": zoom, dpi, devicePixelRatio")}
	dom.jsZoom = jsZoom
	if (runtype !== "resize" && logPerf) {debug_log("zoom ["+runtype+ "]",t0)}
	return jsZoom
}

/* OS SPECIFIC */

function run_os() {
	if (isOS == "android") {
		showhide("table-row","OS1","")
		dom.droidWin = firstW+" x "+firstH+" [inner] [toolbar visible]"
		// listen for toolbar
		get_android_tbh()
		// rerun screen: droid can be a little slow
		if (window.innerWidth == firstW) {
			setTimeout(function(){get_screen_metrics()}, 100)
		}
	} else {
		// desktop
		window.addEventListener("resize", get_screen_metrics)
	}
}

function get_android_tbh() {
	// toolbar height if user has chosen to "hide the toolbar when scrolling down a page"
	// avh global var s/be with toolbar visible: hence use new value > avh
	// We only need one diff since the viewport size "snaps" to the new value
	window.addEventListener('scroll', toolbarScroll)
	function toolbarScroll() {
		// ignore fullscreen
		if (window.fullScreen == false) {
			// delay: allow time for toolbar change
			setTimeout(function() {
				let vh_new = get_viewport()
				if (vh_new > avh) {
					dom.tbh = (vh_new - avh)
				}
			}, 800)
		}
	}
}

function get_android_kbh() {
	if (isOS == "android") {
		// wait for keyboard
		setTimeout(function() {
			// use viewport: doesn't change on zoom
			let vh_new = get_viewport()
			// Compare to avh (captured on first load: s/be with toolbar visible)
			// Since the event exits FS, we can rely on avh
			// use absolute value: event also triggered losing focus
			dom.kbh = Math.abs(avh - vh_new)
			// ToDo: keyboard height: use setInterval
			// keyboard can be slow to open + it "slides" (stepped changes)
			// instead check x times + return the max abs diff
		}, 1000)
	}
}

/* USER TESTS */

function goFS() {
	if (isFF) {
		let ih1 = window.innerHeight,
			delay = 1
		function exitFS() {
			if (isVer > 63) {document.exitFullscreen()} else {document.mozCancelFullScreen()}
			document.removeEventListener("mozfullscreenchange", getFS)
		}
		function getFS() {
			if ( document.mozFullScreen ) {
				setTimeout(function(){
					let iw = document.mozFullScreenElement.clientWidth,
						ih = document.mozFullScreenElement.clientHeight
					dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+iw+" x "+ih+" [mozFullScreenElement client]"
					exitFS()
					// TB desktop warning panel
					if (isTB == true && isOS !== "android") {
						setTimeout(function(){
						let ih2 = window.innerHeight
							let panel = ih1-ih2
							if (panel !== 0) {
								dom.fsLeak.innerHTML = dom.fsLeak.textContent+"<br>"+panel+"px [warning panel height]"
							}
						}, 600)
					}
				}, delay)
			}
		}
		if (document.mozFullScreenEnabled) {
			let element = dom.imageFS
			if (isOS == "android") {delay = 1000}
			element.mozRequestFullScreen()
			document.addEventListener("mozfullscreenchange", getFS)
		}
	}
}

function goNW() {
	dom.newWinLeak = "&nbsp"
	let sizesi = [], // inner history
		sizeso = [], // outer history
		n = 1, // setInterval counter
		newWinLeak = "",
		strError = ""

	// open
	let newWin = window.open("newwin.html","","width=9000,height=9000")
	let iw = newWin.innerWidth,
		ih = newWin.innerHeight,
		ow = newWin.outerWidth,
		oh = newWin.outerHeight
	sizesi.push(iw+" x "+ih)
	sizeso.push(ow+" x "+oh)
	// default output
	newWinLeak = iw+" x "+ih+" [inner] "+ow+" x "+oh+" [outer]"

	function output_newwin(output){
		dom.newWinLeak.innerHTML = output
	}

	// DESKTOP
	if (isOS !== "android") {

		function check_newwin() {
			let diffsi = [], // 4 inner sizes
				diffso = [], // 4 outer sizes
				changesi = 0,
				changeso = 0

			// step1: detect changes
			let prev = sizesi[0]
			let strInner = s1+"inner: "+sc+iw+" x "+ih
			for (let k=0; k < sizesi.length; k++) {
				if (sizesi[k] !== prev ) {
					changesi++;	strInner += s1+" &#9654 <b>["+k+"]</b> "+sc+sizesi[k]
				}
				prev = sizesi[k]
			};
			prev = sizeso[0]
			let strOuter = s1+"outer: "+sc+ow+" x "+oh
			for (let k=0; k < sizeso.length; k++) {
				if (sizeso[k] !== prev ) {
					changeso++;	strOuter += s1+" &#9654 <b>["+k+"]</b> "+sc+sizeso[k]
				}
				prev = sizeso[k]
			}
			// one or two lines
			if (changesi > 0 || changeso > 0) {
				newWinLeak = strInner+"<br>"+strOuter
			}
			// append file:/// error debug
			if (strError !== "") {newWinLeak = newWinLeak+"<br>"+strError}
			// output
			output_newwin(newWinLeak)
		}

		function build_newwin() {
			// check n times as "fast" as we can/dare
			if (n == 150) {
				clearInterval(checking)
				check_newwin()
			} else {
				// grab metrics
				try {
					sizesi.push(newWin.innerWidth+" x "+newWin.innerHeight)
					sizeso.push(newWin.outerWidth+" x "+newWin.outerHeight)
				} catch(e) {
					clearInterval(checking)
					// if not "permission denied", eventually we always get
					// NS_ERROR_UNEXPECTED which we can ignore. Always output
					check_newwin()
				}
			}
			n++
		}
		let checking = setInterval(build_newwin, 3)

	}

	// ANDROID
	if (isOS == "android") {
		if (ih > firstH) {
			// firstH s/be with the toolbar
			newWinLeak = iw+" x "+ih+" [inner] [toolbar hidden] "+ow+" x "+oh+" [outer]"
		} else if (ih == firstH) {
			// should be the same
			newWinLeak = iw+" x "+ih+" [inner] [toolbar visible] "+ow+" x "+oh+" [outer]"
		}
		output_newwin(newWinLeak)
	}

}

function goNW_UA() {
	let list = ['userAgent','appCodeName','appName','product','appVersion',
		'oscpu','platform','buildID','productSub','vendor','vendorSub'],
		res = []
	dom.sectionUA8.innerHTML = "&nbsp"
	// open, get results, close
	let newWin = window.open()
	let navigator = newWin.navigator
	for(let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = zU}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	newWin.close()
	// hash
	res.sort()
	let hash = sha1(res.join())
	let hash2 = (dom.sectionUA1.textContent).substring(0,40)
	// output
	dom.sectionUA8.innerHTML = hash + (hash == hash2 ? match_green : match_red)
}

/* OUTPUT */

function outputScreen(runtype) {
	let t0 = performance.now()
	// do these once
	get_color()
	get_pbmode()
	get_fullscreen()
	get_screen_metrics(runtype) // calls the rest, also used on resize
	// perf
	debug_page("perf","screen",t0,gt0)
}

function outputMath() {
	let t0 = performance.now()
	// 1= ecma1, 6= ecma6, c= combined
	let m1hash = "",
		m6hash = "",
		mchash = "",
		m1 = "", // short codes
		m6 = "",
		mc = "",
		fdMath1 = "", // strings for browser/os
		fdMath6 = "",
		strNew = zNEW + (runS ? zSIM : "")

	function get_hashes() {
		let h1 = "", h6 = "", r = ""
		// 1st
		let list = ['1e251','1e140','1e12','1e130','1e272','1e0','1e284','1e75'],
			res = []
		for (let i=0; i < list.length; i++) {
			r = Math.cos(list[i])
			res.push(r)
			document.getElementById("cos"+i).innerHTML = r
		}
		h1 = res.join("-")
		// 6th
		let x, y;
		x = 0.5; r = Math.log((1 + x) / (1 - x)) / 2 // atanh(0.5)
		dom.math1 = r; h6 = r
		x=1; r = Math.exp(x) - 1 // expm1(1)
		dom.math2 = r; h6 += "-"+r
		x = 1; y = Math.exp(x); r = (y - 1 / y) / 2 // sinh(1)
		dom.math3 = r; h6 += "-"+r
		// hashes
		m1hash = sha1(h1)
		m6hash = sha1(h6)
		mchash = sha1(h1+"-"+h6)
		// sim
		if (runS) {
			//m1hash = sha1("a"), mchash = sha1("b") // emca1
			//m6hash = sha1("c"), mchash = sha1("d") // emca6
			m1hash = sha1("e"), m6hash = sha1("f"), mchash = sha1("g") // both
		}
		store_data("ua","5 mth",mchash)
	}

	function get_codes() {
		// known FF hashes (browser)
		if (m6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {m6="1"}
		else if (m6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {m6="2"}
		else if (m6hash == "9251136865b8509cc22f8773503288d106104634") {m6="3"} // 68+ exmp1(1) 1380031
		// known FF hashes (os)
		if (m1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {m1="A"}
		else if (m1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {m1="B"}
		else if (m1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {m1="C"}
		else if (m1hash == "96895e004b623552b9543dcdc030640d1b108816") {m1="D"}
		else if (m1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {m1="E"}
		else if (m1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {m1="F"}
		else if (m1hash == "19df0b54c852f35f011187087bd3a0dce12b4071") {m1="G"}
		else if (m1hash == "8ee641f01271d500e5c1d40e831232214c0bbbdc") {m1="H"}
		mc = m6+m1
	}

	function build_output() {
		// browser
		if (m6 == "1" | m6 == "3") {
			fdMath6=zFF
		} else if (m6 == "2") {
			fdMath6=zFF+" [32-bit]"
		}
		// os, refine browser
		if (m1 == "A" | m1 == "H") {
			// A or H: always 64bit WIN on 64bit FF
			fdMath1="Windows [64-bit]"
			fdMath6=zFF+" [64-bit]"
		} else if (m1 == "C") {
			// C: always 32bit FF on WIN (32bit or 64bit)
			fdMath1="Windows"
			fdMath6=zFF+" [32-bit]"
		} else if (m1 == "D") {
			// D: always Linux (Mint, Debian, OpenSUSE)
			fdMath1="Linux"
			if (m6 == "1") {
				// 60-67: 1D : always 64bit Linux -> 64bit FF
				fdMath1="Linux [64-bit]"
				fdMath6=zFF+" [64-bit]"
			}	else if (m6 == "3") {
				// 68+: 3D : can be FF64bit or TB32/64bit
				// values already set
			}	else if (m6 == "2") {
				// D2: always 32bit Linux (32bit FF set earlier)
				fdMath1="Linux [32-bit]"
			}
		} else if (m1 == "G") {
			// G: always Linux (Ubuntu)
			fdMath1="Linux"
		} else if (m1 == "E") {
			// E: always Mac: and thus 64bit FF
			fdMath1="Mac"
			fdMath6=zFF+" [64-bit]"
		} else if (m1 == "F") {
			// F: always Android
			fdMath1="Android"
		} else if (m1 == "B") {
			// B: always TB on WIN
			fdMath1="Windows"
			isTB = true; debug_page("tb","math 1st edition = letter B")
			if (m6 == "1") {
				// ESR60: 1B: always 64bit TB: thus 64bit WIN
				fdMath6=zTB+" [64-bit]"
				fdMath1="Windows [64-bit]"
			} else if (m6 == "2") {
				// ESR60: 2B: always 32bit TB (but WIN can be 32bit or 64bit)
				fdMath6=zTB+" [32-bit]"
			} else if (m6 == "3") {
				// ESR68: 3B: 32bit TB on 32/64 WIN and 64bit TB on WIN64: now all the same
				fdMath6=zTB
			}
		}
	}

	function output() {
		if (isFF) {
			// new
			if (m1 == "") {m1hash += strNew} else {m1hash += s3+" ["+m1+"]"+sc}
			if (m6 == "") {m6hash += strNew} else {m6hash += s3+" ["+m6+"]"+sc}
			if (mc.length < 2) {mchash += strNew} else {mchash += s3+" ["+mc+"]"+sc}
			strNew = not_seen+" math combo before"+sc + (runS ? zSIM : "")
			// runS: alternate new vs os-check (runS sets isOS ="")
			if (runS) {if (stateSIM) {fdMath1 = "Windows"}}
			// os-check
			if (fdMath1 !== "") {
				let check = fdMath1.replace(" [32-bit]","")
				check = check.replace(" [64-bit]","")
				check = check.toLowerCase()
				if (isOS !== check) {fdMath1 += sb+"[!= widget]"+sc + zSIM}
			}
			// output
			dom.fdMathOS.innerHTML = (fdMath1 == "" ? strNew : fdMath1)
			dom.fdMath.innerHTML = (fdMath6 == "" ? strNew : fdMath6)
		}
		// output hashes
		dom.math1hash.innerHTML = m1hash
		dom.math6hash.innerHTML = m6hash
		dom.mathhash.innerHTML = mchash
		// perf
		debug_page("perf","math",t0,gt0)
	}

	get_hashes()
	get_codes()
	build_output()
	output()

}

function outputUA(runtype) {
	let t0 = performance.now()
	fp_ua = []
	// start
	get_errors() // isFF (2nd check)
	// FF only
	if (isFF) {
		get_widgets() // isOS
		get_version() // isVer
		get_chrome() // isTB*
		get_resources() // isTB
		get_line_scrollbar() // calls zoom & viewport
	} else {
		// non-FF hide
		let items = document.getElementsByClassName("group")
		for(let i=0; i < items.length; i++) {
			items[i].style.display = "none"
		}
		// non-FF needs these
		if (runtype == "load") {
			get_zoom("load")
			get_viewport("load")
		}
	}
	// all
	get_collation()
	get_ua_nav()
	stateSIM = !stateSIM
	// perf
	debug_page("perf","ua",t0,gt0)
}

function outputStart() {
	// perf
	gt0 = performance.now()
	// not-coded
	let items = document.getElementsByClassName("faint")
	for(let i=0; i < items.length; i++) {	items[i].textContent = "not coded yet"}	
	// run once
	dom.debugperf = "       start:    screen.js loaded"
	if ((location.protocol) == "file:") {isFile = true; note_file = sn+"[file:]"+sc}
	if ((location.protocol) == "https:") {isSecure = true}
	if ("undefined" != typeof InstallTrigger) {isFF = true}
	// sim = FF only
	if (isFF == false) {runS = false}
	// run UA first: checks isFF; sets isOS, isTB*, isVer
	outputUA("load")
	outputMath()
	outputScreen("load")
	// per os tweaks
	run_os()
}

outputStart()
