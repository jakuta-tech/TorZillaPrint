/* TABLES: Screen, User Agent, Math */
'use strict';

var jsZoom, varDPI, dpi_x, dpi_y;

/* FUNCTIONS */

function count_decimals(value) {
	if(Math.floor(value) === value) return 0
	return value.toString().split(".")[1].length || 0
}

function return_lb_nw(w,h) {
	// LB
	let wstep = 200, hstep = 200, bw = false, bh = false
	if (w < 501) {wstep = 50} else if (w < 1601) {wstep = 100}
	if (h < 501) {hstep = 50} else if (h < 1601) {hstep = 100}
	bw = Number.isInteger(w/wstep)
	bh = Number.isInteger(h/hstep)
	let r = ((bw && bh) ? lb_green : lb_red)
	// NW
	wstep = 200, hstep = 100, bw = false, bh = false
	if (w < 1001) {bw = Number.isInteger(w/wstep)}
	if (h < 1001) {bh = Number.isInteger(h/hstep)}
	r += ((bw && bh) ? nw_green : nw_red)
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
	// vars
	let c = "chrome://browser/content/extension-",
		p = "-panel.css",
		list = [c+'win'+p, c+'mac'+p],
		os = "Linux", // default
		x = 0,
		t0 = performance.now()

	// output
	function output(r) {
		if (runSim) {
			if (isOS == "windows") {r = "Linux"} else {r = "Windows"}
		}
		store_data("ua","1 chrome",r)
		// notation
		if (r.toLowerCase() !== isOS) {
			r += sb+"[doesn't match widget os]"+sc + (runSim ? zSIM : "")
		}
		dom.fdChromeOS.innerHTML = r
		if (logPerf) {debug_log("chrome [ua]",t0)}
	}

	// function
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
			}
			css.onerror = function() {x++}
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
		// linux
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
	// vars
	let list = ['ka','ku','lo','no','pa','tk'],
		chars = ['\u00F1','\u00E4','\u0109','\u0649','\u10D0','\u0E9A'],
		results = [],
		missing = [],
		t0 = performance.now()

	// output
	function output(hash) {
		let output = "",
			codes = "";
		if (missing.length > 0) {
			codes = " [missing locale code" + (missing.length > 1 ? "s" : "")
				+ ":" + missing.join(", ") + "]"
		}
		if (hash == "d0e83d1d652f95d686870a59def6ddcc7cde5e28") {
			output = zFF+" [FF70+]" + codes
		} else if (hash == "e4a32b021b6743d34573ab91a9a31d1068e5b01e") {
			output = zFF+" [FF65-69]" + codes
		} else if (hash == "78c0998f75b0da6b11dd55e2f29dc054e14aae9e") {
			output = zFF+" [FF64 or lower]" + codes
		} else if (isFF) {
			output = not_seen+"collation combo before"+sc + codes + (runSim ? zSIM : "")
		}
		dom.fdCollation.innerHTML = output
		store_data("ua","2 collation",hash)
		if (logPerf) {debug_log("collation [ua]",t0)}
	}
	// function
	function run() {
		let control = chars.sort(Intl.Collator("en-US").compare)
		control = sha1(control.join())
		for (let i=0; i < list.length; i++) {
			chars.sort(Intl.Collator(list[i]).compare)
			let test = sha1(chars.join())
			results.push(test)
			if (control == test) {missing.push("<code>" + list[i] + "</code>")}
		}
		output(sha1(results.join()) + (runSim ? "a" : ""))
	}
	run()
}

function get_color() {
	// depth
	let r = screen.pixelDepth+" | "+screen.colorDepth
	dom.ScrColor.innerHTML = r += (r == "24 | 24" ? rfp_green : rfp_red)
	store_data("screen","depth",r)
	// bits
	r = ""
	r = (function () {
		for (let i=0; i < 1000; i++) {
			if (matchMedia("(color:"+i+")").matches === true) {return i}
		}
		return i
	})()
	dom.mmC.innerHTML = (r == 8 ? r+rfp_green : r+rfp_red)
	store_data("screen","bits",r)
}

