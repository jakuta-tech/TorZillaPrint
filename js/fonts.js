/* TABLE: Fonts */

'use strict';

/* unicode glyph globals */
var ugStyles = ["default", "sans-serif", "serif", "monospace", "cursive", "fantasy"];
var ugCodepoints = ['0x20B9','0x2581','0x20BA','0xA73D','0xFFFD','0x20B8','0x05C6','0x1E9E','0x097F','0xF003',
	'0x1CDA','0x17DD','0x23AE','0x0D02','0x0B82','0x115A','0x2425','0x302E','0xA830','0x2B06','0x21E4','0x20BD',
	'0x2C7B','0x20B0','0xFBEE','0xF810','0xFFFF','0x007F','0x10A0','0x1D790','0x0700','0x1950','0x3095','0x532D',
	'0x061C','0x20E3','0xFFF9','0x0218','0x058F','0x08E4','0x09B3','0x1C50','0x2619'];
var ugHeader = "  glyph        default     sans-serif          serif      monospace        cursive        fantasy<br>  -----";
var fontTestSize = "256px";
var fontTestStringA = "mmLLmmmmmwwwmmmlli";
var fontTestStringB = ""; // the one built from codepoints
var fontList = [];

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

function reset_unicode() {
	// resets the display with no measurements
	let str = "";
	for (let i = 0 ; i < ugCodepoints.length; i++) {
		let ugCode = "U+" + ugCodepoints[i].substr(2);
		str = str + '<br>' + ugCode.padStart(7, ' ');
	};
	dom.fontUGFound1.innerHTML = ugHeader + str;
};

