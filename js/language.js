/* TABLE: Language & Locale etc */

'use strict';

var t0lang;
var iframeBlocked = false;
var dtd2 = "";

function get_app_lang_dtd2() {
	let t0 = performance.now();

	// dtd nullprinciple
	dtd2 = "";
	function output_dtd2(output) {
		dom.appLang3.innerHTML = output;
		let t1 = performance.now();
		if (mPerf) {console.debug("app language dtd2: " + (t1-t0lang) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
	function run_dtd2() {
		window.addEventListener('message', ({ data }) => dtd2 = data);
		document.getElementById("appLang_3").contentWindow.postMessage('foo', '*');
	};
	// load it up
	let iframe = document.getElementById("appLang_3");
	iframe.src="data:application/xml;charset=utf-8,%3C%21DOCTYPE%20html%20SYSTEM%20%22chrome%3A%2F%2Fglobal%2Flocale%2FnetError.dtd%22%3E%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3Chead%3E%3Cmeta%20charset%3D%22utf-8%22%2F%3E%0D%0A%20%20%3C%2Fhead%3E%0D%0A%20%20%3Cbody%3E%3Cspan%20id%3D%22text-container%22%3E%26loadError.label%3B%3C%2Fspan%3E%0D%0A%20%20%3Cscript%3E%0D%0A%20%20window.addEventListener%28%27message%27%2C%20%28e%29%20%3D%3E%20%7B%0D%0A%20%20%20%20e.source.postMessage%28document.getElementById%28%27text-container%27%29.innerText%2C%20%27%2A%27%29%3B%0D%0A%20%20%7D%29%3B%0D%0A%20%20%3C%2Fscript%3E%0D%0A%20%20%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E";
	iframe.addEventListener("load", run_dtd2)

	// keep checking for dtd2 not blank, but stop after x tries
	let counter = 0;
	function check_dtd2() {
		if (counter < 10) {
			if (dtd2 !== "") {
				clearInterval(checking);
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
		if (mPerf) {console.debug("app language MediaDocument: " + (t1-t0lang) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
	function run_mediadocument() {
		try {
			let output = (iframe.contentWindow.document.title);
			output_mediadocument(output);
			iframeBlocked = false;
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
	function check_image() {
		if (counter < 40) {
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
	dom.appLang5 = output;	
};

function outputLanguage() {
	let t0 = performance.now();

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
	// long versions
	dom.lngdateLS = dateUsed.toLocaleString(undefined, dateOpt);
	dom.lngdateLDS = dateUsed.toLocaleDateString(undefined, dateOpt);
	dom.lngdateLTS = dateUsed.toLocaleTimeString(undefined, dateOpt);
	dom.lngdateIDTF = Intl.DateTimeFormat(undefined, dateOpt).format(dateUsed);
	let temp = dateFormatted.formatToParts(dateUsed)
	dom.dateFTP = temp.map(function(entry){return entry.value;}).join("");
	// various
	dom.dateGMT = dateUsed.toGMTString();;
	dom.dateUTC = dateUsed.toUTCString();
	dom.dateLS = dateUsed.toLocaleString();
	dom.dateTAtoLS = [dateUsed].toLocaleString();
	dom.dateLDS = dateUsed.toLocaleDateString();
	dom.dateIDTF = Intl.DateTimeFormat().format(dateUsed);
	dom.dateLTS = dateUsed.toLocaleTimeString();
	dom.dateTS = dateUsed.toTimeString();
	dom.numFTP = JSON.stringify(new Intl.NumberFormat().formatToParts(1000)[1]);
	dom.hourRO = new Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle;

	// Intl.RelativeTimeFormat: FF65+
	// return "7 days ago, yesterday, tomorrow, next month, in 2 years" in your locale
	try {
		const rtf = new Intl.RelativeTimeFormat(undefined, {style: 'long', numeric: `auto`});
		dom.dateIRTF = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
	} catch(e) {
		dom.dateIRTF = "not supported"
	};

	// calendar/numbering/geo
	dom.calendarRO = rOptions.calendar;
	dom.numsysRO = rOptions.numberingSystem;
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
		t0lang = performance.now();
		dom.appLang1 = document.getElementById("appLang_1").validationMessage;
		get_app_lang_xmlparser();
		get_app_lang_dtd2();
		get_app_lang_mediadocument();
		//test_iframe();
		//get_app_lang_dtd1();
	};

};

outputLanguage();