function get_errors() {
	// vars
	let hash = "",
		code = "",
		t0 = performance.now()
	// output
	function output(hash) {
		if (hash == "32e7cf958b5c1a791392fe7c70ed51474ec49e79") {	
			code = " [A]"
			isFF = true; dom.fdError = zFF + code
		} else if (hash == "80b2d392e535c16bfa06eeefa19e8e39647cf7bd") {
			code = " [B]"	
		isFF = true; dom.fdError = zFF + code
		} else if (isFF) {
			code = zNEW
			dom.errh.innerHTML = hash + code + (runSim ? zSIM : "")
			dom.fdError.innerHTML = not_seen+"error combo before"+sc + (runSim ? zSIM : "")
		}
		dom.errh.innerHTML = hash + code
		store_data("ua","3 errors",hash)
		if (logPerf) {debug_log("errors [ua]",t0)}
	}
	// function
	function run() {
		// range
		try {let foodate = new Date(), bar = new Date(foodate.endDate).toISOString()
		} catch(e) {dom.err1=e; hash += e}
		// ref
		try {foo=2} catch(e) {dom.err2=e; hash += e}
		// syntax
		try {eval("alert('Hello)")} catch(e) {dom.err3=e; hash += e}
		// type
		try {function foobar() {let foo = document.getElementById("bar"); foo.value = screen.width}
			window.onload = foobar()
		} catch(e) {dom.err4=e; hash += e}
		// type
		try {var bar = new Date(bar[0].endDate).toISOString()} catch(e) {dom.err5=e; hash += e}
		// uri
		try {decodeURIComponent("%")} catch(e) {dom.err6=e; hash += e}
		if (runSim) {hash +="a"}
		output(sha1(hash))
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
	store_data("screen","full screen support",r)
}

function get_line_scrollbar() {
	// vars
	let strW = "[Windows]",
		strWL = "[Windows or Linux]",
		strWM = "[Windows or Mac]",
		strWLM = "[Windows, Linux or Mac]",
		strL = "[Linux]",
		strLA = "[Linux or Android]",
		strLM = "[Linux or Mac]",
		strM = "[Mac]",
		strA = "[Android]",
		strTBL = " [Linux]"+tb_green,
		os = "",
		sbZoom = ""

	// scrollbar
	function run_scrollbar() {
		let t0 = performance.now()
		// recalculate zoom/viewport
		get_zoom("ua")
		let vw = get_viewport("ua")
		// grab width and remember it for later
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
				if (w==17) {os=strW}
				if (w==16) {os=strL}
				if (w==15) {os=strM}
				if (w==12) {os=strL}
			} else if (jsZoom == 300) {
				if (w==6) {os=strWL}
				if (w==5) {os=strWM}
				if (w==4) {os=strL}
			} else if (jsZoom == 240) {
				if (w==7) {os=strWM}
				if (w==6) {os=strL}
				if (w==5) {os=strL}
			} else if (jsZoom == 200) {
				if (w==9) {os=strW}
				if (w==8) {os=strWLM}
				if (w==7) {os=strM}
				if (w==6) {os=strL}
			} else if (jsZoom == 170) {
				if (w==10) {os=strWL}
				if (w==8) {os=strM}
				if (w==7) {os=strL}
			} else if (jsZoom == 150) {
				if (w==12) {os=strW}
				if (w==11) {os=strW}
				if (w==10) {os=strLM}
				if (w==8) {os=strL}
			} else if (jsZoom == 133) {
				if (w==13) {os=strW}
				if (w==12) {os=strWL}
				if (w==11) {os=strM}
				if (w==9) {os=strL}
			} else if (jsZoom == 120) {
				if (w==15) {os=strW}
				if (w==14) {os=strWL}
				if (w==12) {os=strM}
				if (w==10) {os=strL}
			} else if (jsZoom == 110) {
				if (w==16) {os=strW}
				if (w==15) {os=strW}
				if (w==14) {os=strLM}
				if (w==11) {os=strL}
			} else if (jsZoom == 90) {
				if (w==19) {os=strW}
				if (w==18) {os=strL}
				if (w==17) {os=strM}
				if (w==16) {os=strM}
				if (w==13) {os=strL}
			} else if (jsZoom == 80) {
				if (w==21) {os=strW}
				if (w==20) {os=strL}
				if (w==19) {os=strM}
				if (w==15) {os=strL}
			} else if (jsZoom == 67) {
				if (w==26) {os=strW}
				if (w==25) {os=strW}
				if (w==24) {os=strL}
				if (w==23) {os=strM}
				if (w==22) {os=strM}
				if (w==18) {os=strL}
			} else if (jsZoom == 50) {
				if (w==34) {os=strW}
				if (w==32) {os=strL}
				if (w==30) {os=strM}
				if (w==24) {os=strL}
			} else if (jsZoom == 30) {
				if (w==57) {os=strW}
				if (w==56) {os=strW}
				if (w==54) {os=strL}
				if (w==50) {os=strM}
				if (w==40) {os=strL}
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
				if (wZoom>=16.5) {
					os=strW // in testing = windows only
				} else {
					os=strL // guess linux (andoid s/be 0, mac s/be covered)
				}
				// guess
				os += " [logical guess]"
			}
		}
		// zoom notation
		if (jsZoom == 100) {} else {sbZoom=" at "+jsZoom+"% "}
		// output
		dom.vScroll = w+"px "+sbZoom+os
		// element scrollbar
		dom.eScroll = (100-dom.tScroll.scrollWidth)+"px"
		// perf
		if (logPerf) {debug_log("scrollbar [ua]",t0)}
	}

	// css lineheight
	function run_lineheight() {
		// vars
		let lhNormal = ""
		let	t0 = performance.now()
		os = ""
		// computedStyle
		let element = dom.spanLH,
			lh = getComputedStyle(element).getPropertyValue("line-height")
		// font
		let font = getComputedStyle(element).getPropertyValue("font-family"),
			fontname = font.slice(1,16)
		// clientrect
		if (lh == "normal") {
			element = dom.divLH
			let elDiv = element.getBoundingClientRect()
			lh = elDiv.height
			// trim decimals
			if (count_decimals(lh) > 4) {lh = lh.toFixed(4)}
			lh = lh.toString()
			lhNormal = so+"[clientrect]"+sc //+" normal"+so+"[getComputedStyle]"+sc
		}
		// trim "px"
		if (lh.substr(-2) == "px") {lh = lh.slice(0, -2)}
		// check font
		if (fontname !== "Times New Roman") {
			os = sb+" [document fonts are disabled]"+sc
		} else if (lh == "19.2") {
			// TB DESKTOP: 19.2px seems unique to TB any-zoom/any-platform
			os = tb_green
			isTB = true; debug_page("tb"," css line height = 19.2")
		} else {
			// using TNR and not TB's 19.2
			// WINDOWS / LINUX: some known metrics
			if (jsZoom == 100) {
				if (lh=="20") {os=strW}
				if (lh=="19") {os=strL}
				if (lh=="18") {os=strW}
				if (lh=="17") {os=strL}
			} else if (jsZoom == 300) {
				if (lh=="19") {os=strW}
				if (lh=="18.6667") {os=strW}
				if (lh=="18") {os=strL}
				if (lh=="17.6667") {os=strL}
			} else if (jsZoom == 240) {
				if (lh=="19.1667") {os=strW}
				if (lh=="19") {os=strTBL}
				if (lh=="18.3333") {os=strWL}
				if (lh=="17.5") {os=strL}
			} else if (jsZoom == 200) {
				if (lh=="19") {os=strW}
				if (lh=="18") {os=strL}
			} else if (jsZoom == 170) {
				if (lh=="19.25") {os=strW}
				if (lh=="18.9") {os=strTBL}
				if (lh=="18.6667") {os=strW}
				if (lh=="18.0833") {os=strL}
				if (lh=="17.5") {os=strL}
			} else if (jsZoom == 150) {
				if (lh=="20") {os=strW}
				if (lh=="18.6667") {os=strWL}
				if (lh=="17.3333") {os=strL}
			} else if (jsZoom == 133) {
				if (lh=="19.5") {os=strW}
				if (lh=="18.9") {os=strTBL}
				if (lh=="18") {os=strL}
				if (lh=="18.75") {os=strW}
			} else if (jsZoom == 120) {
				if (lh=="20") {os=strW}
				if (lh=="19.1667") {os=strL}
				if (lh=="19") {os=strTBL}
				if (lh=="18.3333") {os=strW}
				if (lh=="17.5") {os=strL}
			} else if (jsZoom == 110) {
				if (lh=="19.25") {os=strW}
				if (lh=="18.7") {os=strTBL}
				if (lh=="18.3333") {os=strL}
				if (lh=="17.4167") {os=strL}
			} else if (jsZoom == 90) {
				if (lh=="20.1") {os=strW}
				if (lh=="18.9833") {os=strWL}
				if (lh=="18.7667") {os=strTBL}
				if (lh=="16.75") {os=strL}
			} else if (jsZoom == 80) {
				if (lh=="20") {os=strW}
				if (lh=="19.5") {os=strTBL}
				if (lh=="18.75") {os=strWL}
			} else if (jsZoom == 67) {
				if (lh=="21") {os=strW}
				if (lh=="19.8") {os=strTBL}
				if (lh=="19.5") {os=strWL}
				if (lh=="18") {os=strL}
			} else if (jsZoom == 50) {
				if (lh=="22") {os=strW}
				if (lh=="20") {os=strWL}
				if (lh=="18") {os=strL}
			} else if (jsZoom == 30) {
				if (lh=="20") {os=strWL}
				if (lh=="26.6667") {os=strW}
			}
		}
		// MAC
		if (os == "") {
		/*	mac unique: .0167 .05 .0833 .1833 .35 .4333 .6833 .8333 .85
		mac not unique: .7667 .6667 (but unique at those zoom values)
		old hackernews: .5167 (can't repro) */
			let lhDec = (lh+"").split(".")[1]
			if (lhDec=="0167" | lhDec=="05" | lhDec=="0833" | lhDec=="1833" | lhDec=="35" | lhDec=="4333" | lhDec=="6833"
				| lhDec=="8333" | lhDec=="85" | lhDec=="7667" | lhDec=="6667" | lhDec=="5167") {os=strM}
		}
		// ANDROID
		if (os == "") {
			// ToDo: css line height: Android affected by devicePixelRatio
		}
		if (os == "") {
			// guess
			os = strLA+" [logical guess]"
		} else {
			if (font.slice(1,16) == "Times New Roman") {
				// known
				os += " [known metric]"
			}
		}
		// output
		dom.cssLH.innerHTML = lh + "px "+ sbZoom + os + lhNormal
		// perf
		if (logPerf) {debug_log("css line height [ua]",t0)}
	}

	run_scrollbar();
	run_lineheight();

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
		// -moz-
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
		// -webkit-
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