function output_unicode() {
	/* UNICODE GLYPHS
	code based on work by David Fifield and Serge Egelman (2015)
	https://www.bamsoftware.com/talks/fc15-fontfp/fontfp.html#demo
	*/

	// clear any previous results
	reset_unicode();

	// initiate variables
	let ugDiv = dom.ugDiv,
		ugSpan = dom.ugSpan,
		ugSlot = dom.ugSlot,
		ugWide = "",
		ugHigh = "",
		ugCode = "",
		ugHashOffset = "", // the string we hash
		ugHashClientRect = "",
		ugOutputOffset = "", // the string we display
		ugOutputClientRect = "";

	// cycle each unicode (i)
	for (let i = 0 ; i < ugCodepoints.length; i++) {
		let n = ugCodepoints[i]; // codepoint
		let c = stringFromCodePoint(n); // character

		// add unicode to outputs: e.g U+20B9
		let ugCode = "U+" + n.substr(2);
		ugHashOffset = ugHashOffset + "-" + ugCode;
		ugHashClientRect = ugHashClientRect + "-" + ugCode;
		ugCode = ugCode.padStart(7, ' ');
		ugOutputOffset = ugOutputOffset + "<br>" + ugCode;
		ugOutputClientRect = ugOutputClientRect + "<br>" + ugCode;

		// cycle each style (j)
		for (let j = 0 ; j < ugStyles.length; j++) {
			let style = ugStyles[j];
			ugSlot.style.fontFamily = style === "default" ? "" : style;
			ugSlot.textContent = c;

			// Read the span width, but the div height. Firefox always reports the same value
			// for the span's offsetHeight, even if the div around it is changing size

			// offset measurement + concatenate hash string
			ugWide = ugSpan.offsetWidth; ugHigh = ugDiv.offsetHeight;
			ugHashOffset = ugHashOffset + "-"+ugWide+"-"+ugHigh+"-";
			// offset output
			ugWide = ugWide.toString(); ugWide = ugWide.padStart(4, ' ');
			ugHigh = ugHigh.toString(); ugHigh = ugHigh.padStart(4, ' ');
			ugOutputOffset = ugOutputOffset + "    " + ugWide + " × " + ugHigh;

			// clientrect measurement + concatenate hash string
			let elementDiv = ugDiv.getBoundingClientRect();
			let elementSpan = ugSpan.getBoundingClientRect();
			ugWide = elementSpan.width;
			ugHigh = elementDiv.height;
			ugHashClientRect = ugHashClientRect + "-"+ugWide+"-"+ugHigh+"-";
			// clientrect output
			// ugOutputClientRect = ugOutputClientRect + " " + ugWide + " × " + ugHigh + " | ";
		}
	}
	// clear div causing horizontal scroll
	dom.ugSlot = "";
	// output results
	dom.fontUGFound1.innerHTML = ugHeader + ugOutputOffset;
	dom.fontUG1 = sha1(ugHashOffset);
	dom.fontUG2 = sha1(ugHashClientRect);

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

function output_enumerate_fallback(type){
	/* ARTHUR'S TEST: ENUMERATE FONTS
	https://github.com/arthuredelstein/tordemos
	*/

	// initialize
	let width0 = null,  // standard width for the text string with fallback font
		outputString = "",// detected fonts output
		outputCount = 0;  // detected fonts count
	let fontFBTest = dom.fontFBTest;
	fontFBTest.style.fontSize = fontTestSize;

	// assign elements to output to
	let outputB = document.getElementById(type+"_fontFB"),    // fallback hash
		outputD = document.getElementById(type+"_fontFBFound"); // fallback detected

	// return width of the element with a given fontFamily
	let measureWidthForFont = function (fontFamily) {
		fontFBTest.style.fontFamily = fontFamily;
		return fontFBTest.offsetWidth;
	};

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
	let enumerateFonts = function (possibleFonts) {
		for (let font of possibleFonts) {
			if (isFontPresent(font)) {
				outputString = outputString + font + ", ";
				outputCount++;
			}
		}
	};

	// offset this from fpjs2 or they output at the same time
	setTimeout(function() {

		// we built this string earlier from codepoints
		// console.log(fontTestStringB.length);
		fontFBTest.innerHTML = fontTestStringB;

		// run the test
		enumerateFonts(fontList);

		// output detected fonts
		if (outputCount > 0) {
			// remove trailing comma + space
			outputString = outputString.slice(0, -2);
			outputD.innerHTML = outputString;
		}	else {
			outputD.innerHTML = "no fonts detected"
		};
		// output hash/counts
		outputB.innerHTML = sha1(outputString) + " ["+outputCount+"/"+fontList.length+"]";
		// note if file:// since [this affects the result]
		if ((location.protocol) == "file:") {
			outputB.innerHTML = outputB.textContent + note_file
		}
		// reset color
		outputD.style.color = "#b3b3b3";
		// clear div [causes horizontal scroll]
		dom.fontFBTest = "";

	}, 200);

};

function output_enumerate_fpjs2(type) {
	/* 
	http://www.lalit.org/lab/javascript-css-font-detect/
	https://github.com/Valve/fingerprintjs2
	*/

	// initialize variables
	let baseFonts = ['monospace','sans-serif','serif'],
		outputString = "",// detected fonts output
		outputCount = 0;  // detected fonts count
	// assign elements to output to
	let outputA = document.getElementById(type+"_fontFPJS2"), // fpjs2 hash
		outputC = document.getElementById(type+"_fontFPJS2Found"); // fpjs2 detected

	// the real test starts here
	let h = document.getElementsByTagName('body')[0]
	// div to load spans for the base fonts
	let baseFontsDiv = document.createElement('div')
	// div to load spans for the fonts to detect
	let fontsDiv = document.createElement('div')
	let defaultWidth = {}
	let defaultHeight = {}
	// creates a span where the fonts will be loaded
	let createSpan = function () {
		let s = document.createElement('spanFP')
		// hide the span
		s.style.position = "absolute"
		s.style.left = "-9999px"
		// normalize the span
		s.style.fontSize = "256px"
		s.style.fontStyle = "normal"
		s.style.fontWeight = "normal"
		s.style.letterSpacing = "normal"
		s.style.lineBreak = "auto"
		s.style.lineHeight = "normal"
		s.style.textTransform = "none"
		s.style.textAlign = "left"
		s.style.textDecoration = "none"
		s.style.textShadow = "none"
		s.style.whiteSpace = "normal"
		s.style.wordBreak = "normal"
		s.style.wordSpacing = "normal"
		// use m or w = maximum width | use LLi so same matching fonts can get separated
		s.innerHTML = fontTestStringA
		return s
	}
	// creates a span and load the font to detect and a base font for fallback
	let createSpanWithFonts = function (fontToDetect, baseFont) {
		let s = createSpan()
		s.style.fontFamily = "'" + fontToDetect + "'," + baseFont
		return s
	}
	// creates spans for the base fonts and adds them to baseFontsDiv
	let initializeBaseFontsSpans = function () {
		let spans = []
		for (let index = 0, length = baseFonts.length; index < length; index++) {
			let s = createSpan()
			s.style.fontFamily = baseFonts[index]
			baseFontsDiv.appendChild(s)
			spans.push(s)
		}
		return spans
	}
	// creates spans for the fonts to detect and adds them to fontsDiv
	let initializeFontsSpans = function () {
		let spans = {}
		for (let i = 0; i < fontList.length; i++) {
			let fontSpans = []
			for (let j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
				let s = createSpanWithFonts(fontList[i], baseFonts[j])
				fontsDiv.appendChild(s)
				fontSpans.push(s)
			}
			spans[fontList[i]] = fontSpans // Stores {fontName : [spans for that font]}
		}
		return spans
	}
	// checks if a font is available
	let isFontAvailable = function (fontSpans) {
		let detected = false
		for (let i = 0; i < baseFonts.length; i++) {
			detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]])
			if (detected) {return detected;}
		}
		return detected;
	}
	// create spans for base fonts
	let baseFontsSpans = initializeBaseFontsSpans()
	// add the spans to the DOM
	h.appendChild(baseFontsDiv)
	// get the default width for the three base fonts
	for (let index = 0, length = baseFonts.length; index < length; index++) {
		defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth // width for the default font
		defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight // height for the default font
	}
	// create spans for fonts to detect
	let fontsSpans = initializeFontsSpans()
	// add all the spans to the DOM
	h.appendChild(fontsDiv)
	// check available fonts
	let available = []
	for (let i = 0 ; i < fontList.length; i++) {
		if (isFontAvailable(fontsSpans[fontList[i]])) {
			fontList[i]
			available.push(fontList[i]);
			outputCount++;
			outputString = outputString + ", " + fontList[i];
		}
	}
	// remove spans from DOM
	h.removeChild(fontsDiv)
	h.removeChild(baseFontsDiv)

	// output detected fonts
	if (outputCount > 0) {
		// remove trailing comma + space
		outputString = outputString.slice(2);
		outputC.innerHTML = outputString;
	}	else {
		outputC.innerHTML = "no fonts detected"
	};
	// output hash/counts
	outputA.innerHTML = sha1(outputString) + " ["+outputCount+"/"+fontList.length+"]";
	// note if file://
	if ((location.protocol) == "file:") {
		outputA.innerHTML = outputA.textContent + note_file
	}
	// reset color
	outputC.style.color = "#b3b3b3";

};


