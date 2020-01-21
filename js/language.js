/* TABLE: Language & Locale etc */

'use strict';

/* VARIABLES */
var dtd2 = "", bTZ = false;

function get_app_lang_dtd1() {
	// only call if iframes != blocked: no result = bugzilla fix
	let dtd1 = "";
	function output_dtd1(output) {
		dom.appLang2.innerHTML = output;
	}
	// load it up
	let iframe = dom.appLang_2,
		dtdtemp = "";
	iframe.src="iframes/dtdlocale.xml";
	iframe.addEventListener('load', () => {
		try {
			dtd1 = iframe.contentDocument.getElementById("DTD1").innerText;
		} catch(e) {
			if (isFile) {
				// could be CORS or the patch: check MediaDocument result
				setTimeout(function() {
					let str = dom.appLang4.textContent;
					if ( str == "[file:] [Cross-Origin Request Blocked]") {
						dtdtemp = error_file_cors
					} else if (str == "") {
						// should never happen, we waited a whole sec
						dtdtemp = sg+"[bugzilla 467035]</span> or " + error_file_cors;
					} else {
						dtdtemp = sg+"[bugzilla 467035]"+sc;
					}
				}, 1000); // get this done before the check_dtd1 runs out
			};
		}
	});
	// keep checking dtd1 != blank x times
	let counter = 0;
	function check_dtd1() {
		if (counter < 30) {
			if (dtd1 !== "") {
				clearInterval(checking);
				// notate
				if (navigator.language == "en-US") {
					dtd1 = (sha1(dtd1) == "4496d79dd1843c7c743647b45b4f0d76abf46bfe" ? enUS_green + dtd1 : enUS_red + dtd1)
				}
				output_dtd1(dtd1);
			}
		} else {
			clearInterval(checking);
			if (dtdtemp == "") {dtdtemp = sg+"[bugzilla 467035]"+sc};
			output_dtd1(dtdtemp);
		}
		counter++;
	}
	let checking = setInterval(check_dtd1, 50)
};

function get_app_lang_dtd2() {
	// dtd nullprinciple
	dtd2 = "";
	function output_dtd2(output) {
		dom.appLang3.innerHTML = output;
	};
	// load it up
	let iframe = dom.appLang_3;
	iframe.src="data:application/xml;charset=utf-8,%3C%21DOCTYPE%20html%20SYSTEM%20%22chrome%3A%2F%2Fglobal%2Flocale%2FnetError.dtd%22%3E%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3Chead%3E%3Cmeta%20charset%3D%22utf-8%22%2F%3E%0D%0A%20%20%3C%2Fhead%3E%0D%0A%20%20%3Cbody%3E%3Cspan%20id%3D%22text-container%22%3E%26loadError.label%3B%3C%2Fspan%3E%0D%0A%20%20%3Cscript%3E%0D%0A%20%20window.addEventListener%28%27message%27%2C%20%28e%29%20%3D%3E%20%7B%0D%0A%20%20%20%20e.source.postMessage%28document.getElementById%28%27text-container%27%29.innerText%2C%20%27%2A%27%29%3B%0D%0A%20%20%7D%29%3B%0D%0A%20%20%3C%2Fscript%3E%0D%0A%20%20%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E";
	iframe.addEventListener('load', () => {
		window.addEventListener('message', ({ data }) => dtd2 = data);
		iframe.contentWindow.postMessage('foo', '*');
	});
	// keep checking dtd2 not blank, but stop after x tries
	let counter = 0;
	function check_dtd2() {
		if (counter < 30) {
			if (dtd2 !== "") {
				clearInterval(checking);
				// notate
				if (navigator.language == "en-US") {
					dtd2 = (sha1(dtd2) == "4496d79dd1843c7c743647b45b4f0d76abf46bfe" ? enUS_green + dtd2 : enUS_red + dtd2)
				}
				output_dtd2(dtd2);
			}
		} else {
			clearInterval(checking);
			output_dtd2(sg+"[bugzilla 467035]"+sc);
		}
		counter++;
	}
	let checking = setInterval(check_dtd2, 50)
};

