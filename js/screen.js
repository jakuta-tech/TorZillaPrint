/* TABLES: Screen, User Agent, Math */

'use strict';

var jsZoom, varDPI, dpi_x, dpi_y;

/* FUNCTIONS */

function isInner(w,h) {
	// only call if zoom = 100%
	let r = ""
	// LB
	let wstep = 200, hstep = 200, bw = false, bh = false;
	if (w < 501) {wstep = 50} else if (w < 1601) {wstep = 100};
	if (h < 501) {hstep = 50} else if (h < 1601) {hstep = 100};
	bw = Number.isInteger(w/wstep);
	bh = Number.isInteger(h/hstep);
	r = ((bw && bh) ? lb_green : lb_red );
	// new win
	wstep = 200, hstep = 100, bw = false, bh = false;
	if (w < 1001) {bw = Number.isInteger(w/wstep)};
	if (h < 1001) {bh = Number.isInteger(h/hstep)};
	r = ((bw && bh) ? r += nw_green : r += nw_red );
	return r
};

function get_version() {
	let t0 = performance.now();
	let go = true,
		verNo = "";
	// reminder: append + on first test

	//73: 1594241 (3 or 4ms)
	// ToDo: replace this: slow and breaks if css is blocked
	if (go) {
		try {
			let rule73 = dom.test73.sheet.cssRules[0];
			if (rule73.style.border == "") { verNo= "73+"; go = false};
		} catch(e) {}
	}
	//72: 1589072 (0ms)
	if (go) {
		try {
			let err72 = eval('let a = 100_00_;');
		} catch(e) {
			if (e.message.substring(0,6) == "unders" ) { verNo="72"; go = false};
		}
	}
	//71: 1565991 (0ms)
	if (go) {
		try {
			document.createElement("canvas").getContext("2d").createPattern(new Image(), "no-repeat");
			verNo="71"; go = false
		} catch(e) {}
	}
	//70: 1541861 (1ms)
	if (go) {
		try {
			let el = document.createElement('style');
			document.head.appendChild(el);
			el.sheet.deleteRule(0);
		} catch(e) {
			if (e.message.substring(0,6) == "Cannot") { verNo="70"; go = false};
		}
	}
	//69 (0ms)
	if (go) {
		try {let err69 = new DOMError('name');} catch(e) { verNo="69"; go = false};
	}
	//68 (0ms)
	if (go) {
		let obj68 = dom.obj68;
		if (obj68.typeMustMatch == false) {} else { verNo="68"; go = false};
	}
	//67 (0ms)
	if (go) {
		if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67"; go = false};
	}
	//66 (0ms)
	if (go) {
		try {
			let str66 = "66 test";
			const textEncoder = new TextEncoder();
			const utf8 = new Uint8Array(str66.length);
			let encodedResults = textEncoder.encodeInto(str66, utf8);
			verNo="66"; go = false
		} catch(e) {};
	}
	//65 (1ms)
	if (go) {
		try {
			const rtf = new Intl.RelativeTimeFormat("en", {style: "long",});
			verNo="65"; go = false
		} catch(e) {};
	}
	//64 (0ms)
	if (go) {
		if (window.screenLeft == undefined){} else { verNo="64"; go = false};
	}
	//63 (0ms)
	if (go) {
		if (Symbol.for(`foo`).description == "foo"){ verNo="63"; go = false};
	}
	//62 (2ms)
	if (go) {
		console.time("ver62");
		try {console.timeLog("ver62"); verNo="62"; go = false} catch(e) {};
		console.timeEnd("ver62");
	}
	//61 (0ms)
	if (go) {
		let str61=" meh";
		try {str61 = str61.trimStart(); verNo="61"; go = false} catch(e) {};
	}
	//60 (1ms)
	if (go) {
		try {(Object.getOwnPropertyDescriptor(Document.prototype, "body")
			|| Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "body")).get.call((new DOMParser).parseFromString(
				"<html xmlns='http://www.w3.org/1999/xhtml'><body/></html>","application/xhtml+xml")) !== null;
			verNo="60"; go = false
		} catch(e) {};
	}
	//<59
	if (go) {
		verNo="59 or lower";
	}
	// set isVer
	if (isVer == "") {isVer = verNo.replace(/\D/g,'')};
	// perf
	let t1 = performance.now();
	if (mPerf) {console.debug("ua version: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	return verNo;
};

function get_viewport(type) {
	let e=document.createElement("div");
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
	document.documentElement.insertBefore(e,document.documentElement.firstChild);
	let vw=e.offsetWidth,
		vh=e.offsetHeight;
	document.documentElement.removeChild(e);
	dom.Viewport = vw + " x " + vh;
	// get android viewport height once on first load
	// this s/be the value with toolbar visible (except in FS)
	if (avh == "") {avh = vh}
	// return
	if (type == "ua") {
		return vw; // scrollbar
	} else {
		return vh; // android tests
	};
};

function get_zoom(type) {
	let t0 = performance.now();

	// devicePixelRatio
	let devicePixelRatio = window.devicePixelRatio || 1;

	// dpi
	varDPI = get_mm_dpi("dpi");
	dom.mmDPI = varDPI + " | " + get_mm_dpi("dppx") + " | " + get_mm_dpi("dpcm") ;

	// divDPI relies on css: if css is blocked (dpi_y = 0) this causes issues
	dpi_x = Math.round(dom.divDPI.offsetWidth * devicePixelRatio);
	dpi_y = Math.round(dom.divDPI.offsetHeight * devicePixelRatio);
	dom.jsDPI = dpi_x;

	// zoom: chose method
	if (window.devicePixelRatio !== 1 || dpi_y == 0) {
		// use devicePixelRatio if we know RFP is off
		// or if css is blocked (dpi_y = 0, dpi_x = body width)
		jsZoom = Math.round(window.devicePixelRatio*100).toString();
	} else {
		// otherwise it could be spoofed
		jsZoom = Math.round((varDPI/dpi_x)*100).toString();
	};

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
	dom.jsZoom = jsZoom;
	// perf
	if (type !== "resize") {
		if (mPerf) {
			let t1 = performance.now();
			console.debug(type + " zoom: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")
		};
	}
	return jsZoom;
};

function get_orientation() {
	let l = "landscape", p = "portrait", q ="(orientation: ";
	dom.mmOrient = (function () {
		if (window.matchMedia(q+p+")").matches) return p;
		if (window.matchMedia(q+l+")").matches) return l;
	})();
	dom.ScrOrient = (function () {
		let o = (screen.orientation || screen.mozOrientation || {}).type;
		if (o === l+"-primary") return l;
		if (o === l+"-secondary") return l+" upside down";
		if (o === p+"-secondary" || o === "portrait-primary") return p;
		if (o === undefined) return "undefined";
	})();
};

function get_private_win() {
	try {
		let db = indexedDB.open("_testPBMode");
		db.onerror = function() {
			dom.IsPBMode="true"
		};
		db.onsuccess = function() {
			dom.IsPBMode="false"
		};
	} catch(e) {
		dom.IsPBMode="unknown: "+e.name
	};
};

function get_mm_dpi(type) {
	let result = "",
		q = "(max-resolution:"
	try {
		result = (function () {
			for (let i = 1; i < 2000; i++) {
				if (matchMedia(q + i + type + ")").matches === true) {
					return i;}
			} return i;
		})();
	} catch(e) {
		result = "error"
	}
	return result
};

function get_mm_metrics() {

	// promises and output
	function runTest(callback){
		// device
		let devicePromise = Promise.all([
			callback("width", "device-"),
			callback("height", "device-")
		]);
		devicePromise.then(function(device){
			device = device.toString().replace(",", " x ")
			dom.ScrMM = device;
		});
		// inner window
		let innerPromise = Promise.all([
			callback("width", ""),
			callback("height", "")
		]);
		innerPromise.then(function(inner){
			inner = inner.toString().replace(",", " x ")
			dom.WndInMM = inner;
		});
	}

	function searchValue(tester){
		let minValue = 0;
		let maxValue = 512;
		let ceiling = Math.pow(2, 32);
		function stepUp(){
			if (maxValue > ceiling){
				return Promise.reject("unable to find upper bound");
			}
			return tester(maxValue).then(function(testResult){
				if (testResult === searchValue.isEqual){
					return maxValue;
				}
				else if (testResult === searchValue.isBigger){
					//console.debug("isBigger", maxValue);
					minValue = maxValue;
					maxValue *= 2;
					return stepUp();
				}
				else {
					//console.debug("isSmaller", maxValue);
					return false;
				}
			});
		}
		function binarySearch(){
			if (maxValue - minValue < 0.01){
				return tester(minValue).then(function(testResult){
					if (testResult.isEqual){
						return minValue;
					}
					else {
						return tester(maxValue).then(function(testResult){
							if (testResult.isEqual){
								return maxValue;
							}
							else {
								return Promise.reject(
									"between " + minValue + " and " + maxValue
								);
							}
						});
					}
				});
			}
			else {
				let pivot = (minValue + maxValue) / 2;
				return tester(pivot).then(function(testResult){
					if (testResult === searchValue.isEqual){
						return pivot;
					}
					else if (testResult === searchValue.isBigger){
						minValue = pivot;
						return binarySearch();
					}
					else {
						maxValue = pivot;
						return binarySearch();
					}
				});
			}
		}
		return stepUp().then(function(stepUpResult){
			if (stepUpResult){
				return stepUpResult;
			}
			else {
				return binarySearch();
			}
		});
	}
	searchValue.isSmaller = -1;
	searchValue.isEqual = 0;
	searchValue.isBigger = 1;

	runTest(function(type, metric){
		return searchValue(function(valueToTest){
			if (window.matchMedia("(" + metric + type + ": " + valueToTest + "px)").matches){
				return Promise.resolve(searchValue.isEqual);
			}
			else if (window.matchMedia("(max-" + metric + type + ": " + valueToTest + "px)").matches){
				return Promise.resolve(searchValue.isSmaller);
			}
			else {
				return Promise.resolve(searchValue.isBigger);
			}
		});
	});
};

function get_screen_metrics(type) {
	dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
	dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
	dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
	dom.DevPR = window.devicePixelRatio;
	dom.fsState = window.fullScreen;
	// inner
	let w = window.innerWidth,
		h = window.innerHeight;
	let strTemp = w+" x "+h+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
	if (isOS == "android") {
		dom.WndIn = strTemp;
	} else {
		if (type !== "screen") {
			get_zoom("resize");
			get_viewport("resize");
		}
		if (jsZoom == 100) {
			// add LB and NW notation
			dom.WndIn.innerHTML = strTemp + isInner(w,h);
		} else {
			// not 100% zoom
			dom.WndIn.innerHTML = strTemp + lb_orange;
		}
	};
	get_mm_metrics();
	get_orientation();
}

function get_fullscreen() {
	// full-screen-api.enabled
	try {
		if (document.mozFullScreenEnabled) {
			dom.fsSupport="enabled";
		}	else {
			dom.fsSupport="disabled";
			dom.fsLeak="n/a";
		}
	} catch(e) {
		dom.fsSupport="no: " + e.name; dom.fsLeak="n/a"
	};
};

function get_browser_errors() {
	let t0 = performance.now();
	let errh = ""; // string to hash
	// RangeError
	try {
		let foodate = new Date(),
			bar = new Date(foodate.endDate).toISOString();
	} catch(e) {
		dom.err1=e;
		errh += e
	};
	// ReferenceError
	try {
		foo=2
	} catch(e) {
		dom.err2=e;
		errh += e
	};
	// SyntaxError
	try {
		eval("alert('Hello)");
	} catch(e) {
		dom.err3=e;
		errh += e
	};
	// TypeError
	try {
		function foobar() {
			let foo = document.getElementById("bar");
			foo.value = screen.width;
		}
		window.onload = foobar();
	} catch(e) {
		dom.err4=e;
		errh += e
	};
	// TypeError
	try {
		var bar = new Date(bar[0].endDate).toISOString()
	} catch(e) {
		dom.err5=e;
		errh += e
	};
	// URIError
	try {
		decodeURIComponent("%")
	} catch(e) {
		dom.err6=e;
		errh += e
	};
	// error hash
	errh = sha1(errh);
	dom.errh = errh;
	if (errh == "32e7cf958b5c1a791392fe7c70ed51474ec49e79") {
		dom.fdError = "Firefox"
	};
	let t1 = performance.now();
	if (mPerf) {console.debug("ua errors: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function get_browser_resource() {
	// browser: chrome: Firefox
	let t0 = performance.now();

	// about:logo: desktop 300x236 vs 258x99 android dimensions
	let imgA = new Image();
	imgA.src = "about:logo";
	imgA.style.visibility = "hidden";
	document.body.appendChild(imgA);
	imgA.addEventListener("load", function() {
		if (imgA.width == 300) {
			// change displayed resource to icon64
			dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')";
		};
		if (imgA.width > 0) {dom.fdResource = "Firefox"};
		document.body.removeChild(imgA);
	});

	// browser: chrome: refine if TB desktop
	let imgB = new Image();
	imgB.src = "resource://onboarding/img/tor-watermark.png";
	imgB.style.visibility = "hidden";
	document.body.appendChild(imgB);
	imgB.addEventListener("load", function() {
		if (imgB.width > 0) {
			dom.fdResource = "Tor Browser";
			// set isTB
			isTB = true;
			outputDebug("2", "     resource:// = tor-watermark.png")
		};
		document.body.removeChild(imgB);
	});
	// ToDo: browser resource: TB Android

	let t1 = performance.now();
	if (mPerf) {console.debug("ua resource browser: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function get_os_chrome() {
	let t0 = performance.now();
	// vars
	let b = "chrome://branding/content/",
		c = "chrome://browser/content/",
		s = "chrome://browser/skin/",
		os = "Linux", // default
		imgUris = [b+'icon64.png', s+'Toolbar-win7.png', s+'sync-horizontalbar-XPVista7.png'],
		cssUris = [c+'extension-win-panel.css', c+'extension-mac-panel.css'],
		objCount = 0;
	// output
	function output_os_chrome(type) {
		dom.fdChromeOS = type;
		let t1 = performance.now();
		outputDebug("1", "[chrome] ua", (t1-t0), (t1 - gt0));
	};
	// chrome:// css
	cssUris.forEach(function(cssUri) {
		let css = document.createElement("link");
		css.href = cssUri;
		css.type = "text/css";
		css.rel = "stylesheet";
		document.head.appendChild(css);
		css.onload = function() {
			if (cssUri === c+"extension-win-panel.css") {
				os = "Windows";
				output_os_chrome(os);
			} else if (cssUri === c+"extension-mac-panel.css") {
				os = "Mac";
				output_os_chrome(os);
			};
			objCount++;
		};
		css.onerror = function() {
			objCount++;
		}
		document.head.removeChild(css);
	});
	// chrome:// images
	imgUris.forEach(function(imgUri) {
		let img = document.createElement("img");
		img.src = imgUri;
		img.style.height = "20px";
		img.style.width = "20px";
		img.onload = function() {
			if (imgUri === s+"Toolbar-win7.png" || imgUri === s+"sync-horizontalbar-XPVista7.png") {
				os = "Windows";
				output_os_chrome(os);
			};
			objCount++;
		};
		img.onerror = function() {
			if (imgUri === b+"icon64.png") {
				os = "Android";
				output_os_chrome(os);
			};
			objCount++;
		};
	});
	// check until all 5 tested
	function check_linux() {
		if (objCount == 5) {
			clearInterval(checking);
			if (os == "Linux") {
				output_os_chrome(os);
			}
		}
	}
	let checking = setInterval(check_linux, 20)
};

function get_os_line_scrollbar() {

	function decimal_count(value) {
		if(Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	};

	// recalculate zoom/viewport in case someone zoomed between tests
	get_zoom("ua");
	let vw = get_viewport("ua");
	// os: strings
	let strW = "[Windows]",
		strWL = "[Windows or Linux]",
		strWM = "[Windows or Mac]",
		strWLM = "[Windows, Linux or Mac]",
		strL = "[Linux]",
		strLA = "[Linux or Android]",
		strLM = "[Linux or Mac]",
		strM = "[Mac]",
		strA = "[Android]";

	// os: scrollbar width
	let t0 = performance.now();
	let w = (window.innerWidth-vw);
	let wZoom = w;
	let os = "", sbZoom = "";
	if (w == 0) {
		os= "[Mac OS X, mobile or floating scrollbars]"
	} else if (w < 0) {
		os= "[mobile]"
	}	else {
	// known metrics
	// ToDo: scrollbar width: keep checking nightly vs dev (always some diffs)
		if (jsZoom == 100) {
			if (w==17) {os=strW};
			if (w==16) {os=strL};
			if (w==15) {os=strM};
			if (w==12) {os=strL};
		} else if (jsZoom == 300) {
			if (w==6) {os=strWL};
			if (w==5) {os=strWM};
			if (w==4) {os=strL};
		} else if (jsZoom == 240) {
			if (w==7) {os=strWM};
			if (w==6) {os=strL};
			if (w==5) {os=strL};
		} else if (jsZoom == 200) {
			if (w==9) {os=strW};
			if (w==8) {os=strWLM};
			if (w==7) {os=strM};
			if (w==6) {os=strL};
		} else if (jsZoom == 170) {
			if (w==10) {os=strWL};
			if (w==8) {os=strM};
			if (w==7) {os=strL};
		} else if (jsZoom == 150) {
			if (w==12) {os=strW};
			if (w==11) {os=strW};
			if (w==10) {os=strLM};
			if (w==8) {os=strL};
		} else if (jsZoom == 133) {
			if (w==13) {os=strW};
			if (w==12) {os=strWL};
			if (w==11) {os=strM};
			if (w==9) {os=strL};
		} else if (jsZoom == 120) {
			if (w==15) {os=strW};
			if (w==14) {os=strWL};
			if (w==12) {os=strM};
			if (w==10) {os=strL};
		} else if (jsZoom == 110) {
			if (w==16) {os=strW};
			if (w==15) {os=strW};
			if (w==14) {os=strLM};
			if (w==11) {os=strL};
		} else if (jsZoom == 90) {
			if (w==19) {os=strW};
			if (w==18) {os=strL};
			if (w==17) {os=strM};
			if (w==16) {os=strM};
			if (w==13) {os=strL};
		} else if (jsZoom == 80) {
			if (w==21) {os=strW};
			if (w==20) {os=strL};
			if (w==19) {os=strM};
			if (w==15) {os=strL};
		} else if (jsZoom == 67) {
			if (w==26) {os=strW};
			if (w==25) {os=strW};
			if (w==24) {os=strL};
			if (w==23) {os=strM};
			if (w==22) {os=strM};
			if (w==18) {os=strL};
		} else if (jsZoom == 50) {
			if (w==34) {os=strW};
			if (w==32) {os=strL};
			if (w==30) {os=strM};
			if (w==24) {os=strL};
		} else if (jsZoom == 30) {
			if (w==57) {os=strW};
			if (w==56) {os=strW};
			if (w==54) {os=strL};
			if (w==50) {os=strM};
			if (w==40) {os=strL};
		};
		if (os != "") {
			// known metric
			os += " [known metric]"
		} else {
			// still unknown
			if (jsZoom !== 100) {
				// recalc scrollbar at 100% for final guess: not perfect
				if (window.devicePixelRatio !== 1 || dpi_y == 0) {
					// RFP is off or css is blocked
					wZoom = w * window.devicePixelRatio;
				} else {
					wZoom = w * (((varDPI/dpi_x)*100)/100);
				};
			};
			// final guess
			if (wZoom>=16.5) {
				os=strW // in testing = windows only
			} else {
				os=strL // guess linux (andoid s/be 0, mac s/be covered)
			};
			// guess notation
			os += " [logical guess]"
		};
	};
	// zoom notation
	if (jsZoom == 100) {} else { sbZoom = " at "+jsZoom+"% "};
	// output
	dom.scrollbarWidth = w+"px " + sbZoom + os;
	// perf
	let t1 = performance.now();
	if (mPerf) {console.debug("ua scrollbar: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};

	// os: css line-height
	t0 = performance.now();
	// get line-height
	let myLHElem = dom.spanLH;
	let lh = getComputedStyle(myLHElem).getPropertyValue("line-height");
	let lhCR = "";
	// 1536871: use clientrect div height
	if (lh == "normal") {
		let testLHdiv = dom.divLH;
		let elementDiv = testLHdiv.getBoundingClientRect();
		let newlh = elementDiv.height;
		// more than 4 decimal places
		if (decimal_count(newlh) > 4) {
			newlh = newlh.toFixed(4);
		};
		lh = newlh.toString();
		lhCR = sn + "[clientrect]" + sc + " normal" + sg + "[getComputedStyle]" + sc;
		// ToDo: os line height: detect clientrect randomizing
	};
	// trim "px"
	if (lh.substr(-2) == "px") {
		lh = lh.slice(0, -2);
	};
	os = "";
	let strTBL = " [Linux]" + tb_green;
	let myLHFont = getComputedStyle(myLHElem).getPropertyValue("font-family");
	if (myLHFont.slice(1,16) !== "Times New Roman") {
		// document fonts blocked: TNR might not be used
		os = sb + " [document fonts are disabled]" +sc;
	} else if (lh == "19.2") {
		// TB DESKTOP: 19.2px seems to be unique to TB any-zoom / any-platform
		os = tb_green;
		// set isTB
		isTB = true;
		outputDebug("2", " css line height = 19.2")
	} else {
		// using TNR and not TB's 19.2
		// WINDOWS / LINUX: some known metrics
		if (jsZoom == 100) {
			if (lh=="20") {os=strW};
			if (lh=="19") {os=strL};
			if (lh=="18") {os=strW};
			if (lh=="17") {os=strL};
		} else if (jsZoom == 300) {
			if (lh=="19") {os=strW};
			if (lh=="18.6667") {os=strW};
			if (lh=="18") {os=strL};
			if (lh=="17.6667") {os=strL};
		} else if (jsZoom == 240) {
			if (lh=="19.1667") {os=strW};
			if (lh=="19") {os=strTBL};
			if (lh=="18.3333") {os=strWL};
			if (lh=="17.5") {os=strL};
		} else if (jsZoom == 200) {
			if (lh=="19") {os=strW};
			if (lh=="18") {os=strL};
		} else if (jsZoom == 170) {
			if (lh=="19.25") {os=strW};
			if (lh=="18.9") {os=strTBL};
			if (lh=="18.6667") {os=strW};
			if (lh=="18.0833") {os=strL};
			if (lh=="17.5") {os=strL};
		} else if (jsZoom == 150) {
			if (lh=="20") {os=strW};
			if (lh=="18.6667") {os=strWL};
			if (lh=="17.3333") {os=strL};
		} else if (jsZoom == 133) {
			if (lh=="19.5") {os=strW};
			if (lh=="18.9") {os=strTBL};
			if (lh=="18") {os=strL};
			if (lh=="18.75") {os=strW};
		} else if (jsZoom == 120) {
			if (lh=="20") {os=strW};
			if (lh=="19.1667") {os=strL};
			if (lh=="19") {os=strTBL};
			if (lh=="18.3333") {os=strW};
			if (lh=="17.5") {os=strL};
		} else if (jsZoom == 110) {
			if (lh=="19.25") {os=strW};
			if (lh=="18.7") {os=strTBL};
			if (lh=="18.3333") {os=strL};
			if (lh=="17.4167") {os=strL};
		} else if (jsZoom == 90) {
			if (lh=="20.1") {os=strW};
			if (lh=="18.9833") {os=strWL};
			if (lh=="18.7667") {os=strTBL};
			if (lh=="16.75") {os=strL};
		} else if (jsZoom == 80) {
			if (lh=="20") {os=strW};
			if (lh=="19.5") {os=strTBL};
			if (lh=="18.75") {os=strWL};
		} else if (jsZoom == 67) {
			if (lh=="21") {os=strW};
			if (lh=="19.8") {os=strTBL};
			if (lh=="19.5") {os=strWL};
			if (lh=="18") {os=strL};
		} else if (jsZoom == 50) {
			if (lh=="22") {os=strW};
			if (lh=="20") {os=strWL};
			if (lh=="18") {os=strL};
		} else if (jsZoom == 30) {
			if (lh=="20") {os=strWL};
			if (lh=="26.6667") {os=strW};
		};
	};
	// detect MAC
	if (os == "") {
	/*	mac unique: .0167 .05 .0833 .1833 .35 .4333 .6833 .8333 .85
	mac not unique: .7667 .6667 (but unique at those zoom values)
	19.5167 : from old hackernews */
		let lhDec = (lh+"").split(".")[1];
		if (lhDec=="0167" | lhDec=="05" | lhDec=="0833" | lhDec=="1833" | lhDec=="35" | lhDec=="4333" | lhDec=="6833"
			| lhDec=="8333" | lhDec=="85" | lhDec=="7667" | lhDec=="6667" | lhDec=="5167") {os=strM};
	};
	// detect ANDROID
	if (os == "") {
		// ToDo: css line height: Android affected by devicePixelRatio
	};
	if (os == "") {
		// final guess
		os = strLA + " [logical guess]"
	} else {
		if (myLHFont.slice(1,16) == "Times New Roman") {
			// known notation
			os = os + " [known metric]"
		};
	};
	// output
	dom.cssLH.innerHTML = lh + "px " + sbZoom + os + lhCR;
	// perf
	t1 = performance.now();
	if (mPerf) {console.debug("ua css line height: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};

};

function get_os_widgets() {
	let t0 = performance.now();
	// varibles
	let wdFFN = "", // font family
		wdFSZ = "", // font size
		wdS = "", // 
		wdH = "",
		wdOS = "",
		wd7 = "", // string used for 7 widget multi-line output
		wdCS = "", // keep track of previous size
		wdCF = "", //  keep track of previous size
		wdBS = false, // keep track if the size changed
		wdBF = false; // keep track if the font changed

	// loop 9 elements
	for (let i = 1; i < 10; i++) {
		let wdItem = document.getElementById("widget"+i);
		wdFFN = getComputedStyle(wdItem).getPropertyValue("font-family");
		wdFSZ = getComputedStyle(wdItem).getPropertyValue("font-size");
		wdS = wdFFN + ", " + wdFSZ;
		// OS logic: use the first item to detect OS
		if (i == 1) {
			if (wdFFN.slice(0,12) == "MS Shell Dlg") {wdOS = "Windows"}
			else if (wdFFN == "Roboto") {wdOS="Android"}
			else if (wdFFN == "-apple-system") {wdOS="Mac"}
			else {wdOS="Linux"};
			// set isOS
			isOS = wdOS.toLowerCase();
		};
		// compare: values 1 to 7: should always be the same: track state
		if (i < 8) {
			// store previous values to compare: not even sure if these can be different
			wdCS = wdFSZ; wdCF = wdFFN;
			// build detailed output
				// test: trigger differences
				// if (i == 3) {wdFFN = "-apple-system"; wdFSZ="11px"}; // a: font + size change
				// if (i == 3) {wdFFN = "-apple-system";}; // b: font changes
				// if (i == 3) {wdFSZ="13px"}; // c: size changes
			if (i == 1) {wd7 = "        button: "+wdFFN + ", " + wdFSZ}
			else if (i == 2) {wd7 = wd7+"<br>"+"      checkbox: "+wdFFN + ", " + wdFSZ}
			else if (i == 3) {wd7 = wd7+"<br>"+"         color: "+wdFFN + ", " + wdFSZ}
			else if (i == 4) {wd7 = wd7+"<br>"+"      combobox: "+wdFFN + ", " + wdFSZ}
			else if (i == 5) {wd7 = wd7+"<br>"+"datetime-local: "+wdFFN + ", " + wdFSZ}
			else if (i == 6) {wd7 = wd7+"<br>"+"         radio: "+wdFFN + ", " + wdFSZ}
			else if (i == 7) {wd7 = wd7+"<br>"+"          text: "+wdFFN + ", " + wdFSZ};
			// track if first seven items have any size or font differences
			if (i > 1) {if (wdFSZ == wdCS) {} else {wdBS = true}};
			if (i > 1) {if (wdFFN == wdCF) {} else {wdBF = true}};
		};
		// output individual results: concatenate string for hash
		document.getElementById("wid"+i).innerHTML = wdS;
		if (i == 1) {wdH = wdS} else {wdH = wdH + " - "+wdS};
	};
	// output: detailed or combined
	if ( wdBF + wdBS > 0 ) {
		dom.widfirst.innerHTML = "various"
		dom.wid1.innerHTML = wd7;
		dom.wid1.style.fontFamily = "monospace, monospace";
	} else {
		dom.widfirst.innerHTML = "button|checkbox|color|combobox|datetime-local|radio|text";
		dom.wid1.style.fontFamily = "";
	};
	// cleanup os string
	if (wdBF == true) {wdOS = "unknown [font: mixed values]"} else {wdOS = wdOS + " [font: " + wdCF + "]"};
	// output OS and hash
	dom.widgetH = sha1(wdH);
	dom.widgetOS = wdOS;
	let t1 = performance.now();
	if (mPerf) {console.debug("ua widgets: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

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
			document.getElementById("devPR"+key).innerHTML = `${measurements[key].maxVal}`;
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
	};
};

/* OS SPECIFIC */

function run_os() {
	if (isOS == "android") {
		// unhide stuff
		showhide("table-row", "S", "");
		// fill in stuff
		dom.droidWin = firstW + " x " + firstH + " [inner] [toolbar visible]";
		// listen for toolbar
		get_android_tbh();
		// rerun screen if needed: droid can be a little slow
		if (window.innerWidth == firstW) {
			setTimeout(function(){get_screen_metrics();}, 100);
		};
	} else {
		// desktop: start listening for resize events
		window.addEventListener("resize", get_screen_metrics);
	};
};

function get_android_tbh() {
	// toolbar height if user has chosen to "hide the toolbar when scrolling down a page"
	// avh global var s/be with toolbar visible: so use new value > avh
	// We only need one diff since the viewport size "snaps" to the new value
	if (isOS == "android") {
		window.addEventListener('scroll', toolbarScroll)
		function toolbarScroll() {
			// ignore fullscreen
			if (window.fullScreen == false) {
				// delay: allow time for toolbar change
				setTimeout(function() {
					let vh_new = get_viewport();
					if (vh_new > avh) {
						dom.tbh = (vh_new - avh);
					};
				}, 800)
			};
		};
	};
};

function get_android_kbh() {
	if (isOS == "android") {
		// wait for keyboard
		setTimeout(function() {
			// use viewport: doesn't change on zoom
			let vh_new = get_viewport();
			// Compare to avh (captured on first load: s/be with toolbar visible)
			// The event exits FS, so we can rely on avh
			// use absolute value: event also triggered losing focus
			let vh_diff = Math.abs(avh - vh_new);
			dom.kbh = vh_diff;
			// ToDo: keyboard height: use setInterval
			// keyboard can be slow to open, and it "slides" up (stepped changes)
			// instead we could keep checking for x time and return the max diff
		}, 1000)
	};
};

/* USER TESTS */

function goFS() {
	if (isFF == true) {
		let ih1 = window.innerHeight,
			delay = 1;
		function exitFS() {
			if (isVer > 63) {	document.exitFullscreen() } else { document.mozCancelFullScreen() };
			document.removeEventListener("mozfullscreenchange", getFS)
		};
		function getFS() {
			if ( document.mozFullScreen ) {
				setTimeout(function(){
					let iw = document.mozFullScreenElement.clientWidth;
					let ih = document.mozFullScreenElement.clientHeight;
					dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+iw+" x "+ih+" [mozFullScreenElement client]";
					exitFS();
					// TB desktop warning panel
					if (isTB == true && isOS !== "android") {
						setTimeout(function(){
						let ih2 = window.innerHeight;
							let panel = ih1-ih2;
							if (panel !== 0) {
								dom.fsLeak.innerHTML = dom.fsLeak.textContent + "<br>" + panel + "px [warning panel height]";
							};
						}, 600);
					};
				}, delay);
			};
		};
		if (document.mozFullScreenEnabled) {
			let element = dom.imageFS;
			if (isOS == "android") { delay = 1000 }
			element.mozRequestFullScreen();
			document.addEventListener("mozfullscreenchange", getFS)
		};
	};
};

function goNW() {
	// reset
	dom.newWinLeak = "&nbsp";
	let sizesi = [], // inner history: pre-render to letterbox
		sizeso = [],   // outer history: pre-render to letterbox
		n = 1, // counter for setInterval
		newWinLeak = "",
		strError = "";

	// open new window/tab and grab info immediately into array
	let newWin = window.open("newwin.html","","width=9000,height=9000");
	let iw = newWin.innerWidth,
		ih = newWin.innerHeight,
		ow = newWin.outerWidth,
		oh = newWin.outerHeight;
	sizesi.push(iw+" x "+ih);
	sizeso.push(ow+" x "+oh);
	// default output
	newWinLeak = iw + " x " + ih + " [inner] " + ow + " x " + oh + " [outer]";

	function output_newwin(output){
		dom.newWinLeak.innerHTML = output;
	}

	// DESKTOP
	if (isOS !== "android") {

		function check_newwin() {
			let diffsi = [], // array of 4 inner sizes to compare
				diffso = [],   // array of 4 outer sizes to compare
				changesi = 0,
				changeso = 0;

			// step1: detect changes
			let prev = sizesi[0];
			let strInner = s1 + "inner: " + sc + iw + " x " + ih;
			for (let k=0; k < sizesi.length; k++) {
				if (sizesi[k] !== prev ) {
					changesi++;
					strInner = strInner + s1 + " &#9654 <b>[" + k + "]</b> " + sc + sizesi[k]
				}
				prev = sizesi[k];
			};
			prev = sizeso[0];
			let strOuter = s1 + "outer: " + sc + ow + " x " + oh;
			for (let k=0; k < sizeso.length; k++) {
				if (sizeso[k] !== prev ) {
					changeso++;
					strOuter = strOuter + s1 + " &#9654 <b>[" + k + "]</b> " + sc + sizeso[k]
				}
				prev = sizeso[k];
			};
			// if we had changes, change output
			if (changesi > 0 || changeso > 0) {
				newWinLeak = strInner + "<br>" + strOuter;
			}

			// append file:/// error debug
			if (strError !== "") {newWinLeak = newWinLeak + "<br>" + strError};
			// output
			output_newwin(newWinLeak)
		};

		function build_newwin() {
			// check 'n' times as "fast" as we can/dare
			if (n == 150) {
				clearInterval(checking);
				check_newwin();
			} else {
				// grab metrics
				try {
					sizesi.push(newWin.innerWidth+" x "+newWin.innerHeight);
					sizeso.push(newWin.outerWidth+" x "+newWin.outerHeight);
				} catch(e) {
					clearInterval(checking);
					// errors
					if ((location.protocol) == "file:") {
						let err = e.message;
						if (err.substring(0, 17) == "Permission denied") {
							// privacy.file_unique_origin
							strError = so + "file: debug: checked "+ n +" times:" + sc + sn + "check privacy.file_unique_origin" + sc;
						}
					}
					// if not permission denied, eventually we will always get a
					// NS_ERROR_UNEXPECTED error which we can ignore. Always output
					check_newwin();
				}
			}
			n++;
		};
		// keep checking until we cause an error
		let checking = setInterval(build_newwin, 3);

	} else {
	// ANDROID
		if (ih > firstH) {
			// firstH should be with the toolbar
			newWinLeak = iw + " x " + ih + " [inner] [toolbar hidden] " + ow + " x " + oh + " [outer]";
		} else if (ih == firstH) {
			// they should be the same
			newWinLeak = iw + " x " + ih + " [inner] [toolbar visible] " + ow + " x " + oh + " [outer]";
		};
		output_newwin(newWinLeak)
	};

};

/* OUTPUT */

function outputScreen(type) {
	let t0 = performance.now();
	// properties
	get_screen_metrics("screen");
	dom.PixDepth = screen.pixelDepth;
	dom.ColDepth = screen.colorDepth;
	// functions
	if (type != "load") {get_zoom("screen")}; // ua already ran it
	if (type != "load") {get_viewport("screen")} // ua already ran it
	get_orientation();
	get_private_win();
	get_fullscreen();
	// listen for dpr leaks
	get_dpr();
	// perf
	let t1 = performance.now();
	outputDebug("1", "screen", (t1-t0), (t1 - gt0));
};

function outputMath() {
	let t0 = performance.now();
	// variables: 1 = ecma1, 6 = ecma6, c = combined
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
		fdMath6 = "";
	// ECMASCript 1st edtion
	r = Math.cos(1e251); dom.cos1 = r; h1 = r;
	r = Math.cos(1e140); dom.cos2 = r; h1 += "-" + r;
	r = Math.cos(1e12);  dom.cos3 = r; h1 += "-" + r;
	r = Math.cos(1e130); dom.cos4 = r; h1 += "-" + r;
	r = Math.cos(1e272); dom.cos5 = r; h1 += "-" + r;
	r = Math.cos(1e0);   dom.cos6 = r; h1 += "-" + r;
	r = Math.cos(1e284); dom.cos7 = r; h1 += "-" + r;
	r = Math.cos(1e75);  dom.cos8 = r; h1 += "-" + r;
	m1hash = sha1(h1);
	// ECMASCript 6th edtion
	let x, y;
	x = 0.5; r = Math.log((1 + x) / (1 - x)) / 2; // atanh(0.5)
	dom.math1 = r; h6 = r;
	x=1; r = Math.exp(x) - 1; // expm1(1)
	dom.math2 = r; h6 += "-" + r;
	x = 1; y = Math.exp(x); r = (y - 1 / y) / 2; // sinh(1)
	dom.math3 = r; h6 += "-" + r;
	m6hash = sha1(h6);
	mchash = sha1(h1+"-"+h6);
	// build short code output
	// known FF math6 hashes (browser)
	if (m6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {m6 = "1"}
	else if (m6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {m6 = "2"}
	else if (m6hash == "9251136865b8509cc22f8773503288d106104634") {m6 = "3"}; // FF68+ changed exmp1(1), 1380031
	// known FF math1 hashes (os)
	if (m1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {m1 = "A"}
	else if (m1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {m1 = "B"}
	else if (m1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {m1 = "C"}
	else if (m1hash == "96895e004b623552b9543dcdc030640d1b108816") {m1 = "D"}
	else if (m1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {m1 = "E"}
	else if (m1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {m1 = "F"}
	else if (m1hash == "19df0b54c852f35f011187087bd3a0dce12b4071") {m1 = "G"}
	else if (m1hash == "8ee641f01271d500e5c1d40e831232214c0bbbdc") {m1 = "H"};
	mc = m6+m1;
	// build browser output: ECMA6 only
	if (m6 == "1" | m6 == "3") {
		fdMath6="Firefox"
	} else if (m6 == "2") {
		fdMath6="Firefox [32-bit]"
	};
	// build os output, refine browser output
	if (m1 == "A" | m1 == "H") {
		// A or H: always 64bit WIN on 64bit FF
		// need to double check H [i.e test FF32bit and TB on that machine]
		fdMath1="Windows [64-bit]"; fdMath6="Firefox [64-bit]"
	} else if (m1 == "C") {
		// C: always 32bit FF on WIN (32bit or 64bit)
		fdMath1="Windows"; fdMath6="Firefox [32-bit]"
	} else if (m1 == "D") {
		// D: always Linux (so far Mint, Debian, OpenSUSE)
		fdMath1="Linux";
		if (m6 == "1") {
			// ESR60-67: 1D : always 64bit Linux: and thus 64bit FF
			fdMath1="Linux [64-bit]"; fdMath6="Firefox [64-bit]";
		}	else if (m6 == "3") {
			// ESR68+: 3D : can be FF64bit or TB32/64bit
			// do nothing: values already set
		}	else if (m6 == "2") {
			// D2: always 32bit Linux (32bit FF set earlier)
			fdMath1="Linux [32-bit]"
		}
	} else if (m1 == "G") {
		// G: always Linux (so far Ubuntu)
		fdMath1="Linux"
	} else if (m1 == "E") {
		// E: always Mac: and thus 64bit FF
		fdMath1="Mac"; fdMath6="Firefox [64-bit]";
	} else if (m1 == "F") {
		// F: always Android (only had 32bit Android 6 to test on)
		fdMath1="Android"
	} else if (m1 == "B") {
		// B: always TB on WIN
		isTB = true;
		outputDebug("2", "math 1st edition = letter B")
		fdMath1="Windows";
		if (m6 == "1") {
			// ESR60: 1B: always 64bit TB: thus 64bit WIN
			fdMath6="Tor Browser [64-bit]"; fdMath1="Windows [64-bit]";
		} else if (m6 == "2") {
			// ESR60: 2B: always 32bit TB (but WIN can be 32bit or 64bit)
			fdMath6="Tor Browser [32-bit]"
		} else if (m6 == "3") {
			// ESR68: 3B: 32bit TB on 32/64 WIN and 64bit TB on WIN64: now all the same
			fdMath6="Tor Browser";
		}
	};
	// output browser/os
	if (isFF == true) {
		let strNew = sb + "[NEW]" + sc;
		if (m1 == "") {m1hash=m1hash+strNew} else {m1hash=m1hash+" ["+m1+"]"};
		if (m6 == "") {m6hash=m6hash+strNew} else {m6hash=m6hash+" ["+m6+"]"};
		if (mc.length < 2) {mchash = mchash+strNew} else {mchash=mchash+" ["+mc+"]"};
		strNew = sb + "I haven't seen this Firefox math combo before" + sc;
		if (fdMath1 == "") {fdMath1=strNew};
		if (fdMath6 == "") {fdMath6=strNew};
		dom.fdMathOS.innerHTML = fdMath1;
		dom.fdMath.innerHTML = fdMath6;
	};
	// output hashes
	dom.math1hash.innerHTML = m1hash;
	dom.math6hash.innerHTML = m6hash;
	dom.mathhash.innerHTML = mchash;
	// perf
	let t1 = performance.now();
	outputDebug("1", "math", (t1-t0), (t1 - gt0));
};

function outputUA() {
	let t0 = performance.now();

	// first script run: set global vars
	isPage = "main";
	if ((location.protocol) == "file:") {note_file = sn + "[file:]" + sc};
	if (isNaN(window.mozInnerScreenX) === false) {isFF = true};
	/* other:
		if (isNaN(window.window.scrollMaxX) === false) {"isFF = true"};
		if (navigator.oscpu == undefined){} else {"isFF = true"};
		// see 1591968: dom.mozPaintCount.enabled
	*/
	// properties
	dom.nAppName = navigator.appName;
	dom.nAppVersion = navigator.appVersion;
	dom.nBuildID = navigator.buildID;
	dom.nCodeName = navigator.appCodeName;
	dom.nOscpu = navigator.oscpu;
	dom.nPlatform = navigator.platform;
	dom.nProduct = navigator.product;
	dom.nProductSub = navigator.productSub;
	dom.nUserAgent = navigator.userAgent;
	outputMath();
	get_browser_errors();
	// firefox only
	if (isFF == true) {
		dom.fdetect="Firefox";
		get_os_widgets(); // sets isOS
		get_browser_resource();
		dom.versionNo = get_version();
		get_os_line_scrollbar();
		get_os_chrome();
	};
	// perf
	let t1 = performance.now();
	outputDebug("1", "ua", (t1-t0), (t1 - gt0));
};

// start page perf
gt0 = performance.now();
dom.debug1 = "       start:  screen.js loaded";

outputUA(); // run first: sets isFF, isOS: includes outputMath
outputScreen("load");
run_os(); // os specific tweaks
