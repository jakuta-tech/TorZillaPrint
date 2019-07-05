/* TABLE: Fonts */

'use strict';

/* unicode glyphs stuff */
var ugStyles = ["default", "sans-serif", "serif", "monospace", "cursive", "fantasy"];
var ugCodepoints = ['0x20B9','0x2581','0x20BA','0xA73D','0xFFFD','0x20B8','0x05C6','0x1E9E','0x097F','0xF003',
	'0x1CDA','0x17DD','0x23AE','0x0D02','0x0B82','0x115A','0x2425','0x302E','0xA830','0x2B06','0x21E4','0x20BD',
	'0x2C7B','0x20B0','0xFBEE','0xF810','0xFFFF','0x007F','0x10A0','0x1D790','0x0700','0x1950','0x3095','0x532D',
	'0x061C','0x20E3','0xFFF9','0x0218','0x058F','0x08E4','0x09B3','0x1C50','0x2619'];
var ugHeader = "  glyph        default     sans-serif          serif      monospace        cursive        fantasy<br>  -----";
var ugStr = "";
function ugReset(ugItem) {
	ugItem = "U+" + ugItem.substr(2);
	ugStr = ugStr + '<br>' + ugItem.padStart(7, ' ');
};
function ugClean() {
	ugStr = "";	ugCodepoints.forEach(ugReset); dom.fontUGFound.innerHTML = ugHeader + ugStr;
};
function stringFromCodePoint(n) {
	// String.fromCharCode doesn't support code points outside the BMP (it treats them as mod 0x10000)
  // String.fromCodePoint isn't supported.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
	if (n <= 0xffff) {
		return String.fromCharCode(n);
	} else {
		n -= 0x10000;
		return String.fromCharCode(0xd800 + (n >> 10), 0xdc00 + (n % 0x400));
	}
};

/* arthur's spawn code */
let spawn = (function () {
	// Declare ahead
	let promiseFromGenerator;
	// Returns true if aValue is a generator object.
	let isGenerator = aValue => {
		return Object.prototype.toString.call(aValue) === "[object Generator]";
	};
	// Converts the right-hand argument of yield or return values to a Promise,
	// according to Task.jsm semantics.
	let asPromise = yieldArgument => {
		if (yieldArgument instanceof Promise) {
			return yieldArgument;
		} else if (isGenerator(yieldArgument)) {
			return promiseFromGenerator(yieldArgument);
		} else if (yieldArgument instanceof Function) {
			return asPromise(yieldArgument());
		} else if (yieldArgument instanceof Error) {
			return Promise.reject(yieldArgument);
		} else if (yieldArgument instanceof Array) {
			return Promise.all(yieldArgument.map(asPromise));
		} else {
			return Promise.resolve(yieldArgument);
		}
	};
	// Takes a generator object and runs it as an asynchronous task,
	// returning a Promise with the result of that task.
	promiseFromGenerator = generator => {
		return new Promise((resolve, reject) => {
			let processPromise;
			let processPromiseResult = (success, result) => {
				try {
					let {value, done} = success ? generator.next(result)
						: generator.throw(result);
					if (done) {
						asPromise(value).then(resolve, reject);
					} else {
						processPromise(asPromise(value));
					}
				} catch (error) {
					reject(error);
				}
			};
			processPromise = promise => {
				promise.then(result => processPromiseResult(true, result),
					error => processPromiseResult(false, error));
			};
			processPromise(asPromise(undefined));
		});
	};
	// __spawn(generatorFunction)__.
	return generatorFunction => promiseFromGenerator(generatorFunction());
})();