function get_private_win() {
	let t0 = performance.now()
	function output(r) {
		dom.IsPBMode = r
		store_data("screen","private window",r)
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
		output = "",
		nob = "[no branding detected]",
		el = dom.branding

	// load about:logo
	let imgA = new Image()
	imgA.src = "about:logo"
	imgA.style.visibility = "hidden"
	document.body.appendChild(imgA)
	imgA.addEventListener("load", function() {
		browser = zFF
		if (imgA.width == 300) {
			// desktop = 300x236: change to icon64
			dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')"
		} else {
			// android = 258x99: change to favicon64 (which gives us tor's icon)
			dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/favicon64.png')"
		}
		if (imgA.width > 0) {
			// brand: get after logo loaded by js: allows time for
			// the two branding images (set by html) to be loaded
			let wFF = el.width, hFF = el.height
			el = dom.torbranding
			let wTB = el.width, hTB = el.height

			if (runSim) {
				wFF = 110, hFF = 50 // new FF
				//wFF = 336, hFF = 48 // new TB but not new FF
				// to simulate missing, change html img src
			}

			// improve entropy
			if (wFF == 336 && hFF == 48) {
				// 70+ stable/beta
				branding = "Browser"
				channel = "Release/Beta"
				output = branding +" - "+channel+" ["+wFF+" x "+hFF+"]"
			} else if (wFF == 336 && hFF == 64) {
				// 70+ dev/nightly
				branding = "Browser"
				channel = "Developer/Nightly"
				output = branding +" - "+channel+" ["+wFF+" x "+hFF+"]"
			} else if (wFF == 300 && hFF == 38) {
				// 60-69 stable/beta and ESR60/68
				branding = "Quantum"
				channel = "Release/Beta"
				output = branding +" - "+channel+" ["+wFF+" x "+hFF+"]"
			} else if (wFF == 132 && hFF == 62) {
				// 60-69 dev
				channel = "Developer Edition"
				output = branding +" - "+channel+" ["+wFF+" x "+hFF+"]"
			} else if (wFF == 270 && hFF == 48) {
				// 60-69 nightly
				channel = "Nightly"
				output = branding +" - "+channel+" ["+wFF+" x "+hFF+"]"
			} else if (hFF > 0) {
				// new
				output = "["+wFF+" x "+hFF+"]" + not_seen+"branding before"+sc + (runSim ? zSIM : "")
			} else {
				// missing: android/orange, desktop/red
				if (isOS == "android") {output = so+nob+sc} else {output = sb+nob+sc}
			}

			// refine TB
			if (wTB > 0) {
				browser = zTB
				channel = "" // reset
				isTB = true; debug_page("tb","     resource:// = tor-watermark.png")
				if (wFF == 270 && hFF == 48) {
					// 2019+: 8.5a7+, 9.0a1+, 9.5a1+ = all ESR68+
					channel = "alpha"
					output = so+"["+channel+"]"+sc+" ["+wFF+" x "+hFF+"]"
					debug_page("tb","    css branding = 270 x 48 px = alpha")
				} else if (wFF == 300 && hFF == 38) {
					// 
					if (isVer > 67) {
						channel = "stable"
						output = so+"["+channel+"]"+sc+" ["+wFF+" x "+hFF+"]"
					} else {
						output = " ["+wFF+" x "+hFF+"]"
					}
				} else {
					if (isTB) {
						// new to TB but not FF
						output = "["+wFF+" x "+hFF+"]" + not_seen_tb+"branding before]"+sc
					} else {
						// new
						output = "["+wFF+" x "+hFF+"]" + not_seen+"branding before"+sc
					}
				}
			} else {
				// missing on desktop
				if (isTB && isOS !== "android") {
						output += sb+"[missing tor-watermark.png]"+sc
				}
			}
			// output
			dom.fdResource.innerHTML = browser + " " + output
			store_data("ua","4 browser",browser)
			store_data("ua","5 channel",wFF+"x"+hFF)
			// perf
			if (logPerf) {debug_log("resource [ua]",t0)}
		}
	})
	document.body.removeChild(imgA)
}

function get_screen_metrics(runtype) {
	let t0 = performance.now()

	// window/screen
	let s1 = screen.width, s2 = screen.height,
		s3 = screen.availWidth, s4 = screen.availHeight,
		s5 = window.outerWidth, s6 = window.outerHeight,
		w = window.innerWidth, h = window.innerHeight,
		p1 = screen.left, p2 = screen.top,
		p3 = screen.availLeft, p4 = screen.availTop,
		p5 = window.screenX, p6 = window.screenY,
		p7 = window.mozInnerScreenX, p8 = window.mozInnerScreenY

	dom.ScrRes = s1+" x "+s2+" ("+p1+","+p2+")"
	dom.ScrAvail = s3+" x "+s4+" ("+p3+","+p4+")"
	dom.WndOut = s5+" x "+s6+" ("+p5+","+p6+")"

	// RFP notation
	if (isFF) {
		// all four sets = same
		let bolW = true, strW = ""
		if (s1+"x"+s2 !== s3+"x"+s4) {bolW = false}
		else if (s3+"x"+s4 !== s5+"x"+s6) {bolW = false}
		else if (s5+"x"+s6 !== w+"x"+h) {bolW = false}
		if (bolW) {
			strW = sg+"* [matching sizes]"+sc
		} else {
			strW = sb+"* [matching sizes]"+sc
		}
		dom.match1.innerHTML = strW
		// all coordinates = 0
		let bolP = false
		let strP = sb+"* [coordinates 0,0]"+sc
		if ( p1+p2+p3+p4+p5+p6+p7+p8 == 0) {
			strP = sg+"* [coordinates 0,0]"+sc
			bolP = true
		}
		dom.match2.innerHTML = strP
		// unhide/color asterisks
		let color = "#ff4f4f" //red
		if (bolP && bolW) {color = "#8cdc8c"}
		let items = document.getElementsByClassName("group")
		for(let i=0; i < items.length; i++) {
			items[i].style.color = color
		}
	}

	// update zoom & viewport except on load
	if (runtype !== "load") {
		get_zoom("resize")
		get_viewport("resize")
	}

	// inner
	let strTemp = w+" x "+h+" ("+p7+","+p8+")"
	if (isOS == "android") {
		dom.WndIn = strTemp
	} else {
		// LB+NW notation
		if (isFF == true) {
			if (jsZoom == 100) {
				strTemp += return_lb_nw(w,h)
			} else {
				strTemp += lb_orange
			}
		}
		dom.WndIn.innerHTML = strTemp
		if (logExtra) {console.log("C done [must follow zoom]: ", runtype, ": screen_metrics")}
	}

	// the rest
	get_mm_metrics(runtype)
	get_orientation(runtype)
	dom.fsState = window.fullScreen
	if (logExtra) {console.log("D done [must follow zoom]: ", runtype, ": mm_metrics, mm_drp, orientation, fullscreen")}
}

function get_ua_nav() {
	dom.nCodeName.innerHTML = navigator.appCodeName
	dom.nAppName.innerHTML = navigator.appName
	dom.nProduct.innerHTML = navigator.product
	dom.nBuildID.innerHTML = navigator.buildID
	dom.nProductSub.innerHTML = navigator.productSub
	dom.nPlatform.innerHTML = navigator.platform
	dom.nAppVersion.innerHTML = navigator.appVersion
	dom.nOscpu.innerHTML = navigator.oscpu
	dom.nUserAgent.innerHTML = navigator.userAgent
}

function get_version() {
	let go = true,
		verNo = "",
		test = "",
		t0 = performance.now()

	//75: 1614329
	if (go) {
		let el75 = document.getElementById("test75")
		test = window.getComputedStyle(el75, null).getPropertyValue("background-color")
		if (test !== "rgb(0, 128, 0)") { verNo= "75+"; go = false}
	}
	//74: 1605835
	if (go) {
		try {
			eval("let test74 = ({ 1n: 1 })")
			verNo = "74"; go = false;
		} catch(e) {}
	}
	//73: 1594241
	if (go) {
		try {
			test = dom.test73.sheet.cssRules[0]
			if (test.style.border == "") {verNo= "73"; go = false}
			// breaks TB ESR60: so if can't pass e.g. test 69, then it's not really 73
			try {let torcheck = new DOMError('name'); go = true} catch(e) {}
		} catch(e) {}
	}
	//72: 1589072
	if (go) {
		try {
			test = eval('let a = 100_00_;')
		} catch(e) {
			if (e.message.substring(0,6) == "unders" ) { verNo="72"; go = false}
		}
	}
	//71: 1565991
	if (go) {
		try {
			document.createElement("canvas").getContext("2d").createPattern(new Image(), "no-repeat")
			verNo="71"; go = false
		} catch(e) {}
	}
	//70: 1541861
	if (go) {
		try {
			let el = document.createElement('style')
			document.head.appendChild(el)
			el.sheet.deleteRule(0)
		} catch(e) {
			if (e.message.substring(0,6) == "Cannot") { verNo="70"; go = false}
		}
	}
	//69
	if (go) {
		try {test = new DOMError('name')} catch(e) { verNo="69"; go = false}
	}
	//68
	if (go) {
		let test = dom.test68
		if (test.typeMustMatch == false) {} else { verNo="68"; go = false}
	}
	//67
	if (go) {
		if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67"; go = false}
	}
	//66
	if (go) {
		try {
			let test = "66 test"
			const textEncoder = new TextEncoder()
			const utf8 = new Uint8Array(test.length)
			let encodedResults = textEncoder.encodeInto(test, utf8)
			verNo="66"; go = false
		} catch(e) {}
	}
	//65
	if (go) {
		try {
			test = new Intl.RelativeTimeFormat("en",{style: "long"})
			verNo="65"; go = false
		} catch(e) {}
	}
	//64
	if (go) {
		if (window.screenLeft == undefined){} else { verNo="64"; go = false}
	}
	//63
	if (go) {
		if (Symbol.for(`foo`).description == "foo"){ verNo="63"; go = false}
	}
	//62
	if (go) {
		console.time("ver62")
		try {console.timeLog("ver62"); verNo="62"; go = false} catch(e) {}
		console.timeEnd("ver62")
	}
	//61
	if (go) {
		test = " meh"
		try {test = test.trimStart(); verNo="61"; go = false} catch(e) {}
	}
	//60
	if (go) {
		try {(Object.getOwnPropertyDescriptor(Document.prototype, "body")
			|| Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "body")).get.call((new DOMParser).parseFromString(
				"<html xmlns='http://www.w3.org/1999/xhtml'><body/></html>","application/xhtml+xml")) !== null;
			verNo="60"; go = false
		} catch(e) {}
	}
	//<59
	if (go) {verNo="59 or lower"}
	// set isVer
	if (isVer == "") {isVer = verNo.replace(/\D/g,'')}
	// perf
	dom.versionNo = verNo
	store_data("ua","6 version",verNo)
	if (logPerf && isFF) {debug_log("version [ua]",t0)}
}