function outputFonts1(){
	/* auto-run */

	// unicode glyphs
	output_unicode();

	// default proportional font
	dom.fontFCprop = window.getComputedStyle(document.body,null).getPropertyValue("font-family");

	// default font sizes
	dom.df1 = fontTestStringA;
	dom.df2 = fontTestStringA;
	dom.df3 = fontTestStringA;
	let font_item = dom.df1;
	let font_property = "serif/sans-serif: " + getComputedStyle(font_item).getPropertyValue("font-size");
	font_item = dom.df3;
	font_property = font_property + " | monospace: " + getComputedStyle(font_item).getPropertyValue("font-size");
	dom.fontFCsize = font_property;

	// gfx.downloadable_fonts.woff2.enabled
	setTimeout(function() {
		let woff_item = dom.woff_fnt0;
		let woff_property = woff_item.offsetWidth;
		woff_item = dom.woff_fnt1;
		if (woff_property == woff_item.offsetWidth) {
			dom.fontWoff2="disabled [or blocked]"
		} else {
			dom.fontWoff2="enabled"
		};
	}, 500);

	// document fonts
	let element = document.getElementById("SPAN_LINEHEIGHT");
	let fontfamily = getComputedStyle(element).getPropertyValue("font-family");
	if (fontfamily.slice(1,16) !== "Times New Roman") {
		dom.fontDoc="disabled"
	} else {
		dom.fontDoc="enabled"
	};

	// layout.css.font-loading-api.enabled
	dom.fontCSS = 'FontFace' in window ? 'enabled' : 'disabled';

};