function outputFonts1(){
	/* auto-run */
	/*** unicode glyphs */
	/* FONT GLYPHS Fifield and Egelman (2015)	https://www.bamsoftware.com/talks/fc15-fontfp/fontfp.html#demo*/
	// load an iframe, listen for it, reset ugStr, run tests
	//iframeFG
	var iframeFG = document.getElementById("iframeFG");
	iframeFG.src = "iframes/unicodeglyphs.html";
	iframeFG.addEventListener("load", function(){
		var ugDiv = iframeFG.contentWindow.document.getElementById("ugDiv");
		var ugSpan = iframeFG.contentWindow.document.getElementById("ugSpan");
		var ugSlot = iframeFG.contentWindow.document.getElementById("ugSlot");
		// run the test
		ugStr = ""; var iUG = 0; var jUG = 0;	var ugW = ""; var ugH = "";	var ugC = "";
		for ( ; iUG < ugCodepoints.length; iUG++) {
			var nUG = ugCodepoints[iUG];
			var cUG = stringFromCodePoint(nUG);
			var ugC = "U+" + nUG.substr(2);
			ugC = ugC.padStart(7, ' ');
			ugStr = ugStr + "<br>" + ugC;
			for ( ; jUG < ugStyles.length; jUG++) {
				var style = ugStyles[jUG];
				ugSlot.style.fontFamily = style === "default" ? "" : style;
				ugSlot.textContent = cUG;
				ugW = ugSpan.offsetWidth; ugW = ugW.toString(); ugW = ugW.padStart(4, ' ');
				ugH = ugDiv.offsetHeight; ugH = ugH.toString(); ugH = ugH.padStart(4, ' ');
				ugStr = ugStr + "    " + ugW + " × " + ugH;
			}
			jUG = 0; // reset style counter
		}
		dom.fontUGFound.innerHTML = ugHeader + ugStr;
		dom.fontUG = sha1(ugStr);
	});

	/*** defaults */
	dom.fontFCprop = window.getComputedStyle(document.body,null).getPropertyValue("font-family");
	var iframeFC = document.getElementById("iframeFC");
	iframeFC.src = "iframes/fontcheck.html";
	iframeFC.addEventListener("load", function(){
		var dfItem = iframeFC.contentWindow.document.getElementById("df1");
		var dfProp = "serif/sans-serif: " + getComputedStyle(dfItem).getPropertyValue("font-size");
		dfItem = iframeFC.contentWindow.document.getElementById("df3");
		dfProp = dfProp + " | monospace: " + getComputedStyle(dfItem).getPropertyValue("font-size");
		dom.fontFCsize = dfProp;

		/*** gfx.downloadable_fonts.woff2.enabled */
		setTimeout(function(){
			dfItem = iframeFC.contentWindow.document.getElementById("fnt0");
			dfProp = dfItem.offsetWidth;
			dfItem = iframeFC.contentWindow.document.getElementById("fnt1");
			if (dfProp == dfItem.offsetWidth) {dom.fontWoff2="disabled [or blocked]"} else {dom.fontWoff2="enabled"};
		}, 400);
	});

	/*** document fonts	*/
	var myLHElem = document.getElementById("testLH");
	var myLHFont = getComputedStyle(myLHElem).getPropertyValue("font-family");
	if (myLHFont.slice(1,16) !== "Times New Roman") {dom.fontDoc="disabled"} else {dom.fontDoc="enabled"};

	/*** layout.css.font-loading-api.enabled */
	dom.fontCSS = 'FontFace' in window ? 'enabled' : 'disabled';
}

outputFonts1();