function get_viewport(runtype) {
	let e=document.createElement("div")
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;"
	document.documentElement.insertBefore(e,document.documentElement.firstChild)
	let vw=e.offsetWidth,
		vh=e.offsetHeight
	document.documentElement.removeChild(e)
	dom.Viewport = vw+" x "+vh

	if (logExtra) {console.log("B done [must follow zoom]: ", runtype, ": viewport")}

	// get android viewport height once on first load
	// this s/be the value with toolbar visible (except in FS)
	if (avh == "") {avh = vh}
	// return
	if (runtype == "ua") {
		return vw // scrollbar
	} else {
		return vh // android tests
	}
}

function get_widgets() {
	// vars
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

		if (runSim) {
			//if (i == 1) {font = "-apple-system"; size="11px"} // a: font + size change
			if (i == 4) {font = "-apple-system"} // b: font changes
			//if (i == 2) {size="13px"} // c: size changes
		}
		output = font+", "+size

		// FIRST 7
		if (i < 7) {
			combined.push(list[i].padStart(14) + ": "+output)
			// remember first
			if (i == 0) {size0 = size; font0 = font}
			// compare subsequent
			if (i > 0) {if (size !== size0) {sizediff = true}}
			if (i > 0) {if (font !== font0) {fontdiff = true}}
		}
		// ALL
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
		os = not_seen+"mix before"+sc
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
	dom.widgetH = sha1(hash.join())
	dom.widgetOS.innerHTML = os + (runSim ? zSIM : "")
	store_data("ua","7 widget",sha1(hash.join()))
	// perf
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
	// ToDo: when zooming, getting the divDPI is much slower
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
	if (logExtra) {console.log("A done  [must come first]: ", runtype, ": zoom, dpi, devicePixelRatio")}
	dom.jsZoom = jsZoom
	// perf
	if (runtype !== "resize" && logPerf) {debug_log("zoom ["+runtype+ "]",t0)}
	return jsZoom
}

