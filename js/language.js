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
		if (mPerf) {console.debug("app lang dtd1: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	}
	// load it up
	let iframe = dom.appLang_2,
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
						dtdtemp = sg+"[bugzilla 467035]</span> or " + error_file_cors;
					} else {
						dtdtemp = sg+"[bugzilla 467035]"+sc;
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
				dtdtemp = sg+"[bugzilla 467035]"+sc;
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
		if (mPerf) {console.debug("app lang dtd2: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
	};
	// load it up
	let iframe = dom.appLang_3;
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
	let iframe = dom.appLang_4;
	function output_mediadocument(string) {
		dom.appLang4.innerHTML = string;
		// perf
		let t1 = performance.now();
		if (mPerf) {console.debug("app lang MediaDocument: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
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
		let iframe = dom.appLang_4;
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
		if (mPerf) {console.debug("app lang iframe test: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
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
	let lHash3 = ("geolocation" in navigator ? "enabled" : "disabled")
	dom.geo1=lHash3;
	// permissions.default.geo
	function geoState(state) {
		dom.geo2 = state;
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
	navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state));
};

function get_lang() {
	// language/locale
	let lang1 = navigator.languages; dom.lang1 = lang1;
	let lang2 = navigator.language; dom.lang2 = lang2;
	let lang3 = navigator.languages[0]; dom.lang3 = lang3;
	let lang4 = new Intl.PluralRules().resolvedOptions().locale; dom.lang4 = lang4;
	let lang5 = rOptions.locale; dom.lang5 = lang5;
	let lHash1 = sha1(lang1 +"-"+ lang2 +"-"+ lang3 +"-"+ lang4 +"-"+ lang5);
	if (lHash1 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98") {
		dom.lHash1.innerHTML = lHash1 + spoof_green
	} else {
		dom.lHash1.innerHTML = lHash1 + spoof_red
	}
};

function get_tz() {
	// timezone/offset
	let tz1 = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset(); dom.tz1 = tz1;
	let tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone; dom.tz2 = tz2;
	let lHash0 = sha1(tz1 + "-"	+ tz2);
	if (lHash0 == "f8296e18b30a4ae7669d1992c943b90dde8bf94f") {
		bTZ	= true;
		dom.lHash0.innerHTML = lHash0 + rfp_green;
	} else {
		bTZ	= false;
		dom.lHash0.innerHTML = lHash0 + rfp_red;
	}
};

function get_datetime() {
	let ns = "not supported";
	let tmp1 = dateUsed; dom.dtf1 = tmp1;
	let tmp2 = dateUsed.toString(); dom.dtf2 = tmp2;
	let tmp3 = dateUsed.toLocaleString(undefined, dateOpt); dom.dtf3 = tmp3;
	let tmp4 = dateUsed.toLocaleDateString(undefined, dateOpt); dom.dtf4 = tmp4;
	let tmp5 = dateUsed.toLocaleTimeString(undefined, dateOpt); dom.dtf5 = tmp5;
	let tmp6 = Intl.DateTimeFormat(undefined, dateOpt).format(dateUsed); dom.dtf6 = tmp6;
	let temp = dateFormatted.formatToParts(dateUsed);
		let tmp7 = temp.map(function(entry){return entry.value;}).join(""); dom.dtf7 = tmp7;
	let tmp8 = dateUsed.toGMTString(); dom.dtf8 = tmp8;
	let tmp9 = dateUsed.toUTCString(); dom.dtf9 = tmp9;
	let tmp10 = dateUsed.toLocaleString(); dom.dtf10 = tmp10;
	let tmp11 = [dateUsed].toLocaleString(); dom.dtf11 = tmp11;
	let tmp12 = dateUsed.toLocaleDateString(); dom.dtf12 = tmp12;
	let tmp13 = Intl.DateTimeFormat().format(dateUsed); dom.dtf13 = tmp13;
	let tmp14 = dateUsed.toLocaleTimeString(); dom.dtf14 = tmp14;
	let tmp15 = dateUsed.toTimeString(); dom.dtf15 = tmp15;
	let tmp16 = new Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle; dom.dtf16 = tmp16;

	// Intl.RelativeTimeFormat
	let tmp17 = "",	tmp18 = "", is70 = false;
	try {
		// FF65+: Intl.RelativeTimeFormat: "7 days ago, yesterday, tomorrow, next month, in 2 years"
		let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"});
		tmp17 = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
		dom.dtf17 = tmp17;

		// FF70+: Intl.RelativeTimeFormat formatToParts
		function concat_parts(length, value) {
			// must an more elegant way to do this: languages vary in number of parts
			let output = "";
			let rtf2 = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"});
			let rtf3 = rtf2.formatToParts(length, value);
			for (let x = 0; x < rtf3.length; x++) {
				output = output + rtf3[x].value
			}
			return output;
		};
		try {
			// trap support
			let trap18 = rtf.formatToParts(-1, "year");
			is70 = true;
			// "last year, 3 weeks ago, 1 hour ago, in 45 seconds, tomorrow, next quarter"
			tmp18 = concat_parts("-1", "year")
				+ ", " + concat_parts("-3", "week")
				+ ", " + concat_parts("-1", "hour")
				+ ", " + concat_parts("45", "second")
				+ ", " + concat_parts("1", "day")
				+ ", " + concat_parts("1", "quarter");
			dom.dtf18.innerHTML = tmp18;
		} catch(e) {
			tmp18 = (is70 == false ? ns : "supported <span class='bad'>[error: bad developer]</span>");
			dom.dtf18.innerHTML = tmp18;
		};
	} catch(e) {
		tmp17 = ns;
		tmp18 = ns;
		dom.dtf17 = tmp17;
		dom.dtf18 = tmp18;
	};

	// Intl.NumberFormat
	let tmp19 = "", debug19 = "", err19 = "";
	try {
		// decimals & groups
		debug19 = "decimals/groups";
		let num19 = 123456.789;
		tmp19 = new Intl.NumberFormat(undefined).format(num19);
		// long unit
		debug19 = "unit";
		num19 = 5;
		try {
			// FF72+
			tmp19 = tmp19 + " | " + new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(num19);
		} catch(e) {
			err19 = sha1(e.message);
			if (err19 == "5e74394a663ce1f31667968d4dbe3de7a21da4d2") {
				tmp19 = tmp19 + " | unit " + ns; // FF70 and lower
			} else if (err19 == "dabc0b854a78cdfdf4c0e8e3aa744da7056dc9ed") {
				tmp19 = tmp19 + " | \"unit\" " + ns; // FF71
			} else {
				tmp19 = tmp19 + " | 'unit' " + ns; // future catch-all?
			}
		}
		// todo: what else can we add?

		// output
		//console.debug("tmp19", tmp19);
		dom.dtf19 = tmp19;
	} catch(e) {
		// debug errors
		//console.debug("tmp19 error:", debug19 + ";", e.message)
	}

	// [formatToParts] Intl.NumberFormat
	let tmp20 = "", str20 = "", type20 ="", debugchar = "";
	function clean_string(type, string, extra) {
		// prettify result
		try {
			string = string.replace(/"/g, "");
			string = string.replace("{type:", "");
			string = string.replace(",value:", " ");
			string = string.replace("}", "");
			if (extra == true) {
				// output charCode for single chars: e.g group/fr
				debugchar = string.charCodeAt(string.length-1);
				string = string + " <code>" + debugchar + "</code>";
			};
			return string
		} catch(e) {
			// catch undefined
			if (e.message == "string is undefined") {
				return type + " undefined"
			} else {
				return type + "error"
			}
		}
	}
	// concat types: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/formatToParts
	try {
		// todo: currency, fraction, literal, plusSign (use a UTC time ahead GMT?), percentSign
		// decimal
		type20 = "decimal";
		str20 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000.2)[3]);
		tmp20 = clean_string(type20, str20, true);
		// group: e.g fr = narrow no-break space / en-US = , / de = . / etc
		type20 = "group";
		str20 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000)[1]);
		tmp20 = tmp20 + " | " + clean_string(type20, str20, true);
		// infinity
		type20 = "infinity";
		str20 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(Infinity)[0]);
		tmp20 = tmp20 + " | " + clean_string(type20, str20, true);
		// minusSign
		type20 = "minusSign";
		str20 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(-5)[0]);
		tmp20 = tmp20 + " | " + clean_string(type20, str20, true);
		// nan: e.g. zh-TW
		type20 = "nan";
		str20 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(4/5 + "%")[0]);
		tmp20 = tmp20 + " | " + clean_string(type20, str20, false);
		//console.debug("tmp20:" + tmp20);
		// output
		dom.dtf20.innerHTML = tmp20;
	} catch(e) {
		// debug errors
		//console.debug("tmp20 error:", type20 + ":", e.message)
	};

	// FF70+: [BigInt] Intl.NumberFormat
	let tmp21 = "";
	try {
		let bint1 = BigInt(9007199254740991);
		// eval = no parsing errors
		bint1 = eval("987654321987654321n");
		let numFormat = new Intl.NumberFormat(undefined);
		tmp21 = numFormat.format(bint1);
	} catch(e) {
		// true: FF67- / false: FF68-69
		tmp21 = (e.message == "BigInt is not defined" ? ns + " [BigInt]" : ns)
	};
	dom.dtf21 = tmp21;

	// FF70+: [BigInt] toLocaleString
	let tmp22 = "";
	try {
		let bint2 = BigInt(9007199254740991);
		// eval = no parsing errors
		bint2 = eval("123456789123456789n");
		tmp22 = bint2.toLocaleString();
		if (tmp22 == "123456789123456789") {
			// no change: FF68-69
			tmp22 = ns;
		};
	} catch(e) {
		// FF67 or lower
		tmp22 = (e.message == "BigInt is not defined" ? ns + " [BigInt]" : "error:" + e.message)
	};
	dom.dtf22 = tmp22;

	// calendar/numbering/geo
	let tmp30 = rOptions.calendar; dom.dtf30 = tmp30;
	let tmp31 = rOptions.numberingSystem; dom.dtf31 = tmp31;

	// build hash
	let lHash2 = tmp1 + "-" + tmp2 + "-" + tmp3 + "-" + tmp4 + "-" + tmp5 + "-" + tmp6 + "-" + tmp7
		+ "-" + tmp8 + "-" + tmp9 + "-" + tmp10 + "-" + tmp11 + "-" + tmp12 + "-" + tmp13 + "-" + tmp14
		+ "-" + tmp15 + "-" + tmp16 + "-" + tmp17 + "-" + tmp18 + "-" + tmp19 + "-" + tmp20 + "-" + tmp21
		+ "-" + tmp22 + "-" + tmp30 + "-" + tmp31;
	//console.debug(lHash2);
	lHash2 = sha1(lHash2);
	dom.lHash2 = lHash2;
	// add notation
	let ff = "";
	if (lHash2 == "314af3976e066468f7e68492ee320ddd3036353f") {
		// FF72+: [formatToParts] Intl.NumberFormat
		lHash2 = lHash2 + spoof_both_green; ff = " [FF72+]";
	} else if (lHash2 == "e55df382836729c0460b77089dcb38218f854616") {
		// FF71: [formatToParts] Intl.NumberFormat: diff error message
		lHash2 = lHash2 + spoof_both_green; ff = " [FF71]";
	} else if (lHash2 == "42c210e719845128b2df77275e96fd7fe1304013") {
		// FF70+: [BigInt] Intl.NumberFormat
		// FF70+: [BigInt] toLocaleString
		lHash2 = lHash2 + spoof_both_green; ff = " [FF70]";
	} else if (lHash2 == "1e6adada983598231470eea446329446c68dd875") {
		// FF68+: BigInt
		lHash2 = lHash2 + spoof_both_green; ff = " [FF68-69]";
	} else if (lHash2 == "5da7d7dfdc8638edeab4e8fce5a07ed3e7b78d19") {
		// FF65+: Intl.RelativeTimeFormat
		lHash2 = lHash2 + spoof_both_green; ff = " [FF65-67]";
	} else if (lHash2 == "fd7213bbb4a67c29ca9f3e1522c351b50b867be9") {
		// FF63+: CUT
		lHash2 = lHash2 + spoof_both_green; ff = " [FF63-64]";
	} else if (lHash2 == "09ec48d99814d7ec532b0add024fb75ea252037b") {
		// FF60-62: UTC
		lHash2 = lHash2 + spoof_both_green; ff = " [FF60-62]";
	} else {
		// something is amiss
		if (bTZ == true) {
			// timezone
			// state1: both green: see above
			// state2: lang red, time green
			lHash2 = lHash2 + spoof_red + rfp_green;
		} else {
			// state3: lang green, time red
			// I can't easily tell if lang is at fault as well as time
			// lHash2 = lHash2 + spoof_green + rfp_red;

			// state4: both red: just default to "and/or"
			lHash2 = lHash2 + spoof_both_red;
		};
	};
	if (isFirefox == true) { lHash2 = lHash2 + ff};
	dom.lHash2.innerHTML = lHash2
};

function outputAppLanguage() {
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

function outputLanguage() {
	let t0 = performance.now();
	// run
	get_lang();
	get_tz();
	get_datetime();
	get_geo();
	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "language", (t1-t0), (t1 - gt0))};
};

outputLanguage();
