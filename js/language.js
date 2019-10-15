/* TABLE: Language & Locale etc */

'use strict';

var dtd2 = "";

function get_app_lang_dtd1() {
	// we only call this function if iframes are not blocked
	// therefore if we get no result, this is the bugzilla fix
	let t0 = performance.now();
	let dtd1 = "";
	function output_dtd1(output) {
		dom.appLang2.innerHTML = output;
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("app language dtd1: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	}
	// load it up
	let iframe = document.getElementById("appLang_2"),
		dtdtemp = "";
	iframe.src="iframes/dtdlocale.xml";
	iframe.addEventListener('load', () => {
		try {
			dtd1 = iframe.contentDocument.getElementById("DTD1").innerText;
		} catch(e) {
			if ((location.protocol) == "file:") {
				// could be CORS, or the patch: check MediaDocument result
				setTimeout(function() {
					let str = dom.appLang4.textContent;
					if ( str == "[file:] [Cross-Origin Request Blocked]") {
						dtdtemp = error_file_cors
					} else if (str == "") {
						// this should never happen, we waited a whole second
						dtdtemp = "<span class='good'>[bugzilla 467035]</span> or " + error_file_cors;
					} else {
						dtdtemp = "<span class='good'>[bugzilla 467035]</span>";
					}
				}, 1000); // as long as we get this done before the check_dtd1 runs out
			};
		}
	});
	// keep checking for dtd1 not blank, but stop after x tries
	let counter = 0;
	function check_dtd1() {
		if (counter < 30) {
			if (dtd1 !== "") {
				clearInterval(checking);
				// if en-US then append good or bad
				if (navigator.language == "en-US") {
					// 4496d79dd1843c7c743647b45b4f0d76abf46bfe = the en-US error string
					if (sha1(dtd1) == "4496d79dd1843c7c743647b45b4f0d76abf46bfe") {
						dtd1 = enUS_green + dtd1;
					} else {
						dtd1 = enUS_red + dtd1;
					}
				}
				output_dtd1(dtd1);
			}
		} else {
			clearInterval(checking);
			if (dtdtemp == "") {
				dtdtemp = "<span class='good'>[bugzilla 467035]</span>";
			};
			output_dtd1(dtdtemp);
		}
		counter++;
	}
	let checking = setInterval(check_dtd1, 50)
};

function get_app_lang_dtd2() {
	let t0 = performance.now();

	// dtd nullprinciple
	dtd2 = "";
	function output_dtd2(output) {
		dom.appLang3.innerHTML = output;
		// unload iframe
		//iframe.src="";
		let t1 = performance.now();
		if (mPerf) {console.debug("app language dtd2: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
	// load it up
	let iframe = document.getElementById("appLang_3");
	iframe.src="data:application/xml;charset=utf-8,%3C%21DOCTYPE%20html%20SYSTEM%20%22chrome%3A%2F%2Fglobal%2Flocale%2FnetError.dtd%22%3E%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3Chead%3E%3Cmeta%20charset%3D%22utf-8%22%2F%3E%0D%0A%20%20%3C%2Fhead%3E%0D%0A%20%20%3Cbody%3E%3Cspan%20id%3D%22text-container%22%3E%26loadError.label%3B%3C%2Fspan%3E%0D%0A%20%20%3Cscript%3E%0D%0A%20%20window.addEventListener%28%27message%27%2C%20%28e%29%20%3D%3E%20%7B%0D%0A%20%20%20%20e.source.postMessage%28document.getElementById%28%27text-container%27%29.innerText%2C%20%27%2A%27%29%3B%0D%0A%20%20%7D%29%3B%0D%0A%20%20%3C%2Fscript%3E%0D%0A%20%20%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E";
	iframe.addEventListener('load', () => {
		window.addEventListener('message', ({ data }) => dtd2 = data);
		iframe.contentWindow.postMessage('foo', '*');
	});
	// keep checking for dtd2 not blank, but stop after x tries
	let counter = 0;
	function check_dtd2() {
		if (counter < 30) {
			if (dtd2 !== "") {
				clearInterval(checking);
				// if en-US then append good or bad
				if (navigator.language == "en-US") {
					if (sha1(dtd2) == "4496d79dd1843c7c743647b45b4f0d76abf46bfe") {
						dtd2 = enUS_green + dtd2;
					} else {
						dtd2 = enUS_red + dtd2;
					}
				}
				output_dtd2(dtd2);
			}
		} else {
			clearInterval(checking);
			output_dtd2("<span class='good'>[bugzilla 467035]</span>");
		}
		counter++;
	}
	let checking = setInterval(check_dtd2, 50)
};

function get_app_lang_mediadocument() {
	let t0 = performance.now();

	// MediaDocument.properties
	let iframe = document.getElementById("appLang_4");
	function output_mediadocument(string) {
		dom.appLang4.innerHTML = string;
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("app language MediaDocument: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
	function run_mediadocument() {
		try {
			let output = (iframe.contentWindow.document.title);
			// if en-US then append good or bad
			if (navigator.language == "en-US") {
				if (sha1(output) == "12ad5833d780efdd0d7e66432a1abab3afd9901d") {
					output = enUS_green + output;
				} else {
					output = enUS_red + output;
				}
			}
			output_mediadocument(output);
		} catch(e) {
			if ((location.protocol) == "file:") {
				// file: Cross-Origin Request Blocked
				output_mediadocument(error_file_cors);
			} else {
			// iframe blocked
				output_mediadocument(error_iframe);
			};
		};
	};
	function check_mediadocument() {
		let iframe = document.getElementById("appLang_4");
		// load the iframe
		if (iframe.src == "") {
			iframe.src="images/dummy.png";
			iframe.addEventListener("load", function(){
				run_mediadocument();
			});
		} else {
			// already loaded
			run_mediadocument();
		}
	};

	// keep checking if image is loaded, but stop after x tries
	let image = document.getElementById("imageTest");
	image.src="images/dummy.png"; // 1px high
	let counter = 0;
	let maxcounter = 40; // 2 seconds
	// wait longer for tor browser due to latency
	if (isTorBrowser == true) {
		maxcounter = 60 // 3 seconds
	}
	function check_image() {
		if (counter < maxcounter) {
			if (image.offsetHeight == 1) {
				// empty_src=0px, broken_src= approx 24px
				// extensions blocking images = if placeholders = approx 20px
				// therefore: if 1px then our image was loaded
				clearInterval(checking);
				image.src=""; // reset src
				check_mediadocument();
			}
		} else {
			clearInterval(checking);
			output_mediadocument(error_image);
			image.src=""; // reset src
		}
		counter++;
	}
	let checking = setInterval(check_image, 50)
};

function get_app_lang_xmlparser() {
	let doc = (new DOMParser).parseFromString('getyourlocale', 'application/xhtml+xml');
	let str = (doc.getElementsByTagName('parsererror')[0].firstChild.textContent);
	// remove location URL
	let start = str.search("http");
	if (start == -1) { start = str.search("file")};
	let end = str.search("html") + 4;
	let output = str.slice(0,start-1) + str.slice(end);
	// remove anchor
	start = output.search("#");
	if (start !== -1) {
		let strTemp = output.substring(start, output.length);
		strTemp = strTemp.replace(/(?:\r|\n).*$/, ' ');
		end = strTemp.search(" ");
		output = output.slice(0,start) + output.slice(start+end,output.length);
	};
	// output
	if (navigator.language !== "en-US") {
		// if not en-US then it doesn't matter
		dom.appLang5 = output
	} else {
		// if en-US then append good or bad
		if (sha1(output) === "0e4bcf212e9bcdae045444087659ffc9672c7582") {
			dom.appLang5.innerHTML = enUS_green + output;
		} else {
			dom.appLang5.innerHTML = enUS_red + output;
		}
	}
};

function test_iframe() {
	let t0 = performance.now();
	let iframeBlocked = true; // assume blocked

	// test an iframe: if success call other functions
	function output_iframe() {
		// clear iframe
		iframe.src="";
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("app language iframe test: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
		if (mPerf) {console.debug("app language iframe test: " + iframeBlocked)};
		// output
		if (iframeBlocked == true) {
			if ((location.protocol) == "file:") {
				// file: Cross-Origin Request Blocked
				dom.appLang2.innerHTML = error_file_cors;
				dom.appLang4.innerHTML = error_file_cors;
			} else {
				// iframe is blocked
				dom.appLang2.innerHTML = error_iframe;
				dom.appLang4.innerHTML = error_iframe;
			};
		} else {
			// iframes are good: call functions
			get_app_lang_mediadocument();
			get_app_lang_dtd1();
		};
	};

	let iframe = dom.iframeTest;
	iframe.src="iframes/test.html";
	iframe.addEventListener("load", function(){
		try {
			let testerror = iframe.contentWindow.document.getElementById("test")
			iframeBlocked = false;
		} catch(e) {}
	});

	// keep checking if iframe success, but stop after x tries
	let counter = 0;
	let maxcounter = 40; // 2 seconds
	// wait longer for tor browser due to latency
	if (isTorBrowser == true) {
		maxcounter = 60 // 3 seconds
	}
	function check_iframe() {
		if (counter < maxcounter) {
			if (iframeBlocked == false) {
				clearInterval(checking);
				output_iframe();
			}
		} else {
			clearInterval(checking);
			output_iframe();
		}
		counter++;
	}
	let checking = setInterval(check_iframe, 50)
};

function outputLanguage() {
	let t0 = performance.now(),
		lHash = ""; // string to hash all the date time results

	// variables
	let str = "",
	dateUsed = new Date("January 30, 2019 13:00:00"),
		dateOld = new Date("July 30, 2018 13:00:00"),
		dateFormatted = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
			year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" }),
		rOptions = dateFormatted.resolvedOptions(),
		dateOpt = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
			minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" };

	// language/locale
	dom.nLanguages = navigator.languages;
	dom.nLanguage = navigator.language;
	dom.nLanguages0 = navigator.languages[0];
	dom.localeIPR = new Intl.PluralRules().resolvedOptions().locale;
	dom.localeRO = rOptions.locale;
	// timezone/offsets
	str = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset();
	if (str == "0 | 0") {
		str = str + rfp_green
	} else {
		str = str + rfp_red
	};
	dom.tzOffsets.innerHTML = str;
	str = "";
	str = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (str == "UTC") {
		str = str + rfp_green
	} else {
		str = str + rfp_red
	};
	dom.tzRO.innerHTML = str;
	// date/time
	dom.dateSystem = dateUsed;
	dom.dateString = dateUsed.toString();
	// start string to hash
	lHash = dateUsed.getTimezoneOffset() + "-" + dateOld.getTimezoneOffset() + "-"
		+ Intl.DateTimeFormat().resolvedOptions().timeZone + "-" + dateUsed + "-" + dateUsed.toString();
	// long versions
	let tmp1 = dateUsed.toLocaleString(undefined, dateOpt);
		dom.lngdateLS = tmp1;
	let tmp2 = dateUsed.toLocaleDateString(undefined, dateOpt);
		dom.lngdateLDS = tmp2;
	let tmp3 = dateUsed.toLocaleTimeString(undefined, dateOpt);
		dom.lngdateLTS = tmp3;
	let tmp4 = Intl.DateTimeFormat(undefined, dateOpt).format(dateUsed);
		dom.lngdateIDTF = tmp4;
	let temp = dateFormatted.formatToParts(dateUsed);
		let tmp5 = temp.map(function(entry){return entry.value;}).join("");
		dom.dateFTP = tmp5;
	// various
	let tmp6 = dateUsed.toGMTString();
		dom.dateGMT = tmp6;
	let tmp7 = dateUsed.toUTCString();
		dom.dateUTC = tmp7;
	let tmp8 = dateUsed.toLocaleString();
		dom.dateLS = tmp8;
	let tmp9 = [dateUsed].toLocaleString();
		dom.dateTAtoLS = tmp9;
	let tmp10 = dateUsed.toLocaleDateString();
		dom.dateLDS = tmp10;
	let tmp11 = Intl.DateTimeFormat().format(dateUsed);
		dom.dateIDTF = tmp11;
	let tmp12 = dateUsed.toLocaleTimeString();
		dom.dateLTS = tmp12;
	let tmp13 = dateUsed.toTimeString();
		dom.dateTS = tmp13;
	let tmp14 = JSON.stringify(new Intl.NumberFormat().formatToParts(1000)[1]);
		dom.numFTP = tmp14;
	let tmp15 = new Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle;
		dom.hourRO = tmp15;
	// Intl.RelativeTimeFormat: FF65+
	// return "7 days ago, yesterday, tomorrow, next month, in 2 years" in your locale
	let tmp16 = "";
	try {
		const rtf = new Intl.RelativeTimeFormat(undefined, {style: 'long', numeric: `auto`});
		tmp16 = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
		dom.dateIRTF = tmp16;
	} catch(e) {
		tmp16 = "not supported";
		dom.dateIRTF = tmp16;
	};
	// calendar/numbering/geo
	let tmp17 = rOptions.calendar;
		dom.calendarRO = tmp17;
	let tmp18 = rOptions.numberingSystem;
		dom.numsysRO = tmp18;

	// output hash
	lHash = lHash + "-" + tmp1 + "-" + tmp2 + "-" + tmp3 + "-" + tmp4 + "-" + tmp5 + "-" + tmp6
		+ "-" + tmp7 + "-" + tmp8 + "-" + tmp9 + "-" + tmp10 + "-" + tmp11 + "-" + tmp12
		+ "-" + tmp13 + "-" + tmp14 + "-" + tmp15 + "-" + tmp16 + "-" + tmp17 + "-" + tmp18;
	lHash = sha1(lHash);
	if (lHash == "14735e3ff9471a5abf9d3f0dfe2817ce6cbb590f") {
		// CUT & Int.RelativeTimeFormat supported: FF65+
		dom.lngHash.innerHTML = lHash + rfp_green;
	} else if (lHash == "21ab34937976bc0f4bdb2fd803c2b65391f7140b") {
		// CUT & Int.RelativeTimeFormat not supported: FF63-64
		dom.lngHash.innerHTML = lHash + rfp_green;
	} else if (lHash == "afa0a1327629743d6750b36e4775c704dd7fe3bc") {
		// UTC and Int.RelativeTimeFormat not supported: FF62-
		dom.lngHash.innerHTML = lHash + rfp_green;
	} else {
		dom.lngHash.innerHTML = lHash + rfp_red;
	};

	if ("geolocation" in navigator) {
		dom.nGeolocation="enabled"
	} else {
		dom.nGeolocation="disabled"
	};
	// permissions.default.geo
	navigator.permissions.query({name:"geolocation"}).then(e => dom.pGeolocation=e.state);

	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section language [excl app lang]: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};

	// app lang pocs: FF only
	if (isFirefox == true) {

		let tmpStr = document.getElementById("appLang_1").validationMessage;
		if (navigator.language !== "en-US") {
			// if not en-US then it doesn't matter
			dom.appLang1 = tmpStr;
		} else {
			// if en-US then append good or bad
			if (sha1(tmpStr) == "c17ee6480cdfbdc082000efe84ca520283b761ef") {
				dom.appLang1.innerHTML = enUS_green + tmpStr;
			} else {
				dom.appLang1.innerHTML = enUS_red + tmpStr;
			}
		}
		get_app_lang_xmlparser();
		get_app_lang_dtd2();
		test_iframe(); // dtd1 and MediaDocument
	};

};

outputLanguage();