function outputFonts2(type){
	/* not auto-run */

	// reset
	fontList = [];
	// default: a larger list to should what happens without a whitelist
	let textfile = "fonts_all";
	// assign elements to output to
	let outputA = document.getElementById(type+"_fontFPJS2"), // fpjs2 hash
		outputB = document.getElementById(type+"_fontFB"),      // fallback hash
		outputC = document.getElementById(type+"_fontFPJS2Found"), // fpjs2 detected
		outputD = document.getElementById(type+"_fontFBFound");    // fallback detected

	// trap xhr/xmlhttp errors
	let	xhr_font_error = false,
		xhr_codepoint_error = false;

	// type: "small" (targeted) or "all" (large)
	// use type to set what elements we will output to
	// and also what text file to load
	if (type == "small") {
		// todo: fonts_ + type_ + os
		// here we assume a whitelist: so we only need
		// to focus on whitelisted families based on OS
		textfile = "fonts_small_test-win-example";

		// hyperlink the font list used
		dom.small_fontlist.innerHTML = "<span class='no_color'><a href='txt/" + textfile +
			".txt' target='blank' class='blue'>" + textfile + "<a></span>";
	};

	// output status
	outputA.innerHTML = "test is running... please wait";
	outputB.innerHTML = "test is running... please wait";

	// change font color to hide results: try not to shrink/grow elements
	outputC.style.color = "#1a1a1a";
	outputD.style.color = "#1a1a1a";

	// build array from text files
	function intoArray(lines) {
		// exclude blank lines by filtering length
		let lineArr = lines.split("\n").filter(s => s.length > 0);
		for (let k = 0 ; k < lineArr.length; k++) {
			fontList.push(lineArr[k]);
		}
	};
	function getData(filename) {
		return new Promise(function (resolve) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (filename == "codepoints") {
						resolve(xhr.responseText);
					} else {
						// must be a font list
						let lines = xhr.responseText;
						intoArray(lines);
					}
				}
			}
			xhr.onerror = function() {
				if (filename == "codepoints") {
					xhr_codepoint_error = true;
				} else {
					// must be a font list
					xhr_font_error = true;
				}
			};
			xhr.overrideMimeType("text/plain; charset=utf-8");
			xhr.open("GET", "txt/" + filename + ".txt", true);
			xhr.send();
		});
	};

	// retrieves a set of code points that are
	// representative of the various unicode blocks.xf
	let getCodePoints = function* () {
		let text = yield getData("codepoints");
		let codePoints = text
			.split("\n")
			.map(s => s.trim())
			.filter(s => s.length > 0)
			.map(x => parseInt(x))
			.map(x => x + 1);
		codePoints[0] = 77;
		return codePoints;
	};

	// start getting the codepoints first
	// only build it if we haven't already done so
	if (fontTestStringB.length == 0) {
		console.log("building fallback test string");
		spawn(function* () {
			// build the global string for font fallback test
			let codePoints = yield getCodePoints();
			fontTestStringB = codePoints.map(x => String.fromCodePoint(x)).join("</span>\n<span>");
		});
	};

	// start getting textfile after codepoints since
	// textfile can now be a much smaller targeted list
	getData(textfile);

	function run_enumerate() {
		if (xhr_font_error == false) {

			// sort fonts and remove duplicates
			fontList.sort();
			fontList = fontList.filter(function (font, position) {
				return fontList.indexOf(font) === position
			});
			// run fpjs2
			output_enumerate_fpjs2(type);

			if (xhr_codepoint_error == false) {
				// run fallback
				// now we also use targeted smaller font lists, we
				// should check the fallback test string has been set
				if (fontTestStringB.length == 0) {
					// todo: make sure the test runs rather than error
					outputB.innerHTML = "timed out: try again"
				} else {
					output_enumerate_fallback(type);
				}
			} else {
				// B=fallback hash, D=fallback detected
				if ((location.protocol) == "file:") {
					// file error
					outputB.innerHTML = error_file_cors;
				} else {
					// xhr error
					outputB.innerHTML = error_file_xhr;
				};
				// clear found fonts, reset color
				outputD.innerHTML = "";
				outputD.style.color = "#b3b3b3";
			}

		} else {
			// A+B=hashes , C+D=detected
			if ((location.protocol) == "file:") {
				// file error
				outputA.innerHTML = error_file_cors;
				outputB.innerHTML = error_file_cors;
			} else {
				// xhr error
				outputA.innerHTML = error_file_xhr;
				outputB.innerHTML = error_file_xhr;
			};
			// clear found fonts, reset color
			outputC.innerHTML = "";
			outputD.innerHTML = "";
			outputC.style.color = "#b3b3b3";
			outputD.style.color = "#b3b3b3";
		}
	};

	// keep checking if the list is loaded
	let lastvalue = 1,
		checkcount = 0;
	function check_enumerate() {
		if (xhr_font_error == true) {
			clearInterval(checking);
			run_enumerate()
		} else {
			if (lastvalue == fontList.length) {
				// we need the same result in succession
				clearInterval(checking);
				let filetime = ((checkcount+1) * 50);
				console.log("loading the text file took " + filetime + "ms");
				run_enumerate()
			} else if (fontList.length > 0) {
				// the array is underway
				lastvalue = fontList.length;
			}
		}
		if (checkcount > 51) {
			// that's 2.5s
			clearInterval(checking);
			// run it anyway, as it cleans up the output
			run_enumerate();
		}
		checkcount++;
	}
	let checking = setInterval(check_enumerate, 50)

};

outputFonts1();