function outputFonts2(){
	/* not auto-run */

	/* clear, reset, or change font color to hide results: try not to shrink/grow elements */
	document.getElementById("fontFBFound").style.color = "#1a1a1a";

	/* ARTHUR'S TEST: ENUMERATE FONTS
		 https://github.com/arthuredelstein/tordemos */
	var iframeFF = document.getElementById("iframeFF");
	iframeFF.src = "iframes/fontfallback.html";
	iframeFF.addEventListener("load", function(){
		dom.fontFB = "test is running... please wait";
		var fontFBTest = iframeFF.contentWindow.document.getElementById("fontFBTest");
		fontFBTest.style.fontSize = "256px";
		// return width of the element with a given fontFamily
		let measureWidthForFont = function (fontFamily) {
			fontFBTest.style.fontFamily = fontFamily;
			return fontFBTest.offsetWidth;
		};
		// standard width for the text string with fallback font
		let width0 = null;
		// determines whether a code point is available
		let isFontPresent = function (fontName) {
			// Measure the font width twice: once with serif as fallback and once with sans-serif
			// as fallback. Under the assumption that serif and sans-serif have different widths,
			// only if the font is present will the resulting widths be equal.
			width0 = width0 || measureWidthForFont("fontFallback");
			let width1 = measureWidthForFont("'" + fontName + "', fontFallback");
			return width0 !== width1;
		};
		// Takes a list of possible fonts, and returns fonts present
		var fontfbYes = 0; var fontfbAll = 0;
		let enumerateFonts = function (possibleFonts) {
			let fontsPresent = [];
			for (let font of possibleFonts) {
				if (isFontPresent(font)) {fontsPresent.push(font); fontfbYes++;}
				fontfbAll++;
			}
			return [fontsPresent];
		};
		// return a list
		let htmlFontList = function (fonts) {
			let list = "";
			for (let font of fonts) {list += font + ", ";}
			return list;
		};
		// read a text file and returns a promise resolving to the contents.
		let readTextFile = function (filename) {
			return new Promise(function (resolve) {
				let xhr = new XMLHttpRequest();
				xhr.overrideMimeType("text/plain; charset=utf-8");
				xhr.open("GET", filename);
				xhr.addEventListener("load", function () {
					resolve(xhr.responseText);
				});
				xhr.send();
			});
		};
		// retrieves a set of code points that are representative
		// of the various unicode blocks.xf
		let retrieveCodePoints = function* () {
			let text = yield readTextFile("txt/fontFallbackUnicodeBlocks.txt");
			let codePoints = text
				.split("\n")
				.map(s => s.trim())
				.filter(s => s.length > 0)
				.map(x => parseInt(x))
				.map(x => x + 1);
			codePoints[0] = 77;
			return codePoints;
		};
		// return promise resolving to an array of fonts from a predefined list
		let retrieveFontList = function* () {
			let text = yield readTextFile("txt/fontFallbackList.txt");
			return text.split("\n").filter(s => s.length > 0);
		};
		// run the test
		spawn(function* () {
			let codePoints = yield retrieveCodePoints();
			let testString = codePoints.map(x => String.fromCodePoint(x)).join("</span>\n<span>");
			fontFBTest.innerHTML = testString;
			let fontList = yield retrieveFontList();
			// make sure list/fallback font are loaded
			setTimeout(function(){
				var [fontsPresent] = enumerateFonts(fontList);
				var strFontFB = htmlFontList(fontsPresent);
				// if we have detected at least one font, remove trailing comma and space
				if (fontfbYes > 0) {
					strFontFB = strFontFB.slice(0, -2);
					dom.fontFBFound.innerHTML = strFontFB; }
				else { dom.fontFBFound.innerHTML = "no fonts detected"};
				var fontFBhash = sha1(strFontFB);
				// TB windows FP
				var fntTB = "";
				if (fontFBhash == "1389aaf4c97027b8157c5fb9ef5ed6f141a6b8a1" | fontFBhash == "77ee9c373e698fe9c8b381446a380389914ff294") {
					fntTB = "[Win10 64bit]"}
				else if (fontFBhash == "ad4ccd607603041d3e89aa8e03e2e203fc184653" | fontFBhash == "63b78ed9fe8ba9a932a2adfc924c2e2d49d04fce") {
					fntTB = "[Win7 64bit]"}
				else if (fontFBhash == "bcba63ce9e2983dd1b97cf221fc8f860a1a7617f" | fontFBhash == "9e5d39b4542cd5e2a19f73b8fa566e679fa561e5") {
					fntTB = "[Win7 32bit]"};
				if (fntTB !== "") {fntTB="<span class='bad'>"+fntTB+"</span>"};
				// TB other FP
				if (fontFBhash == "09a4ee037c9082b9b8f0b7ae981c656d517faffa") {fntTB="[Linux]"}
				else if (fontFBhash == "4094aedc000205c711385fad32827e60462976dc") {fntTB="[Mac]"};
				if (fntTB !== "") {fntTB=fntTB+TBy};
				// output and reset color
				dom.fontFB.innerHTML = fontFBhash + " ["+fontfbYes+"/"+fontfbAll+"]"+" "+fntTB;
				document.getElementById("fontFBFound").style.color = "#b3b3b3";
				// finally, retitle the button */
				dom.fontRun = "[ re-run tests ]";
			}, 1000);
		});
	});

	/* FINGERPRINTJS2 https://valve.github.io/fingerprintjs2/ */


};
