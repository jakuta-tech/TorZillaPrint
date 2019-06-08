/* TABLE: Language & Locale etc */

'use strict';

// functions
function cleanify(data){
	return data.map(function(entry){return entry.value;}).join("");
};
// date/time variables
var dateUsed = new Date("January 30, 2019 13:00:00");
var dateOld = new Date("July 30, 2018 13:00:00");
var dateFormatted = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" });
var rOptions = dateFormatted.resolvedOptions();
// date/time format options
var dateOpt = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" };

function outputLanguage() {
	// language
	dom.nLanguages = navigator.languages;
	dom.nLanguage = navigator.language;
	dom.nLanguages0 = navigator.languages[0];
	// locale
	dom.localeIPR = new Intl.PluralRules().resolvedOptions().locale;
	dom.localeRO = rOptions.locale;
	// timezone
	var tmpL = dateUsed.getTimezoneOffset()+ ' | ' + dateOld.getTimezoneOffset();
	if (tmpL == "0 | 0") {tmpL = tmpL + RFPy} else {tmpL = tmpL + RFPn};
	dom.tzOffsets.innerHTML = tmpL;
	tmpL = Intl.DateTimeFormat().resolvedOptions().timeZone;
	if (tmpL == "UTC") {tmpL = tmpL + RFPy} else {tmpL = tmpL + RFPn};
	dom.tzRO.innerHTML = tmpL;
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
	try {
		// FF65+: return "7 days ago, yesterday, tomorrow, next month, in 2 years" in your locale
		const rtf = new Intl.RelativeTimeFormat(undefined, { style: 'long', numeric: `auto` });
		dom.dateIRTF = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year");
		}
	catch(e) {dom.dateIRTF = "not supported"};
	// calendar
	dom.calendarRO = rOptions.calendar;
	// numbering
	dom.numsysRO = rOptions.numberingSystem;
	// geo
	if ("geolocation" in navigator) {dom.nGeolocation="yes"} else (dom.nGeolocation="no");
	navigator.permissions.query({name:"geolocation"}).then(e => dom.pGeolocation=e.state);

	/*** leak PoCs */
	if (amFF == true) {
		// dom.properties
		dom.appLang1 = document.getElementById("appL1el").validationMessage;
		// dtd
		var dtd1 = ""; var dtd2="";
		const iframeDTD1 = document.getElementById("iframeDTD1");
		iframeDTD1.src="iframes/dtdlocale.xml";
		iframeDTD1.addEventListener("load", dtdlocale1)
		function dtdlocale1() {
			dtd1 = iframeDTD1.contentDocument.getElementById("DTD1").innerText;
			window.removeEventListener("load", dtdlocale1)
		};
		// dtd nullprinciple
		const iframeDTD2 = document.getElementById("iframeDTD2");
		iframeDTD2.src="data:application/xml;charset=utf-8,%3C%21DOCTYPE%20html%20SYSTEM%20%22chrome%3A%2F%2Fglobal%2Flocale%2FnetError.dtd%22%3E%3Chtml%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3Chead%3E%3Cmeta%20charset%3D%22utf-8%22%2F%3E%0D%0A%20%20%3C%2Fhead%3E%0D%0A%20%20%3Cbody%3E%3Cspan%20id%3D%22text-container%22%3E%26loadError.label%3B%3C%2Fspan%3E%0D%0A%20%20%3Cscript%3E%0D%0A%20%20window.addEventListener%28%27message%27%2C%20%28e%29%20%3D%3E%20%7B%0D%0A%20%20%20%20e.source.postMessage%28document.getElementById%28%27text-container%27%29.innerText%2C%20%27%2A%27%29%3B%0D%0A%20%20%7D%29%3B%0D%0A%20%20%3C%2Fscript%3E%0D%0A%20%20%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E";
		iframeDTD2.addEventListener("load", dtdlocale2)
		function dtdlocale2() {
			window.addEventListener('message', ({ data }) => dtd2 = data);
			document.getElementById("iframeDTD2").contentWindow.postMessage('foo', '*');
		};
		setTimeout(function(){
			dom.appLang2 = dtd1; dom.appLang3 = dtd2;
		}, 1000);
		// MediaDocument.properties
		const iframeAPPL = document.getElementById("iframeAPPL");
		iframeAPPL.src="images/dummy.png";
		iframeAPPL.addEventListener("load", function() {
			dom.appLang4 = (this.contentWindow.document.title);
		});
		// xmlparser.properties
		const appL5doc = (new DOMParser).parseFromString('getyourlocale', 'application/xhtml+xml');
		var str2 = (appL5doc.getElementsByTagName('parsererror')[0].firstChild.textContent);
		var nb1 = str2.search("http"); if (nb1 == -1) {nb1 = str2.search("file")}
		var nb2 = str2.search("html") + 4;
		dom.appLang5 = str2.slice(0,nb1-1) + str2.slice(nb2);
	};

};

outputLanguage();
