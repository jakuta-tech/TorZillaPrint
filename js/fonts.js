/* TABLE: Fonts */

'use strict';

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
	/* not auro-run */
	/* clear detail results with zero-length string */
	dom.fontFBFound = "";

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
				// output
				dom.fontFB.innerHTML = fontFBhash + " ["+fontfbYes+"/"+fontfbAll+"]"+" "+fntTB;
				// finally, retitle the button */
				dom.fontRun = "[ re-run tests ]";
			}, 1000);
		});
	});

	/* FINGERPRINTJS2 https://valve.github.io/fingerprintjs2/ */

	/* FONT GLYPHS Fifield and Egelman (2015) */

};