function get_app_lang_mediadocument() {
	// MediaDocument.properties
	let iframe = dom.appLang_4;
	function output_mediadocument(string) {
		dom.appLang4.innerHTML = string;
	};
	function run_mediadocument() {
		try {
			let output = (iframe.contentWindow.document.title);
			// notate
			if (navigator.language == "en-US") {
				output = (sha1(output) == "12ad5833d780efdd0d7e66432a1abab3afd9901d" ? enUS_green + output : enUS_red + output)
			}
			output_mediadocument(output);
		} catch(e) {
			if (isFile) {
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
	let maxcounter = 40; // 2 secs
	if (isTB) {maxcounter = 60} // 3 secs: TB latency
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
	// strip location
	let start = str.search("http");
	if (start == -1) { start = str.search("file")};
	let end = str.search("html") + 4;
	let output = str.slice(0,start-1) + str.slice(end);
	// strip anchor
	start = output.search("#");
	if (start !== -1) {
		let strTemp = output.substring(start, output.length);
		strTemp = strTemp.replace(/(?:\r|\n).*$/, ' ');
		end = strTemp.search(" ");
		output = output.slice(0,start) + output.slice(start+end,output.length);
	};
	// output
	if (navigator.language == "en-US") {
		output = (sha1(output) === "0e4bcf212e9bcdae045444087659ffc9672c7582" ? enUS_green + output : enUS_red + output)
	}
	dom.appLang5.innerHTML = output
};

function outputAppLanguage() {
	// FF only
	if (isFF) {
		// dom.properties
		let str = dom.appLang_1.validationMessage;
		if (navigator.language == "en-US") {
			str = (sha1(str) == "c17ee6480cdfbdc082000efe84ca520283b761ef" ? enUS_green + str : enUS_red + str)
		}
		dom.appLang1.innerHTML = str;
		// the others
		get_app_lang_xmlparser();
		get_app_lang_dtd2();
		test_iframe(); // fires last two PoCs
	};
};

function test_iframe() {
	let iframeBlocked = true; // assume blocked

	// test an iframe: if success call other functions
	function output_iframe() {
		// clear iframe
		iframe.src="";
		// output
		if (iframeBlocked == true) {
			if (isFile) {
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
	let maxcounter = 40; // 2 secs
	if (isTB) {maxcounter = 60} // 3 secs: allow for TB latency
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
	// geo
	let lHash3 = ("geolocation" in navigator ? "enabled" : "disabled");
	dom.geo1=lHash3;
	function geoState(state) {
		dom.geo2 = state;
		lHash3 = sha1(lHash3 + "-" + state);
		if (lHash3 == "175f198d52a4381a6cf15505aae8cd85101f8e72") {
			lHash3 = lHash3 + default_ff_green;
		} else if (lHash3 == "8845161313a6aace13d9a29c675144b09840b11a") {
			lHash3 = lHash3 + default_tb_green;
		} else {
			lHash3 = lHash3 + default_red;
		};
		dom.lHash3.innerHTML = lHash3;
	};
	navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state));
};

function get_lang() {
	// lang/locale
	let lang1 = navigator.languages; dom.lang1 = lang1;
	let lang2 = navigator.language; dom.lang2 = lang2;
	let lang3 = navigator.languages[0]; dom.lang3 = lang3;
	let lang4 = new Intl.PluralRules().resolvedOptions().locale; dom.lang4 = lang4;
	let lang5 = Intl.DateTimeFormat().resolvedOptions().locale; dom.lang5 = lang5;
	let lHash1 = sha1(lang1 +"-"+ lang2 +"-"+ lang3 +"-"+ lang4 +"-"+ lang5);
	dom.lHash1.innerHTML = (lHash1 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98" ? lHash1 + spoof_green : lHash1 + spoof_red)
};

function get_tz() {
	// tz/offset
	let d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00");
	let tz1 = d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset(); dom.tz1 = tz1;
	let tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone; dom.tz2 = tz2;
	let lHash0 = sha1(tz1 + "-"	+ tz2);
	bTZ = (lHash0 == "f8296e18b30a4ae7669d1992c943b90dde8bf94f" ? true : false)
	dom.lHash0.innerHTML = (bTZ ? lHash0 + rfp_green : lHash0 + rfp_red)
};

function get_datetime() {
	// d=date o=options f=format
	let d = new Date("January 30, 2019 13:00:00"),
	o = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
		minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" },
	f = Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
		year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" }),
	ns = "not supported";

	let tmp1 = d; dom.dtf1 = tmp1;
	let tmp2 = d.toString(); dom.dtf2 = tmp2;
	let tmp3 = d.toLocaleString(undefined, o); dom.dtf3 = tmp3;
	let tmp4 = d.toLocaleDateString(undefined, o); dom.dtf4 = tmp4;
	let tmp5 = d.toLocaleTimeString(undefined, o); dom.dtf5 = tmp5;
	let tmp6 = Intl.DateTimeFormat(undefined, o).format(d); dom.dtf6 = tmp6;
	let temp = f.formatToParts(d);
		let tmp7 = temp.map(function(entry){return entry.value;}).join(""); dom.dtf7 = tmp7;
	let tmp8 = d.toGMTString(); dom.dtf8 = tmp8;
	let tmp9 = d.toUTCString(); dom.dtf9 = tmp9;
	let tmp10 = d.toLocaleString(); dom.dtf10 = tmp10;
	let tmp11 = [d].toLocaleString(); dom.dtf11 = tmp11;
	let tmp12 = d.toLocaleDateString(); dom.dtf12 = tmp12;
	let tmp13 = Intl.DateTimeFormat().format(d); dom.dtf13 = tmp13;
	let tmp14 = d.toLocaleTimeString(); dom.dtf14 = tmp14;
	let tmp15 = d.toTimeString(); dom.dtf15 = tmp15;
	let tmp16 = Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle; dom.dtf16 = tmp16;

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
			tmp18 = (is70 == false ? ns : "supported" + sb + "[error: bad developer]" + sc);
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
			tmp19 += " | " + new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(num19);
		} catch(e) {
			err19 = sha1(e.message);
			if (err19 == "5e74394a663ce1f31667968d4dbe3de7a21da4d2") {
				tmp19 += " | unit " + ns; // FF70 and lower
			} else if (err19 == "dabc0b854a78cdfdf4c0e8e3aa744da7056dc9ed") {
				tmp19 += " | \"unit\" " + ns; // FF71
			} else {
				tmp19 += " | 'unit' " + ns; // future catch-all?
			}
		}
		// scientific
		num19 = 987654321
		try {
			// currently nightly only
			tmp19 += " | " + new Intl.NumberFormat(undefined, {notation: "scientific"}).format(num19);
		} catch(e) {
			err19 = sha1(e.message);
			console.debug(e.message)
		}
		// ToDo: Intl.NumberFormat: add more types

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
				return type + " error"
			}
		}
	}
	try {
		// ToDo: formatToParts Intl.NumberFormat: add more types: currency/fraction/literal/percentSign/plusSign(use a UTC time ahead GMT?)
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

	// currency
	let tmp25 = Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"});
	dom.dtf25 = tmp25;
	// calendar/numbering/geo
	let tmp30 = Intl.DateTimeFormat().resolvedOptions().calendar; dom.dtf30 = tmp30;
	let tmp31 = Intl.DateTimeFormat().resolvedOptions().numberingSystem; dom.dtf31 = tmp31;

	// build hash
	let lHash2 = sha1(tmp1 + "-" + tmp2 + "-" + tmp3 + "-" + tmp4 + "-" + tmp5 + "-" + tmp6 + "-" + tmp7
		+ "-" + tmp8 + "-" + tmp9 + "-" + tmp10 + "-" + tmp11 + "-" + tmp12 + "-" + tmp13 + "-" + tmp14
		+ "-" + tmp15 + "-" + tmp16 + "-" + tmp17 + "-" + tmp18 + "-" + tmp19 + "-" + tmp20 + "-" + tmp21
		+ "-" + tmp22 + "-" + tmp25 + "-" + tmp30 + "-" + tmp31);
	dom.lHash2 = lHash2;

	// add notation
	let ff = "", yup = spoof_both_green;
	// these require bTZ=true, skip if false
	if (bTZ) {
		if (lHash2 == "7435dbc48015ec6d7a01bb2916a11ed23ff97376") {
			// Nightly only: [formatToParts] Intl.NumberFormat notation
			// see 1609954
			lHash2 += yup; ff = " [Nightly]";
		} else if (lHash2 == "b1eb9ee8c744cd6b6cd82286c5c463afabd6070b") {
			// FF71+: [formatToParts] Intl.NumberFormat: diff error message
			lHash2 += yup; ff = " [FF71+]";
		} else if (lHash2 == "2250141e22a0fa690347db0007c5436631506e0f") {
			// FF70+: [BigInt] Intl.NumberFormat
			// FF70+: [BigInt] toLocaleString
			lHash2 += yup; ff = " [FF70]";
		} else if (lHash2 == "f9658ee215639e7ee43397aed0c50d425e477b04") {
			// FF68+: BigInt
			lHash2 += yup; ff = " [FF68-69]";
		} else if (lHash2 == "46191de20c4417d3ad50fddd65707f511df47733") {
			// FF65+: Intl.RelativeTimeFormat
			lHash2 += yup; ff = " [FF65-67]";
		} else if (lHash2 == "9137bcb6bf814d2890bc3fd79052a9a9f6e3792f") {
			// FF63+: CUT
			lHash2 += yup; ff = " [FF63-64]";
		} else if (lHash2 == "0ae233553b7d703069847a8ff3f9edca829225af") {
			// FF60+: UTC
			lHash2 += yup; ff = " [FF60-62]";
		}
	}
	// something is amiss
	if (ff == "") {
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
	if (isFF) { lHash2 = lHash2 + ff};
	dom.lHash2.innerHTML = lHash2
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
	outputDebug("1", "language", (t1-t0), (t1 - gt0));
};

outputLanguage();