function get_dpr() {
	/* DEVICEPIXELRATIO LEAKS */
	// code based on work by Alex Catarineu
	// https://acatarineu.github.io/fp/devicePixelRatio.html
	function closest(a, b, x) {
		return Math.abs((a[0] / a[1]) - x) < Math.abs((b[0] / b[1]) - x) ? a : b;
	}
	function closestFrac(x, maxDen) {
		let a = [0, 1];
		let b = [1, 1];
		let A = closest(a, b, x);
		for (;;) {
			let c = [a[0] + b[0], a[1] + b[1]];
			const g = gcd(c[0], c[1]);
			c[0] /= g;
			c[1] /= g;
			if (c[1] > maxDen) {
				return A;
			}
			A = closest(A, c, x);
			if (x >= (a[0] / a[1]) && x <= (c[0] / c[1])) {
				b = c;
			} else {
				a = c;
			}
		}
	}
	function gcd(a, b) {
		if (!b) {
			return a;
		}
		return gcd(b, a % b);
	}
	function lcm(a, b) {
		return (a * b) / gcd(a, b);
	}
	function gcdFraction([a, b], [c, d]) {
		return [gcd(a, c), lcm(b, d)];
	}
	function addFraction([a, b], [c, d]) {
		return [a * d + c * b, b * d];
	}
	function toFraction(x) {
		if (!x) {
			return [0, 1];
		}
		const floor = Math.floor(x);
		const rest = x - floor;
		return addFraction([floor, 1], closestFrac(rest, 70));
	}
	const measurements = {
		scrollY: { maxVal: null, lastSeen: null },
		clientRect: { maxVal: null, lastSeen: null },
	};
	let dprCounter = 0;
	function render() {
		for (let key in measurements) {
			document.getElementById("dpr"+key).innerHTML = `${measurements[key].maxVal}`;
			dprCounter++;
			if (dprCounter == 500) {
				window.removeEventListener('scroll', dprScroll);
			};
		};
	};
	window.addEventListener('scroll', dprScroll)
	function dprScroll() {
		// Currently can be measured via window.scrollY or getBoundingClientRect().
		const values = {
			scrollY: window.scrollY,
			clientRect: 8 + document.body.getBoundingClientRect().height - document.body.getBoundingClientRect().bottom,
		};
		// This finds the gcd of the measurements to calculate devicePixelRatio.
		// I have the feeling there must be a much easier way to do this though.
		for (let key in values) {
			const value = values[key];
			const measurement = measurements[key];
			if (value) {
				let frac = toFraction(value);
				if (measurement.lastSeen) {
					const gcd = gcdFraction(measurement.lastSeen, frac);
					measurement.lastSeen = gcd;
					measurement.maxVal = Math.max(gcd[1] / gcd[0], measurement.maxVal);
					render();
				} else {
					measurement.lastSeen = frac;
				}
			}
		}
	}
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
	// avh global var s/be with toolbar visible: so use new value > avh
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
			// The event exits FS, so we can rely on avh
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
	// reset
	dom.newWinLeak = "&nbsp"
	let sizesi = [], // inner history
		sizeso = [],   // outer history
		n = 1, // setInterval counter
		newWinLeak = "",
		strError = ""

	// open new window/tab and grab info immediately into array
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
			let diffsi = [], // array: 4 inner sizes to compare
				diffso = [],   // array: 4 outer sizes to compare
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
					// errors
					if (isFile) {
						let err = e.message
						if (err.substring(0, 17) == "Permission denied") {
							// privacy.file_unique_origin
							strError = so+"only "+n+" checks: flip privacy.file_unique_origin"+sc
						}
					}
					// if not permission denied, eventually we will always get a
					// NS_ERROR_UNEXPECTED error which we can ignore. Always output
					check_newwin()
				}
			}
			n++
		}
		// keep checking until we cause an error
		let checking = setInterval(build_newwin, 3)

	} else {
	// ANDROID
		if (ih > firstH) {
			// firstH should be with the toolbar
			newWinLeak = iw+" x "+ih+" [inner] [toolbar hidden] "+ow+" x "+oh+" [outer]"
		} else if (ih == firstH) {
			// they should be the same
			newWinLeak = iw+" x "+ih+" [inner] [toolbar visible] "+ow+" x "+oh+" [outer]"
		}
		output_newwin(newWinLeak)
	}

}

