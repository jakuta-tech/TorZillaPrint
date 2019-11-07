/* TABLE: Language & Locale etc */

'use strict';

/* VARIABLES */
var dateUsed = new Date("January 30, 2019 13:00:00"),
	dateOld = new Date("July 30, 2018 13:00:00"),
	dateFormatted = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
		year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" }),
	rOptions = dateFormatted.resolvedOptions(),
	dateOpt = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
		minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" },
	dtd2 = "",
	bTZ = false;

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

function get_app_pocs() {
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
		test_iframe(); // this starts the dtd1 and MediaDocument PoCs
	};
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

function get_geo() {
	// geolocation
	let lHash3 = "";
	if ("geolocation" in navigator) {
		dom.nGeolocation="enabled"
		lHash3 = "enabled";
	} else {
		dom.nGeolocation="disabled"
		lHash3 = "disabled";
	};
	// permissions.default.geo
	function geoState(state) {
		dom.pGeolocation = state;
		lHash3 = sha1(lHash3 + "-" + state);
		if (lHash3 == "175f198d52a4381a6cf15505aae8cd85101f8e72") {
			// Firefox default: enabled-prompt
			lHash3 = lHash3 + default_ff_green;
		} else if (lHash3 == "8845161313a6aace13d9a29c675144b09840b11a") {
			// TB default: disabled-prompt
			lHash3 = lHash3 + default_tb_green;
		} else {
			// unusual combo
			lHash3 = lHash3 + default_red;
		};
		dom.lHash3.innerHTML = lHash3;
	};
	//navigator.permissions.query({name:"geolocation"}).then(e => dom.pGeolocation=e.state);
	navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state));
};

function get_lang() {
	// language/locale
	dom.nLanguages = navigator.languages;
	dom.nLanguage = navigator.language;
	dom.nLanguages0 = navigator.languages[0];
	dom.localeIPR = new Intl.PluralRules().resolvedOptions().locale;
	dom.localeRO = rOptions.locale;
	let lHash1 = sha1(navigator.languages + "-" + navigator.language + "-" + navigator.languages[0]
		+ "-" + new Intl.PluralRules().resolvedOptions().locale + "-" + rOptions.locale);
	if (lHash1 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98") {
		lHash1 = lHash1 + spoof_green
	} else {
		lHash1 = lHash1 + spoof_red
	};
	dom.lHash1.innerHTML = lHash1;
};

function get_tz() {
	// reset var
	bTZ = false;
	// timezone/offsets
	dom.tzOffsets.innerHTML = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset();
	dom.tzRO.innerHTML = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// is the RFP part red or green: i.e timezone
	let lHash0 = sha1(dateUsed.getTimezoneOffset() + "-" + dateOld.getTimezoneOffset() + "-"
		+ Intl.DateTimeFormat().resolvedOptions().timeZone);
	if (lHash0 == "a7f38fab59968c5af0a4df5d105acc9f6376405b") {
		bTZ = true;
		lHash0 = lHash0 + rfp_green;
	} else {
		lHash0 = lHash0 + rfp_red;		
	};
	dom.lHash0.innerHTML = lHash0;
};

