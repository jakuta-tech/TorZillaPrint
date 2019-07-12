/* TABLES: Screen, User Agent, Math */

'use strict';

/* FUNCTIONS */

function getVerNo() {
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
	if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67" };
	//68
	let obj68 = document.getElementById('obj68');
	if (obj68.typeMustMatch == false) {} else {verNo="68+"}
	// reminder: append + on last test
	return verNo;
};

function getViewport() {
	let e=document.createElement( "div" );
	e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
	document.documentElement.insertBefore(e,document.documentElement.firstChild);
	let vw=e.offsetWidth,
		vh=e.offsetHeight;
	document.documentElement.removeChild(e);
	dom.Viewport = vw + " x " + vh;
	return vw;
};

function getZoom() {
	// js dpi
	const devicePixelRatio = window.devicePixelRatio || 1;
	const dpi_x = Math.round(dom.testdpi.offsetWidth * devicePixelRatio);
	const dpi_y = Math.round(dom.testdpi.offsetHeight * devicePixelRatio);
	dom.jsDPI = dpi_x;
	// matchmedia dpi: handles FF default zoom levels 30%-300%
	const varDPI = (function () {
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
	return jsZoom;
};

function browser_errors() {
	let errh = ""; // string we concat and hash
	// InternalError
	try {
		let err1 = new Array(1);
		function recurse(err1) {
			err1[0] = new Array(1);
			recurse(err1[0]);
		}
		recurse(err1);
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
	// TypeError
	try {
		function foobar() {
			let foo = document.getElementById("bar");
			foo.value = screen.width;
		}
		window.onload = foobar();
	} catch(e) {
		dom.err4=e;
		errh = errh+e
	};
	// TypeError
	try {
		var bar = new Date(bar[0].endDate).toISOString()
	} catch(e) {
		dom.err5=e;
		errh = errh+e
	};
	// URIError
	try {
		decodeURIComponent("%")
	} catch(e) {
		dom.err6=e;
		errh = errh+e
	};
	// error hash
	errh = sha1(errh);
	dom.errh = errh;
	if (errh == "7f5472aff63b6ed45eae2af94d1db8b729738d8b") {
		dom.fdError = "Firefox"
	};
};

function os_chrome() {
	// variables
	let b = "chrome://branding/content/",
		c = "chrome://browser/content/",
		s = "chrome://browser/skin/",
		os = "Linux", // default if we can't detect Windows/Android/Mac
		imgUris = [b+'icon64.png', s+'Toolbar-win7.png', s+'sync-horizontalbar-XPVista7.png'],
		cssUris = [c+'extension-win-panel.css', c+'extension-mac-panel.css'];
	// chrome:// images
	imgUris.forEach(function(imgUri) {
		let img = document.createElement("img");
		img.src = imgUri;
		img.style.height = "20px";
		img.style.width = "20px";
		img.onload = function() {
			if (imgUri === s+"Toolbar-win7.png" || imgUri === s+"sync-horizontalbar-XPVista7.png") {
				os ="Windows"
			};
		};
		img.onerror = function() {
			if (imgUri === b+"icon64.png") {
				os = "Android"
			};
		};
	});
	// chrome:// css
	cssUris.forEach(function(cssUri) {
		let css = document.createElement("link");
		css.href = cssUri;
		css.type = "text/css";
		css.rel = "stylesheet";
		document.head.appendChild(css);
		css.onload = function() {
			if (cssUri === c+"extension-win-panel.css") {
				os ="Windows"
			} else if (cssUri === c+"extension-mac-panel.css") {
				os ="Mac"
			};
		};
		document.head.removeChild(css);
	});
	// output: wait for all the resources to succeed/fail
	setTimeout(function() {
		dom.fdChromeOS = os
	}, 2000);
};

function os_widgets() {
	let iframe = document.getElementById("iframeWD");
	iframe.src = "iframes/widgets.html";
	iframe.addEventListener("load", function(){
		// varibles: 7 alt output, CS compare size, CF compare font, BS boolean size, BF boolean font
		let wdA = 1, wdFFN = "", wdFSZ = "", wdS = "", wdH = "", wdOS = "",
		wd7 = "", wdCS = "", wdCF = "", wdBS = false, wdBF = false;
		// loop 9 elements
		while (wdA < 10) {
			let wdItem = iframe.contentWindow.document.getElementById("widget"+wdA);
			wdFFN = getComputedStyle(wdItem).getPropertyValue("font-family");
			wdFSZ = getComputedStyle(wdItem).getPropertyValue("font-size");
			wdS = wdFFN + ", " + wdFSZ;
			// OS logic: just use the first item to detect OS
			if (wdA == 1) {
				if (wdFFN.slice(0,12) == "MS Shell Dlg") {wdOS = "Windows"}
				else if (wdFFN == "Roboto") {wdOS="Android"}
				else if (wdFFN == "-apple-system") {wdOS="Mac"}
				else {wdOS="Linux"};
			};
			// compare: values 1 to 7: should always be the same: track state
			if (wdA < 8) {
				// store previous values to compare: not even sure if these can be different
				wdCS = wdFSZ; wdCF = wdFFN;
				// build detailed output
					// test: trigger differences
					// if (wdA == 3) {wdFFN = "-apple-system"; wdFSZ="11px"}; // a: font + size change
					// if (wdA == 3) {wdFFN = "-apple-system";}; // b: font changes
					// if (wdA == 3) {wdFSZ="13px"}; // c: size changes
				if (wdA == 1) {wd7 = "        button: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 2) {wd7 = wd7+"<br>"+"      checkbox: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 3) {wd7 = wd7+"<br>"+"         color: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 4) {wd7 = wd7+"<br>"+"      combobox: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 5) {wd7 = wd7+"<br>"+"datetime-local: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 6) {wd7 = wd7+"<br>"+"         radio: "+wdFFN + ", " + wdFSZ}
				else if (wdA == 7) {wd7 = wd7+"<br>"+"          text: "+wdFFN + ", " + wdFSZ};
				// track if first seven items have any size or font differences
				if (wdA > 1) {if (wdFSZ == wdCS) {} else {wdBS = true}};
				if (wdA > 1) {if (wdFFN == wdCF) {} else {wdBF = true}};
			};
			// output individual results: concatenate string for hash
			document.getElementById("wid"+wdA).innerHTML = wdS;
			if (wdA == 1) {wdH = wdS} else {wdH = wdH + " - "+wdS};
			wdA++;
		};
		// output: detailed or combined
		if ( wdBF + wdBS > 0 ) {
			document.getElementById("widfirst").innerHTML = "various"
			document.getElementById("wid1").innerHTML = wd7;
			document.getElementById("wid1").style.fontFamily = "monospace, monospace";
		} else {
			document.getElementById("widfirst").innerHTML = "button|checkbox|color|combobox|datetime-local|radio|text";
			document.getElementById("wid1").style.fontFamily = "";
		};
		// cleanup os string
		if (wdBF == true) {wdOS = "unknown [font: mixed values]"} else {wdOS = wdOS + " [font: " + wdCF + "]"};
		// output OS and hash
		dom.widgetOS = wdOS;
		dom.widgetH = sha1(wdH);
	});
};

/* OUTPUT */

function outputScreen() {

	// screen/window
	dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
	dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
	dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
	dom.WndIn = window.innerWidth+" x "+window.innerHeight+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
	dom.PixDepth = screen.pixelDepth;
	dom.ColDepth = screen.colorDepth;
	dom.fsState = window.fullScreen;
	dom.DevPR = window.devicePixelRatio;

	// viewport
	getViewport();

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

	// private window
	try {
		let db = indexedDB.open("IsPBMode");
		db.onerror = function() {
			dom.IsPBMode="true"
		};
		db.onsuccess = function() {
			dom.IsPBMode="false"
		};
	} catch(e) {
		dom.IsPBMode="unknown: "+e.name
	};

	// orientation
	dom.ScrOrient = (function () {
		let orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
		if (orientation === "landscape-primary") return "landscape";
		if (orientation === "landscape-secondary") return "landscape upside down";
		if (orientation === "portrait-secondary" || orientation === "portrait-primary") return "portrait";
		if (orientation === undefined) return "undefined";
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

	// zoom related items
	getZoom();

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

function outputUA() {
	/* NAVIGATOR */
	dom.nAppName = navigator.appName;
	dom.nAppVersion = navigator.appVersion;
	dom.nBuildID = navigator.buildID;
	dom.nCodeName = navigator.appCodeName;
	dom.nOscpu = navigator.oscpu;
	dom.nPlatform = navigator.platform;
	dom.nProduct = navigator.product;
	dom.nProductSub = navigator.productSub;
	dom.nUserAgent = navigator.userAgent;

	/* USER AGENT */

	// browser: errors
	browser_errors();

	// only run these subsequent tests for Firefox
	if (amFF == true){

		// os: chrome://
		os_chrome();

		// browser: version
		dom.versionNo = getVerNo();

		// feature detection: already done with amFF
		dom.fdPaintCount="Firefox";

		// browser: chrome: Firefox
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
			if (imgLogoBW > 0) {dom.fdResource = "Tor Browser"};
			document.body.removeChild(imgLogoB);
		});

		// os: font: use width of the fdCssOS* elements
		// wait for font + slow Android + don't do on rerun css-based
		if (dom.fontOS.textContent == "") {
			setTimeout(function(){
				let elCount = 0, elCssOS = "Android";
				if (dom.fdCssOSW.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Windows"};
				if (dom.fdCssOSL.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Linux"};
				if (dom.fdCssOSM.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Mac"};
				if (elCount == 2 || elCount == 3) {elCssOS = "unknown"};
				dom.fontOS = elCssOS;
			}, 3000);
		};

		// os: strings
		let strW = "[Windows]",
			strWL = "[Windows or Linux]",
			strWM = "[Windows or Mac]",
			strWLM = "[Windows, Linux or Mac]",
			strL = "[Linux]",
			strLM = "[Linux or Mac]",
			strM = "[Mac]",
			strA = "[Android]";

		// get zoom value for scrollbar + css-lineheight
		jsZoom = getZoom();
		// os: scrollbar width
		let sbWidth = (window.innerWidth- getViewport());
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

		// os: css line-height
		// get line-height
		let myLHElem = document.getElementById("testLH");
		let lh = getComputedStyle(myLHElem).getPropertyValue("line-height")
		if (lh == "normal") {
			// FF69+ see bugzilla 1536871
			// output: sbZoom was already set in scrollbar width code
			dom.cssLH.innerHTML = lh + sbZoom + " <span class='good'> [bugzilla 1536871]</span>";
		} else {
			lh = lh.slice(0, -2);
			let lhOS = "";
			let strTBL = " [Linux]" + TBy;
			let myLHFont = getComputedStyle(myLHElem).getPropertyValue("font-family");
			if (myLHFont.slice(1,16) !== "Times New Roman") {
				// document fonts blocked: TNR might not be used
				lhOS = " <span class='bad'> [document fonts are disabled]</span>";
			} else if (lh == "19.2") {
				// TB: 19.2px seems to be unique to TB at any zoom on any platform
				lhOS= TBy;
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
			dom.cssLH.innerHTML = lh + "px " + sbZoom + lhOS;
		};

		// widgets
		os_widgets();

	};

};

function outputMath() {

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
	else if (m6hash == "9251136865b8509cc22f8773503288d106104634") {m6 = "3"}; // FF68+ changed exmp1(1)
	// known FF math1 hashes (os)
	if (m1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {m1 = "A"}
	else if (m1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {m1 = "B"}
	else if (m1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {m1 = "C"}
	else if (m1hash == "96895e004b623552b9543dcdc030640d1b108816") {m1 = "D"}
	else if (m1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {m1 = "E"}
	else if (m1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {m1 = "F"}
	else if (m1hash == "19df0b54c852f35f011187087bd3a0dce12b4071") {m1 = "G"};
	mc = m6+m1;

	// build browser output
	if (m6 == "1" | m6 == "3") {fdMath6="Firefox";}
	else if (m6 == "2") {fdMath6="Firefox [32-bit]"};
	// build os output, refine browser output
	if (m1 == "A") {fdMath1="Windows [64-bit]"; fdMath6="Firefox [64-bit]"}
	else if (m1 == "C") {fdMath1="Windows"; fdMath6="Firefox [32-bit]"}
	else if (m1 == "D") {fdMath1="Linux";
		if (m6 == "1" | m6 == "3") {fdMath1="Linux [64-bit]"}	else if (m6 == "2") {fdMath1="Linux [32-bit]"};}
	else if (m1 == "G") {fdMath1="Linux"}
	else if (m1 == "E") {fdMath1="Mac"; fdMath6="Firefox [64-bit]";}
	else if (m1 == "F") {fdMath1="Android"}
	else if (m1 == "B") {fdMath1="Windows";
		if (m6 == "1" | m6 == "3") {fdMath6="Tor Browser [64-bit]"; fdMath1="Windows [64-bit]";}
		else if (m6 == "2") {fdMath6="Tor Browser [32-bit]"};
	};

	// output browser/os
	if (amFF == true) {
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

};

outputScreen();
outputMath();
outputUA();

/* USER TESTS */

function getFS() {
	if ( document.mozFullScreen ) {
		let winFSw = document.mozFullScreenElement.clientWidth;
		let winFSh = document.mozFullScreenElement.clientHeight;
		dom.fsLeak = screen.width+" x "+screen.height+" [screen] "+winFSw+" x "+winFSh+" [mozFullScreenElement client]";
		if (getVerNo() > 63) {
			document.exitFullscreen();
		} else {
			document.mozCancelFullScreen();
		};
		document.removeEventListener("mozfullscreenchange", getFS)
	};
};
function goFS() {
	if (amFF == true) {
		if (document.mozFullScreenEnabled) {
			let elFS = document.getElementById("elFS");
			elFS.mozRequestFullScreen();
			document.addEventListener("mozfullscreenchange", getFS)
		}
	};
};

function goNW() {
	let newWin = window.open("newwin.html","","width=9000,height=9000");
	let newWinLeak = newWin.outerWidth +" x "+ newWin.outerHeight + " [outer] "
		+ newWin.innerWidth +" x "+ newWin.innerHeight + " [inner]";
	if (newWinLeak == "10 x 10 [outer] 10 x 10 [inner]") {newWinLeak = newWinLeak+TBy};
	dom.newWinLeak.innerHTML = newWinLeak;
};

function goNWTest() {
	let newWin = window.open("test.txt","","width=9000,height=9000");
	let newWinLeak = newWin.outerWidth +" x "+ newWin.outerHeight + " [outer] "
		+ newWin.innerWidth +" x "+ newWin.innerHeight + " [inner]";
	if (newWinLeak == "10 x 10 [outer] 10 x 10 [inner]") {newWinLeak = newWinLeak+TBy};
	dom.newWinTest.innerHTML = newWinLeak;
};
