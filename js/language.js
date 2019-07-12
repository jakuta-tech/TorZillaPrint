/* TABLE: Language & Locale etc */

'use strict';

/* see globals.js
	RFPy:  green [RFP]
	RFPn:    red [RFP]
	TTC : yellow [test to come]
	amFF: firefox boolean
*/

// functions
function cleanify(data){
	return data.map(function(entry){return entry.value;}).join("");
};

function outputLanguage() {

	// multipurpose str
	let str = "";

	// variables
	let dateUsed = new Date("January 30, 2019 13:00:00"),
		dateOld = new Date("July 30, 2018 13:00:00"),
		dateFormatted = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
			year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" }),
		rOptions = dateFormatted.resolvedOptions(),
		dateOpt = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
			minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" };

	// languages
	dom.nLanguages = navigator.languages;
	dom.nLanguage = navigator.language;
	dom.nLanguages0 = navigator.languages[0];

	// locale
	dom.localeIPR = new Intl.PluralRules().resolvedOptions().locale;
	dom.localeRO = rOptions.locale;

	// timezone
	str = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset();
	if (str == "0 | 0") {
		str = str + RFPy
	} else {
		str = str + RFPn
	};
	dom.tzOffsets.innerHTML = str;

	// timezone offsets
	str = "";
	str = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (str == "UTC") {
		str = str + RFPy
	} else {
		str = str + RFPn
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
	dom.dateFTP = cleanify(dateFormatted.formatToParts(dateUsed));

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

	// calendar
	dom.calendarRO = rOptions.calendar;

	// numbering
	dom.numsysRO = rOptions.numberingSystem;

	// geo.enabled
	if ("geolocation" in navigator) {
		dom.nGeolocation="yes"
	} else {
		dom.nGeolocation="no"
	};

	// permissions.default.geo
	navigator.permissions.query({name:"geolocation"}).then(e => dom.pGeolocation=e.state);

	// application language leak PoCs: run only if Firefox
	if (amFF == true) {

		// dom.properties
		dom.appLang1 = document.getElementById("appL1el").validationMessage;

		// dtd
		let dtd1 = "";
		let iframe1 = document.getElementById("iframeDTD1");
		iframe1.src="iframes/dtdlocale.xml";
		iframe1.addEventListener("load", dtdlocale1)
		function dtdlocale1() {
			try {
				dtd1 = iframe1.contentDocument.getElementById("DTD1").innerText;
				window.removeEventListener("load", dtdlocale1)
			} catch(e) {
				console.log("dtd1 error", e.name, e.message);
				if ((location.protocol) == "file:") {
					// file: Cross-Origin Request Blocked
					dtd1 = CORS
				} else {
					// some other error: leak fixed or iframe blocked
					dtd1 = "<span class='bad'>[test error]</span>"
				};
			};
		};

		// dtd nullprinciple
		let dtd2 = "";
		let iframe2 = document.getElementById("iframeDTD2");
		iframe2.src="data:application/xml;charset=utf-8,%3C%21DOCTYPE%20html%20SYSTEM%20%22chrome%3A%2F%2Fglobal%2Flocale%2FnetError.dtd%22%3E%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3Chead%3E%3Cmeta%20charset%3D%22utf-8%22%2F%3E%0D%0A%20%20%3C%2Fhead%3E%0D%0A%20%20%3Cbody%3E%3Cspan%20id%3D%22text-container%22%3E%26loadError.label%3B%3C%2Fspan%3E%0D%0A%20%20%3Cscript%3E%0D%0A%20%20window.addEventListener%28%27message%27%2C%20%28e%29%20%3D%3E%20%7B%0D%0A%20%20%20%20e.source.postMessage%28document.getElementById%28%27text-container%27%29.innerText%2C%20%27%2A%27%29%3B%0D%0A%20%20%7D%29%3B%0D%0A%20%20%3C%2Fscript%3E%0D%0A%20%20%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E";
		iframe2.addEventListener("load", dtdlocale2)
		function dtdlocale2() {
			try {
				window.addEventListener('message', ({ data }) => dtd2 = data);
				document.getElementById("iframeDTD2").contentWindow.postMessage('foo', '*');
			} catch(e) {
				console.log("dtd1 error", e.name, e.message);
				if ((location.protocol) == "file:") {
					// file: Cross-Origin Request Blocked
					dtd2 = CORS
				} else {
					// some other error, or the dtd leak was fixed
					dtd2 = "<span class='bad'>[test error]</span>"
				}
			};
		};

		// wait to make sure we received the message
		setTimeout(function(){
			dom.appLang2.innerHTML = dtd1;
			if (dtd2 == "") {
				// dtd2 doesn't really need a delay, so we can be sure it's returned by now
				dom.appLang3.innerHTML = "<span class='good'>[bugzilla 467035]</span>";
				if (dtd1 == "") {
					// if dtd2 is patched, then dtd1 must also be: excluding iframe being blocked
					dom.appLang2.innerHTML = "<span class='good'>[bugzilla 467035]</span>";
				}
			} else {
				dom.appLang3.innerHTML = dtd2;
			}
		}, 1800);

		// MediaDocument.properties
		let iframe3 = document.getElementById("iframeAPPL");
		iframe3.src="images/dummy.png";
		iframe3.addEventListener("load", function() {
			try {
				dom.appLang4 = (this.contentWindow.document.title);
			} catch(e) {
				console.log("MediaDocument", e.name, e.message);
				if ((location.protocol) == "file:") {
					// file: Cross-Origin Request Blocked
					dom.appLang4.innerHTML = CORS
				} else {
					// some other error
					dom.appLang4.innerHTML = "<span class='bad'>[test error]</span>"
				};
			};
		});

		// xmlparser.properties
		let appL5doc = (new DOMParser).parseFromString('getyourlocale', 'application/xhtml+xml');
		let str2 = (appL5doc.getElementsByTagName('parsererror')[0].firstChild.textContent);
		// shorten output by removing location URL
		let nb1 = str2.search("http");
		if (nb1 == -1) {
			nb1 = str2.search("file")
		}
		let nb2 = str2.search("html") + 4;
		dom.appLang5 = str2.slice(0,nb1-1) + str2.slice(nb2);

	};

};

outputLanguage();