/* OUTPUT */

function outputScreen(runtype) {
	let t0 = performance.now()
	// do these once
	get_color()
	get_private_win()
	get_fullscreen()
	// this function has everything called on the resize event
	// zoom, viewport, dpi, dpr, orientation, fullscreen, screen/window measurements
	// we pass runtype as "load" or "screen"
	get_screen_metrics(runtype)
	// listen for dpr leaks
	get_dpr()
	// perf
	debug_page("perf","screen",t0,gt0)
}

function outputMath() {
	let t0 = performance.now()
	// vars: 1= ecma1, 6= ecma6, c= combined
	let r = "",
		h1 = "", // string to hash
		h6 = "",
		m1hash = "", // sha1 hashes
		m6hash = "",
		mchash = "",
		m1 = "", // short codes
		m6 = "",
		mc = "",
		fdMath1 = "", // strings used for browser/os
		fdMath6 = "",
		strNew = zNEW + (runSim ? zSIM : "")

	function get_hashes() {
		let r=""
		// ECMASCript 1st edtion
		r = Math.cos(1e251); dom.cos1=r; h1 = r
		r = Math.cos(1e140); dom.cos2=r; h1 += "-"+r
		r = Math.cos(1e12);  dom.cos3=r; h1 += "-"+r
		r = Math.cos(1e130); dom.cos4=r; h1 += "-"+r
		r = Math.cos(1e272); dom.cos5=r; h1 += "-"+r
		r = Math.cos(1e0);   dom.cos6=r; h1 += "-"+r
		r = Math.cos(1e284); dom.cos7=r; h1 += "-"+r
		r = Math.cos(1e75);  dom.cos8=r; h1 += "-"+r
		m1hash = sha1(h1)
		// ECMASCript 6th edtion
		let x, y;
		x = 0.5; r = Math.log((1 + x) / (1 - x)) / 2 // atanh(0.5)
		dom.math1 = r; h6 = r
		x=1; r = Math.exp(x) - 1 // expm1(1)
		dom.math2 = r; h6 += "-"+r
		x = 1; y = Math.exp(x); r = (y - 1 / y) / 2 // sinh(1)
		dom.math3 = r; h6 += "-"+r
		m6hash = sha1(h6)
		mchash = sha1(h1+"-"+h6)
		if (runSim) {
			m1hash = sha1("a"), mchash = sha1("b") // emca1
			//m6hash = sha1("c"), mchash = sha1("d") // emca6
			//m1hash = sha1("e"), m6hash = sha1("f"), mchash = sha1("g") // both
		}
		store_data("ua","8 math",mchash)
	}

	function get_codes() {
		// known FF math6 hashes (browser)
		if (m6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {m6="1"}
		else if (m6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {m6="2"}
		else if (m6hash == "9251136865b8509cc22f8773503288d106104634") {m6="3"} // 68+ exmp1(1) 1380031
		// known FF math1 hashes (os)
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
		// build browser output: ECMA6 only
		if (m6 == "1" | m6 == "3") {
			fdMath6=zFF
		} else if (m6 == "2") {
			fdMath6=zFF+" [32-bit]"
		}
		// build os output, refine browser output
		if (m1 == "A" | m1 == "H") {
			// A or H: always 64bit WIN on 64bit FF
			fdMath1="Windows [64-bit]"
			fdMath6=zFF+" [64-bit]"
		} else if (m1 == "C") {
			// C: always 32bit FF on WIN (32bit or 64bit)
			fdMath1="Windows"
			fdMath6=zFF+" [32-bit]"
		} else if (m1 == "D") {
			// D: always Linux (so far Mint, Debian, OpenSUSE)
			fdMath1="Linux"
			if (m6 == "1") {
				// 60-67: 1D : always 64bit Linux: and thus 64bit FF
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
			// G: always Linux (so far Ubuntu)
			fdMath1="Linux"
		} else if (m1 == "E") {
			// E: always Mac: and thus 64bit FF
			fdMath1="Mac"
			fdMath6=zFF+" [64-bit]"
		} else if (m1 == "F") {
			// F: always Android (so far!)
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
			// get os for comparison
			let compare = fdMath1.replace(" [32-bit]","")
			compare = compare.replace(" [64-bit]","")
			compare = compare.toLowerCase()
			// hash notation (no short code means I haven't seen it before)
			if (m1 == "") {m1hash=m1hash + strNew} else {m1hash=m1hash+" ["+m1+"]"}
			if (m6 == "") {m6hash=m6hash + strNew} else {m6hash=m6hash+" ["+m6+"]"}
			if (mc.length < 2) {mchash = mchash + strNew} else {mchash=mchash+" ["+mc+"]"}
			// notation
			strNew = not_seen+"math combo before"+sc + (runSim ? zSIM : "")
			if (fdMath1 == "") {
				fdMath1 = strNew
			} else {
				if (isOS !== compare) {
					fdMath1 += sb+"[doesn't match widget os]"+sc
				}
			}
			// force simulate no-match as well
			if (runSim) {
				if (isOS == "windows") {fdMath1 += "<br>Linux"} else {fdMath1 += "<br>Windows"}
				fdMath1 += sb+"[doesn't match widget os]"+sc + zSIM
			}
			if (fdMath6 == "") {fdMath6=strNew}
			// output
			dom.fdMathOS.innerHTML = fdMath1
			dom.fdMath.innerHTML = fdMath6
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
		dom.fdetect = zFF
		get_widgets() // isOS
		get_version() // isVer
		get_resources()
		get_line_scrollbar() // this runs zoom & viewport
		get_chrome()
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
	get_collation()
	get_ua_nav()
	// perf
	debug_page("perf","ua",t0,gt0)
}

function outputStart() {
	// perf
	gt0 = performance.now()
	// run once
	dom.debugperf = "       start:    screen.js loaded"
	isPage = "main"
	if ((location.protocol) == "file:") {isFile = true; note_file = sn+"[file:]"+sc}
	if ((location.protocol) == "https:") {isSecure = true}
	// ToDo: isFF: add redundancy, use features that can't be disabled/spoofed
	if ("undefined" != typeof InstallTrigger) {isFF = true}
	// simulation FF only
	if (isFF == false) {runSim = false}
	// run UA first: it sets isOS, isTB, isVer
	outputUA("load")
	outputMath()
	outputScreen("load")
	// per os tweaks
	run_os()
}

outputStart()