function get_datetime() {
	let tmp1 = dateUsed; dom.dateSystem = tmp1;
	let tmp2 = dateUsed.toString(); dom.dateString = tmp2;
	let tmp3 = dateUsed.toLocaleString(undefined, dateOpt); dom.lngdateLS = tmp3;
	let tmp4 = dateUsed.toLocaleDateString(undefined, dateOpt); dom.lngdateLDS = tmp4;
	let tmp5 = dateUsed.toLocaleTimeString(undefined, dateOpt); dom.lngdateLTS = tmp5;
	let tmp6 = Intl.DateTimeFormat(undefined, dateOpt).format(dateUsed); dom.lngdateIDTF = tmp6;
	let temp = dateFormatted.formatToParts(dateUsed);
		let tmp7 = temp.map(function(entry){return entry.value;}).join(""); dom.dateFTP = tmp7;
	let tmp8 = dateUsed.toGMTString(); dom.dateGMT = tmp8;
	let tmp9 = dateUsed.toUTCString(); dom.dateUTC = tmp9;
	let tmp10 = dateUsed.toLocaleString(); dom.dateLS = tmp10;
	let tmp11 = [dateUsed].toLocaleString(); dom.dateTAtoLS = tmp11;
	let tmp12 = dateUsed.toLocaleDateString(); dom.dateLDS = tmp12;
	let tmp13 = Intl.DateTimeFormat().format(dateUsed); dom.dateIDTF = tmp13;
	let tmp14 = dateUsed.toLocaleTimeString(); dom.dateLTS = tmp14;
	let tmp15 = dateUsed.toTimeString(); dom.dateTS = tmp15;
	let tmp16 = JSON.stringify(new Intl.NumberFormat().formatToParts(1000)[1]); dom.numFTP = tmp16;
	let tmp17 = new Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle; dom.hourRO = tmp17;

	// Intl.RelativeTimeFormat: FF65+
	let tmp18 = "",	tmp19 = "", str19 = "";;
	try {
		// return "7 days ago, yesterday, tomorrow, next month, in 2 years" in your locale
		let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"});
		tmp18 = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
		dom.dateIRTF = tmp18;
		// Intl.RelativeTimeFormat formatToParts: FF70+
		try {
			// last year, 3 weeks ago, 1 hour ago, in 60 seconds, in 15 minutes, tomorrow, next month, in 2 quarters
			str19 = rtf.formatToParts(-1, "year");
				tmp19 = str19[0].value;
			str19 = rtf.formatToParts(-3, "week");
				tmp19 = tmp19 + ", " + str19[0].value + str19[1].value;
			str19 = rtf.formatToParts(-1, "hour");
				tmp19 = tmp19 + ", " + str19[0].value + str19[1].value;
			str19 = rtf.formatToParts(60, "second");
				tmp19 = tmp19 + ", " + str19[0].value + str19[1].value + str19[2].value;
			str19 = rtf.formatToParts(15, "minute");
				tmp19 = tmp19 + ", " + str19[0].value + str19[1].value + str19[2].value;
			str19 = rtf.formatToParts(1, "day");
				tmp19 = tmp19 + ", " + str19[0].value;
			str19 = rtf.formatToParts(1, "month");
				tmp19 = tmp19 + ", " + str19[0].value;
			str19 = rtf.formatToParts(2, "quarter");
				tmp19 = tmp19 + ", " + str19[0].value + str19[1].value + str19[2].value;
			dom.dateIRTFFTP.innerHTML = tmp19;
		} catch(e) {
			tmp19 = "not supported";
			dom.dateIRTFFTP = tmp19;
		};
	} catch(e) {
		tmp18 = "not supported";
		tmp19 = "not supported";
		dom.dateIRTF = tmp18;
		dom.dateIRTFFTP = tmp19;
	};

	// BigInt.toLocalString: FF70+
	let tmp20 = "";
	try {
		// BigInt: FF68+
		let bint = BigInt(9007199254740991);
		// use eval so no parsing errors
		bint = eval("123456789123456789n");
		tmp20 = bint.toLocaleString();
		if (tmp20 == "123456789123456789") {
			tmp20 = "not supported"; // FF68-69, else FF70+
		};
	} catch(e) {
		tmp20 = "not supported [BigInt]"; // FF67 or lower
	};
	dom.numTLS = tmp20;

	// calendar/numbering/geo
	let tmp30 = rOptions.calendar;
		dom.calendarRO = tmp30;
	let tmp31 = rOptions.numberingSystem;
		dom.numsysRO = tmp31;

	// build hash
	let lHash2 = tmp1 + "-" + tmp2 + "-" + tmp3 + "-" + tmp4 + "-" + tmp5 + "-" + tmp6 + "-" + tmp7
		+ "-" + tmp8 + "-" + tmp9 + "-" + tmp10 + "-" + tmp11 + "-" + tmp12 + "-" + tmp13 + "-" + tmp14
		+ "-" + tmp15 + "-" + tmp16 + "-" + tmp17 + "-" + tmp18 + "-" + tmp19 + "-" + tmp20
		+ "-" + tmp30 + "-" + tmp31;
	lHash2 = sha1(lHash2);
	dom.lHash2 = lHash2;
	// add notation
	if (lHash2 == "1f264746b3524f9fb01ea72acb3153e5c0ee11b8") {
		// done: FF70+: Intl.RelativeTimeFormat.formatToParts
		// todo: FF70+: BigInt.toLocaleString
		lHash2 = lHash2 + spoof_both_green;
	} else if (lHash2 == "8616cf02aacf325d1e2fdc80f25b0cd88f769f9e") {
		// FF68-69: BigInt
		lHash2 = lHash2 + spoof_both_green;
	} else if (lHash2 == "2999ce5ae3c551c6e60369160fa1cab2b81d5bb7") {
		// FF65-67: Int.RelativeTimeFormat
		lHash2 = lHash2 + spoof_both_green;
	} else if (lHash2 == "deac21b32d15d3c1b86ebbfe84cf3904065b77b0") {
		// FF63-64: CUT
		lHash2 = lHash2 + spoof_both_green;
	} else if (lHash2 == "ba0197af5a52569769591d6e45bd99e61fb6a5ff") {
		// FF60-62: UTC
		lHash2 = lHash2 + spoof_both_green;
	} else {
		// something is amiss
		if (bTZ == true) {
			// timezone
			// state 1: both green: see above
			// state 2: red spoof-lang, green rfp-time
			lHash2 = lHash2 + spoof_red + rfp_green;
		} else {
			// state 3: green lang, red time
			// unless I painstaking check the lang parts vs the time parts
			// I can't really tell what's at fault and detect this state

			// state 4: both red: just default to this "and/or"
			lHash2 = lHash2 + spoof_both_red;
		};
	};
	dom.lHash2.innerHTML = lHash2;	

};

function outputLanguage() {
	let t0 = performance.now();
	// run
	get_lang();
	get_tz();
	get_datetime();
	get_geo();
	// perf
	let t1 = performance.now();
	if (sPerf) {console.debug("  ** section language [excl app lang]: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	// start app lang PoCs
	get_app_pocs();
};

outputLanguage();
