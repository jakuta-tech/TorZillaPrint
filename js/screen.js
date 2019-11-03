/* TABLES: Screen, User Agent, Math */

'use strict';

/* FUNCTIONS */

function get_version() {
	let t0 = performance.now();
	//<59
	let verNo="59 or lower";
	//60
	try {(Object.getOwnPropertyDescriptor(Document.prototype, "body")
		|| Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "body")).get.call((new DOMParser).parseFromString(
			"<html xmlns='http://www.w3.org/1999/xhtml'><body/></html>","application/xhtml+xml")) !== null; verNo="60";
	} catch(e) {};
	//61
	let str61=" meh";
	try {str61 = str61.trimStart(); verNo="61"} catch(e) {};
	//62
	console.time("ver62");
	try {console.timeLog("ver62"); verNo="62"} catch(e) {};
	console.timeEnd("ver62");
	//63
	if (Symbol.for(`foo`).description == "foo"){ verNo="63"};
	//64
	if (window.screenLeft == undefined){} else { verNo="64"};
	//65
	try {const rtf = new Intl.RelativeTimeFormat("en", {style: "long",}); verNo="65"} catch(e) {};
	//66
	try {
		const string66 = "this is a test for firefox 66";
		const textEncoder = new TextEncoder();
		const utf8 = new Uint8Array(string66.length);
		let encodedResults = textEncoder.encodeInto(string66, utf8);
		verNo="66"
	} catch(e) {};
	//67
	if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67"};
	//68
	let obj68 = document.getElementById('obj68');
	if (obj68.typeMustMatch == false) {} else { verNo="68"};
	//69
	try {let err69 = new DOMError('name');} catch(e) { verNo="69"};
	//70: 1541861
	try {
		let el = document.createElement('style');
		document.head.appendChild(el);
		el.sheet.deleteRule(0);
	} catch(e) {
		if (e.message.substring(0,6) == "Cannot") { verNo="70"};
	}
	//71: 1565991
	try {
		document.createElement("canvas").getContext("2d").createPattern(new Image(), "no-repeat");
		verNo="71"
	} catch(e) {}
	//72: 1589072
	try {
		let err72 = eval('let a = 100_00_;');
	} catch(e) {
		if (e.message.substring(0,6) == "unders" ) { verNo="72+"};
	}
	// reminder: append + on last test

	isVersion = verNo.substring(0,2); // global var isVersion
	let t1 = performance.now();
	if (mPerf) {console.debug("ua version: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	return verNo;
};

function get_viewport(type) {
	let t0 = performance.now();
	let e=document.createElement("div");
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
	document.documentElement.insertBefore(e,document.documentElement.firstChild);
	let vw=e.offsetWidth,
		vh=e.offsetHeight;
	document.documentElement.removeChild(e);
	dom.Viewport = vw + " x " + vh;
	let t1 = performance.now();
	if (mPerf) {
		if (type !== "resize") {
			console.debug(type + " viewport: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
		}
	// get the android viewport height once on first load
	// this is always the value when the toolbar is visible (except if in FS)
	if (avh == "") {
		avh = vh;
	}
	if (type == "ua") {
		return vw; // called from scrollbar function
	} else {
		return vh; // vh used in android screen tests
	};
};

function get_zoom(type) {
	let t0 = performance.now();
	// js dpi
	let devicePixelRatio = window.devicePixelRatio || 1;
	let dpi_x = Math.round(dom.divDPI.offsetWidth * devicePixelRatio);
	let dpi_y = Math.round(dom.divDPI.offsetHeight * devicePixelRatio);
	dom.jsDPI = dpi_x;
	// matchmedia dpi: handles FF default zoom levels 30%-300%
	let varDPI = (function () {
	for (let i = 27; i < 2000; i++) {
		if (matchMedia("(max-resolution: " + i + "dpi)").matches === true) {
			return i;}
		} return i;})();
	dom.mmDPI = varDPI;
	// zoom: calculate from js dpi vs mediaMatch dpi
	// use devicePixelRatio if RFP is off
	if (window.devicePixelRatio == 1) {
		jsZoom = Math.round((varDPI/dpi_x)*100).toString();
	} else {
		jsZoom = Math.round(window.devicePixelRatio*100).toString();
	};
	// fixup some numbers
	if (jsZoom == 79) {jsZoom=80};
	if (jsZoom == 92) {jsZoom=90};
	if (jsZoom == 109) {jsZoom=110};
	if (jsZoom == 111) {jsZoom=110};
	if (jsZoom == 121) {jsZoom=120};
	if (jsZoom == 131) {jsZoom=133};
	if (jsZoom == 167) {jsZoom=170};
	if (jsZoom == 171) {jsZoom=170};
	if (jsZoom == 172) {jsZoom=170};
	if (jsZoom == 241) {jsZoom=240};
	if (jsZoom == 250) {jsZoom=240};
	dom.jsZoom = jsZoom;
	let t1 = performance.now();
	if (mPerf) {console.debug(type + " zoom: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	return jsZoom;
};

function get_orientation() {
	dom.ScrOrient = (function () {
		let o = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
		if (o === "landscape-primary") return "landscape";
		if (o === "landscape-secondary") return "landscape upside down";
		if (o === "portrait-secondary" || o === "portrait-primary") return "portrait";
		if (o === undefined) return "undefined";
	})();
	dom.mmOrient = (function () {
		if (window.matchMedia("(orientation: portrait)").matches) return "portrait";
		if (window.matchMedia("(orientation: landscape)").matches) return "landscape";
	})();
	dom.mathOrient = (function () {
		// dirty hack: doesn't always work e.g. if a smartphone keyboard reduces the height
		if (window.innerHeight === window.innerWidth) return "square";
		if (window.innerHeight < window.innerWidth) return "landscape";
		return "portrait";
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

function get_screen_metrics(type) {
	dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
	dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
	dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
	dom.WndIn = window.innerWidth+" x "+window.innerHeight+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
	dom.fsState = window.fullScreen;
	if (type !== "screen") {
		get_viewport("resize");
	};
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
	let errh = ""; // string we concat and hash
	// InternalError
	try {
		// method3: ~6ms
		if (isFirefox == true) {
			let lfLogBuffer = `if (lfCodeBuffer) loadFile(lfCodeBuffer);
				function loadFile(await ) { eval(lfVarx);}`;
			lfLogBuffer = lfLogBuffer.split('\n');
			let lfCodeBuffer = "";
			while (true) {
				let line = lfLogBuffer.shift();
				if (line == null) {
					break;
				} else {
					lfCodeBuffer += line + "\n";
				}
			}
			if (lfCodeBuffer) loadFile(lfCodeBuffer);
			function loadFile(lfVarx) {
				eval(lfVarx);
			}
		} else {
			dom.err1.innerHTML = "<span class='bad'>[excluded on non Firefox browsers]</span>";
		}
	} catch(e) {
		dom.err1=e;
		errh = errh+e
	};
	// RangeError
	try {
		let foodate = new Date(),
			bar = new Date(foodate.endDate).toISOString();
	} catch(e) {
		dom.err2=e;
		errh = errh+e
	};
	// ReferenceError
	try {
		foo=2
	} catch(e) {
		dom.err3=e;
		errh = errh+e
	};
	// SyntaxError
	try {
		eval("alert('Hello)");
	} catch(e) {
		dom.err4=e;
		errh = errh+e
	};
	// TypeError
	try {
		function foobar() {
			let foo = document.getElementById("bar");
			foo.value = screen.width;
		}
		window.onload = foobar();
	} catch(e) {
		dom.err5=e;
		errh = errh+e
	};
	// TypeError
	try {
		var bar = new Date(bar[0].endDate).toISOString()
	} catch(e) {
		dom.err6=e;
		errh = errh+e
	};
	// URIError
	try {
		decodeURIComponent("%")
	} catch(e) {
		dom.err7=e;
		errh = errh+e
	};
	// error hash
	errh = sha1(errh);
	dom.errh = errh;
	if (errh == "5ed4ad7ad001e60c30f31c52d994510bac1ca556") {
		dom.fdError = "Firefox"
	};
	let t1 = performance.now();
	if (mPerf) {console.debug("ua errors: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function get_browser_resource() {
	// browser: chrome: Firefox
	let t0 = performance.now();
	// about:logo: desktop 300x236 vs 258x99 android dimensions
	let imgLogoA = new Image();
	imgLogoA.src = "about:logo";
	imgLogoA.style.visibility = "hidden";
	document.body.appendChild(imgLogoA);
	imgLogoA.addEventListener("load", function() {
		let imgLogoAW = imgLogoA.width;
		if (imgLogoAW == 300) {
			// change displayed resource to icon64 (not on android)
			dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')";
		};
		if (imgLogoAW > 0) {dom.fdResource = "Firefox"};
		document.body.removeChild(imgLogoA);
	});
	// browser: chrome: refine if Tor Browser
	let imgLogoB = new Image();
	imgLogoB.src = "resource://onboarding/img/tor-watermark.png";
	imgLogoB.style.visibility = "hidden";
	document.body.appendChild(imgLogoB);
	imgLogoB.addEventListener("load", function() {
		let imgLogoBW = imgLogoB.width;
		if (imgLogoBW > 0) {
			dom.fdResource = "Tor Browser";
			// set isTorBrowser in case math missed it
			isTorBrowser = true;
		};
		document.body.removeChild(imgLogoB);
	});
	let t1 = performance.now();
	if (mPerf) {console.debug("ua resource browser: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function get_os_chrome() {
	let t0 = performance.now();
	// variables
	let b = "chrome://branding/content/",
		c = "chrome://browser/content/",
		s = "chrome://browser/skin/",
		os = "Linux", // default
		imgUris = [b+'icon64.png', s+'Toolbar-win7.png', s+'sync-horizontalbar-XPVista7.png'],
		cssUris = [c+'extension-win-panel.css', c+'extension-mac-panel.css'],
		objCount = 0;
	// so we can output as soon as possible
	function output_os_chrome(type) {
		dom.fdChromeOS = type;
		let t1 = performance.now();
		if (sPerf) {console.debug("  ** section straggler: ua chrome os: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
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
	// check until we have tested 5 items
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

function get_os_font() {
	let t0 = performance.now();
	// wait for font
	// this timeout currently sucks
	// need a more elegant method to detect when the font is loaded (if at all)
	setTimeout(function(){
		// os: font: use width of the fdCssOS* elements
		let elCount = 0, elCssOS = "Android";
		if (dom.fdCssOSW.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Windows"};
		if (dom.fdCssOSL.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Linux"};
		if (dom.fdCssOSM.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Mac"};
		if (elCount == 2 || elCount == 3) {elCssOS = "unknown"};
		dom.fontOS = elCssOS;
		let t1 = performance.now();
		if (sPerf) {console.debug("  ** section straggler: ua font os: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	}, 3000);
}

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
		strLM = "[Linux or Mac]",
		strM = "[Mac]",
		strA = "[Android]";

	// os: scrollbar width
	let t0 = performance.now();
	let sbWidth = (window.innerWidth-vw);
	let sbWidthZoom = sbWidth;
	let sbOS = "", sbZoom = "";
	// note: only Mac OS X (el capitan or lower) have zero width?
	if (sbWidth == 0) {sbOS= "[Mac OS X, mobile or floating scrollbars]";}
	else if (sbWidth < 0) {sbOS= "[mobile]";}
	else {
	// start with known metrics at preset FF zoom levels
		if (jsZoom == 300) {
			if (sbWidth==6) {sbOS=strWL};
			if (sbWidth==5) {sbOS=strWM};
			if (sbWidth==4) {sbOS=strL};
		} else if (jsZoom == 240) {
			if (sbWidth==7) {sbOS=strWM};
			if (sbWidth==6) {sbOS=strL};
			if (sbWidth==5) {sbOS=strL};
		} else if (jsZoom == 200) {
			if (sbWidth==9) {sbOS=strW};
			if (sbWidth==8) {sbOS=strWLM};
			if (sbWidth==7) {sbOS=strM};
			if (sbWidth==6) {sbOS=strL};
		} else if (jsZoom == 170) {
			if (sbWidth==10) {sbOS=strWL};
			if (sbWidth==8) {sbOS=strM};
			if (sbWidth==7) {sbOS=strL};
		} else if (jsZoom == 150) {
			if (sbWidth==12) {sbOS=strW};
			if (sbWidth==11) {sbOS=strW};
			if (sbWidth==10) {sbOS=strLM};
			if (sbWidth==8) {sbOS=strL};
		} else if (jsZoom == 133) {
			if (sbWidth==13) {sbOS=strW};
			if (sbWidth==12) {sbOS=strL};
			if (sbWidth==11) {sbOS=strM};
			if (sbWidth==9) {sbOS=strL};
		} else if (jsZoom == 120) {
			if (sbWidth==14) {sbOS=strWL};
			if (sbWidth==12) {sbOS=strM};
			if (sbWidth==10) {sbOS=strL};
		} else if (jsZoom == 110) {
			if (sbWidth==16) {sbOS=strW};
			if (sbWidth==15) {sbOS=strW};
			if (sbWidth==14) {sbOS=strLM};
			if (sbWidth==11) {sbOS=strL};
		} else if (jsZoom == 100) {
			if (sbWidth==17) {sbOS=strW};
			if (sbWidth==16) {sbOS=strL};
			if (sbWidth==15) {sbOS=strM};
			if (sbWidth==12) {sbOS=strL};
		} else if (jsZoom == 90) {
		if (sbWidth==19) {sbOS=strW};
			if (sbWidth==18) {sbOS=strL};
			if (sbWidth==17) {sbOS=strM};
			if (sbWidth==16) {sbOS=strM};
			if (sbWidth==13) {sbOS=strL};
		} else if (jsZoom == 80) {
			if (sbWidth==21) {sbOS=strW};
			if (sbWidth==20) {sbOS=strL};
			if (sbWidth==19) {sbOS=strM};
			if (sbWidth==15) {sbOS=strL};
		} else if (jsZoom == 67) {
			if (sbWidth==26) {sbOS=strW};
			if (sbWidth==25) {sbOS=strW};
			if (sbWidth==24) {sbOS=strL};
			if (sbWidth==23) {sbOS=strM};
			if (sbWidth==22) {sbOS=strM};
			if (sbWidth==18) {sbOS=strL};
		} else if (jsZoom == 50) {
			if (sbWidth==34) {sbOS=strW};
			if (sbWidth==32) {sbOS=strL};
			if (sbWidth==30) {sbOS=strM};
			if (sbWidth==24) {sbOS=strL};
		} else if (jsZoom == 30) {
			if (sbWidth==57) {sbOS=strW};
			if (sbWidth==56) {sbOS=strW};
			if (sbWidth==54) {sbOS=strL};
			if (sbWidth==50) {sbOS=strM};
			if (sbWidth==40) {sbOS=strL};
		};
		if (sbOS == "") {
			// not a preset FF zoom and known metric
			if (jsZoom == 100) {}
			else {
				// recalculate width based on zoom: this is not perfect
				if (window.devicePixelRatio == 1) {
					sbWidthZoom = sbWidth * (((varDPI/dpi_x)*100)/100);
				} else {
					sbWidthZoom = sbWidth * window.devicePixelRatio;
				};
			};
			// os logic: need more Mac / Android data
			// for now at least always return Linux as a minimum
			if (sbWidthZoom>=16.5) {sbOS=strW} else {sbOS=strL};
			// add in notation if this is a best guess
			sbOS = sbOS+" [logical guess]"
		} else {
			// add in notation if this is a known metric
			sbOS = sbOS+" [known metric]"
		};
	};
	// add in zoom info if relevant
	if (jsZoom == 100) {} else { sbZoom = " at "+jsZoom+"% "};
	dom.scrollbarWidth = sbWidth+"px " + sbZoom + sbOS;
	let t1 = performance.now();
	if (mPerf) {console.debug("ua scrollbar: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};

	// os: css line-height
	t0 = performance.now();
	// get line-height
	let myLHElem = document.getElementById("spanLH");
	let lh = getComputedStyle(myLHElem).getPropertyValue("line-height");
	let lhCR = "";
	// bugzilla 1536871: fall back to clientrect: use div height
	if (lh == "normal") {
		let testLHdiv = document.getElementById("divLH");
		let elementDiv = testLHdiv.getBoundingClientRect();
		let newlh = elementDiv.height;
		// more than 4 decimal places
		if (decimal_count(newlh) > 4) {
			newlh = newlh.toFixed(4);
		};
		lh = newlh.toString();
		lhCR = " <span class='neutral'>[clientrect]</span> normal <span class='good'>[getComputedStyle]</span>";
		// todo: detect clientrect randomizing
	};
	// trim off "px" if it exists
	if (lh.substr(-2) == "px") {
		lh = lh.slice(0, -2);
	};
	let lhOS = "";
	let strTBL = " [Linux]" + tor_browser_green;
	let myLHFont = getComputedStyle(myLHElem).getPropertyValue("font-family");
	if (myLHFont.slice(1,16) !== "Times New Roman") {
		// document fonts blocked: TNR might not be used
		lhOS = " <span class='bad'> [document fonts are disabled]</span>";
	} else if (lh == "19.2") {
		// TB: 19.2px seems to be unique to TB at any zoom on any platform
		lhOS = tor_browser_green;
	} else {
		// using TNR and not TB's 19.2
		// detect WINDOWS / LINUX
		if (jsZoom == 300) {
			if (lh=="19") {lhOS=strW};
			if (lh=="18.6667") {lhOS=strW};
			if (lh=="18") {lhOS=strL};
			if (lh=="17.6667") {lhOS=strL};
		} else if (jsZoom == 240) {
			if (lh=="19.1667") {lhOS=strW};
			if (lh=="19") {lhOS=strTBL};
			if (lh=="18.3333") {lhOS=strWL};
			if (lh=="17.5") {lhOS=strL};
		} else if (jsZoom == 200) {
			if (lh=="19") {lhOS=strW};
			if (lh=="18") {lhOS=strL};
		} else if (jsZoom == 170) {
			if (lh=="19.25") {lhOS=strW};
			if (lh=="18.9") {lhOS=strTBL};
			if (lh=="18.6667") {lhOS=strW};
			if (lh=="18.0833") {lhOS=strL};
			if (lh=="17.5") {lhOS=strL};
		} else if (jsZoom == 150) {
			if (lh=="20") {lhOS=strW};
			if (lh=="18.6667") {lhOS=strWL};
			if (lh=="17.3333") {lhOS=strL};
		} else if (jsZoom == 133) {
			if (lh=="19.5") {lhOS=strW};
			if (lh=="18.9") {lhOS=strTBL};
			if (lh=="18") {lhOS=strL};
			if (lh=="18.75") {lhOS=strW};
		} else if (jsZoom == 120) {
			if (lh=="20") {lhOS=strW};
			if (lh=="19.1667") {lhOS=strL};
			if (lh=="19") {lhOS=strTBL};
			if (lh=="18.3333") {lhOS=strW};
			if (lh=="17.5") {lhOS=strL};
		} else if (jsZoom == 110) {
			if (lh=="19.25") {lhOS=strW};
			if (lh=="18.7") {lhOS=strTBL};
			if (lh=="18.3333") {lhOS=strL};
			if (lh=="17.4167") {lhOS=strL};
		} else if (jsZoom == 100) {
			if (lh=="20") {lhOS=strW};
			if (lh=="19") {lhOS=strL};
			if (lh=="18") {lhOS=strW};
			if (lh=="17") {lhOS=strL};
		} else if (jsZoom == 90) {
			if (lh=="20.1") {lhOS=strW};
			if (lh=="18.9833") {lhOS=strWL};
			if (lh=="18.7667") {lhOS=strTBL};
			if (lh=="16.75") {lhOS=strL};
		} else if (jsZoom == 80) {
			if (lh=="20") {lhOS=strW};
			if (lh=="19.5") {lhOS=strTBL};
			if (lh=="18.75") {lhOS=strWL};
		} else if (jsZoom == 67) {
			if (lh=="21") {lhOS=strW};
			if (lh=="19.8") {lhOS=strTBL};
			if (lh=="19.5") {lhOS=strWL};
			if (lh=="18") {lhOS=strL};
		} else if (jsZoom == 50) {
			if (lh=="22") {lhOS=strW};
			if (lh=="20") {lhOS=strWL};
			if (lh=="18") {lhOS=strL};
		} else if (jsZoom == 30) {
			if (lh=="20") {lhOS=strWL};
			if (lh=="26.6667") {lhOS=strW};
		};
	};
	// detect MAC
	if (lhOS == "") {
	/*	mac unique: .0167 .05 .0833 .1833 .35 .4333 .6833 .8333 .85
	mac not unique: .7667 .6667 (but unique at those zoom values)
	19.5167 : from old hackernews */
		let lhDec = (lh+"").split(".")[1];
		if (lhDec=="0167" | lhDec=="05" | lhDec=="0833" | lhDec=="1833" | lhDec=="35" | lhDec=="4333" | lhDec=="6833"
			| lhDec=="8333" | lhDec=="85" | lhDec=="7667" | lhDec=="6667" | lhDec=="5167") {lhOS=strM};
	};
	// detect ANDROID
	if (lhOS == "") {if (lh == "19.5") {lhOS = strA}};
	// still blank? and add logical guess or known metric
	if (lhOS == "") {
		lhOS = "[Linux] [logical guess]"
	} else {
		if (myLHFont.slice(1,16) == "Times New Roman") {
			lhOS = lhOS + " [known metric]"
		};
	};
	// output: sbZoom was already set in scrollbar width code
	dom.cssLH.innerHTML = lh + "px " + sbZoom + lhOS + lhCR;
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
		// OS logic: just use the first item to detect OS
		if (i == 1) {
			if (wdFFN.slice(0,12) == "MS Shell Dlg") {wdOS = "Windows"}
			else if (wdFFN == "Roboto") {wdOS="Android"}
			else if (wdFFN == "-apple-system") {wdOS="Mac"}
			else {wdOS="Linux"};
			// set global var isMajorOS
			isMajorOS = wdOS.toLowerCase();
			// set the two font list hyperlinks
			dom.small_fontList.innerHTML = "<span class='no_color'><a href='txt/fonts_" + isMajorOS +
				"_small.txt' target='blank' class='blue'>fonts_" + isMajorOS + "_small<a></span>";
			dom.all_fontList.innerHTML = "<span class='no_color'><a href='txt/fonts_" + isMajorOS +
				"_all.txt' target='blank' class='blue'>fonts_" + isMajorOS + "_all<a></span>";
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
	dom.widgetOS = wdOS;
	dom.widgetH = sha1(wdH);
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

/* USER TESTS */

function get_tbh() {
	// only do if android
	// this is to capture the toolbar height if the user has chosen
	// to "hide the toolbar when scrolling down a page"
	if (isMajorOS == "android") {
		window.addEventListener('scroll', toolbarScroll)
		function toolbarScroll() {
			// avh = global var with toolbar. If we only use a new value greater
			// than avh then this would exclude the keyboard interfering with calculations
			// we only need to check once since the viewport size "snaps" to the new value
			// ignore fullscreen
			if (window.fullScreen == false) {
				// add a delay to let the user finish scrolling and the toolbar to show
				setTimeout(function() {
					let vh_new = get_viewport();
					if (vh_new > avh) {
						dom.tbh = (vh_new - avh);
					};
				}, 1000)
			};
		};
	};
};

function get_kbh() {
	// only do if android
	if (isMajorOS == "android") {
		// we use the viewport height as that doesn't change with zooming on android
		// wait for keyboard to slide up
		setTimeout(function() {
			let vh_new = get_viewport();
			// On android, the onfocus event is also triggered when the input
			// field loses focus: always make the difference positive.
			// We use the initial avh global var captured on first load as
			// the toolbar can also be triggered into becoming visible if hidden.
			// note: if in FS, entering the text field exits FS, so we can rely on avh
			let vh_diff = Math.abs(avh - vh_new);
			dom.kbh = vh_diff;
			// this is not perfect, as the keyboard can be slow to open, and it
			// "slides" up. Instead we could keep checking for x time and return
			// the maximum diff
		}, 1000)
	};
};

function goFS() {
	if (isFirefox == true) {
		let wh1 = window.innerHeight,
			winFSw = "",
			winFSh = "";
		function exitFS() {
			if (isVersion > 63) {
				document.exitFullscreen();
			} else {
				document.mozCancelFullScreen();
			};
			if (isMajorOS == "android") {
				document.removeEventListener("mozfullscreenchange", getFS_android)
			} else {
				document.removeEventListener("mozfullscreenchange", getFS_desktop)
			};
		};
		function getFS_android() {
			// android: delay required
			if ( document.mozFullScreen ) {
				setTimeout(function(){
					winFSw = document.mozFullScreenElement.clientWidth;
					winFSh = document.mozFullScreenElement.clientHeight;
					dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+winFSw+" x "+winFSh+" [mozFullScreenElement client]";
					exitFS();
				}, 1000);
			};
		};
		function getFS_desktop() {
			// desktop
			if ( document.mozFullScreen ) {
				winFSw = document.mozFullScreenElement.clientWidth;
				winFSh = document.mozFullScreenElement.clientHeight;
				dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+winFSw+" x "+winFSh+" [mozFullScreenElement client]";
				exitFS();
				// TB warning panel
				if (isTorBrowser) {
					setTimeout(function(){
						let wh2 = window.innerHeight;
						let panel = wh1-wh2;
						if (panel !== 0) {
							dom.fsLeak.innerHTML = dom.fsLeak.textContent + "<br>" + panel + "px [warning panel height]";
						};
					}, 600);
				};
			};
		};
		if (document.mozFullScreenEnabled) {
			let element = document.getElementById("imageFS");
			if (isMajorOS == "android") {
				element.mozRequestFullScreen();
				document.addEventListener("mozfullscreenchange", getFS_android)
			} else {
				// desktop: eliminate all delays possible to beat the warning panel
				// gradually eating height: hence FS request after android check
				element.mozRequestFullScreen();
				document.addEventListener("mozfullscreenchange", getFS_desktop)
			};
		};
	};
};

function goNW() {
	let newWin = window.open("newwin.html","","width=9000,height=9000");
	let a = newWin.outerWidth,
		b = newWin.outerHeight,
		c = newWin.innerWidth,
		d = newWin.innerHeight;
	let newWinLeak = c + " x " + d + " [inner] " + a + " x " + b + " [outer]";
	if (isMajorOS == "android") {
		if (d > firstH) {
			// firstH was with the toolbar
			newWinLeak = c + " x " + d + " [inner] [toolbar hidden] " + a + " x " + b + " [outer]";
		} else if (d == firstH) {
			// they should be the same
			newWinLeak = c + " x " + d + " [inner] [toolbar visible] " + a + " x " + b + " [outer]";
		};
	};
	// there is no clamping in TB for Android yet
	if (newWinLeak == "10 x 10 [inner] 10 x 10 [outer]") {newWinLeak = newWinLeak + tor_browser_green};
	dom.newWinLeak.innerHTML = newWinLeak;
};

/* OUTPUT */

function outputScreen() {
	let t0 = performance.now();
	// properties
	get_screen_metrics("screen");
	dom.PixDepth = screen.pixelDepth;
	dom.ColDepth = screen.colorDepth;
	dom.DevPR = window.devicePixelRatio;
	// functions
	get_zoom("screen");
	get_viewport("screen");
	get_orientation();
	get_private_win();
	get_fullscreen();
	// android check
	if (isMajorOS == "android") {
		// global vars taken as early as possible = native resolution with FF toolbar
    // visible: e.g 360x559. New window: same but can if run with FF toolbar hidden: e.g 360x615
		dom.droidWin = firstW + " x " + firstH + " [inner] [toolbar visible]";
		// after a wait, compare to current in case we need to re-run screen metrics
		if (window.innerWidth == firstW) {
			setTimeout(function(){
				get_screen_metrics();
			}, 100);
		};
	};
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section screen: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	// start listening for dpr leaks
	get_dpr();
	// start listening for android toolbar height
	get_tbh();
};

function outputMath() {
	let t0 = performance.now();
	// variables: 1 = ecma1, 2 = ecma2, c = combined
	let r = "",
		h1 = "", // string to hash
		h6 = "",
		m1hash = "", // sha1 hashes
		m6hash = "",
		mchash = "",
		m1 = "", // short codes (used in analysis)
		m6 = "",
		mc = "",
		fdMath1 = "", // strings used for browser/os output
		fdMath6 = "";
	// ECMASCript 1st edtion
	r = Math.cos(1e251); dom.cos1 = r; h1 = r;
	r = Math.cos(1e140); dom.cos2 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e12);  dom.cos3 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e130); dom.cos4 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e272); dom.cos5 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e0);   dom.cos6 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e284); dom.cos7 = r; h1 = h1 + "-" + r;
	r = Math.cos(1e75);  dom.cos8 = r; h1 = h1 + "-" + r;
	m1hash = sha1(h1);
	// ECMASCript 6th edtion
	let x, y;
	x = 0.5; r = Math.log((1 + x) / (1 - x)) / 2; // atanh(0.5)
	dom.math1 = r; h6 = r;
	x=1; r = Math.exp(x) - 1; // expm1(1)
	dom.math2 = r; h6 = h6 + "-" + r;
	x = 1; y = Math.exp(x); r = (y - 1 / y) / 2; // sinh(1)
	dom.math3 = r; h6 = h6 + "-" + r;
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
		fdMath1="Windows";
		if (m6 == "1") {
			isTorBrowser = true;
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
	if (isFirefox == true) {
		let strNew = " <span class='bad'>[NEW]</span>";
		if (m1 == "") {m1hash=m1hash+strNew} else {m1hash=m1hash+" ["+m1+"]"};
		if (m6 == "") {m6hash=m6hash+strNew} else {m6hash=m6hash+" ["+m6+"]"};
		if (mc.length < 2) {mchash = mchash+strNew} else {mchash=mchash+" ["+mc+"]"};
		strNew = "<span class='bad'>I haven't seen this Firefox math combo before</span>";
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
	if (sPerf) {console.debug("  ** section math: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

function outputUA() {
	let t0 = performance.now();
	// redundant reset of global var
	if (isNaN(window.mozInnerScreenX) === false) {isFirefox = true};
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
	// also do the math section
	outputMath();
	// functions
	get_browser_errors();
	if (isFirefox == true){
		// FF only properties
		dom.fdetect="Firefox"; // already done with isFirefox
		dom.versionNo = get_version();
		// FF only functions
		get_os_line_scrollbar();
		get_browser_resource();
		get_os_widgets(); // note: currently sets global var isMajorOs
		get_os_chrome();  // note: improve: 300 to 400 ms on a setInterval
		get_os_font();    // note: improve: 3 sec timeout
	};
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section ua [excl chrome + font]: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputUA(); // must run before screen as it sets some global variables
outputScreen();
if (isMajorOS !== "android") {
	// desktop: start listening for resize events
	window.addEventListener('resize', get_screen_metrics);
} else {
	// android: unhide some screen results
	showhide("table-row", "S", "");
};
