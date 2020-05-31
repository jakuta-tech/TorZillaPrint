'use strict';

let	bTZ = false

function outputHeaders() {
	let t0 = performance.now()
	// DNT
	let r1 = ""
	try {
		r1 = navigator.doNotTrack
		if (r1 == undefined) {r1 = zB2}
	} catch(e) {r1 = zB1}
	dom.nDNT.innerHTML = r1
	// online
	let r2 = ""
	try {
		r2 = navigator.onLine
		if (r2 == undefined) {r2 = zB2}
	} catch(e) {r2 = zB1}
	dom.nOnLine.innerHTML = r2
	// network info api
	let r3 = ""
	if ("connection" in navigator) {
		dom.nNetwork = zE
		try {
			r3 = navigator.connection.type
			if (r3 == undefined) {r3 = zB2}
		} catch(e) {r3 = zB1}
		if (r3 == zB1 || r3 == ZB2) {
			dom.nConnection.innerHTML = r3
		} else {
			dom.nConnection.innerHTML = r3 += (r3 == "unknown" ? rfp_green : rfp_red)
		}
	} else {
		dom.nNetwork = zD
		try {
			r3 = navigator.connection
		} catch(e) {r3 = (e.name = "ReferenceError" ? zB1 : zB2}
		dom.nConnection.innerHTML = r3
	}
	// perf
	debug_page("perf","headers",t0,gt0)
}

function get_geo() {
	let r = ("geolocation" in navigator ? zE : zD)
	dom.geo1 = r
	function geoWrite(r) {
		if (isTB2 == "y") {
			if (r == "8845161313a6aace13d9a29c675144b09840b11a") {
				r += default_tb_green
			} else {
				r += default_tb_red
			}
		} else {
			if (r == "175f198d52a4381a6cf15505aae8cd85101f8e72") {
				r += default_ff_green
			} else {
				r += default_ff_red
			}
		}
		dom.lHash3.innerHTML = r
	}
	function geoState(state) {
		dom.geo2 = state
		r = sha1(r + "-" + state)
		// isTB2
		if (isFF & isTB2 == "") {
			function checkTB() {
				if (isTB2 !== "") {
					clearInterval(tbCheck)
					geoWrite(r)		
				}
			}
			let tbCheck = setInterval(checkTB, 50)
		} else {
			geoWrite(r)
		}
	}
	navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state))
}

function get_tz_lang() {
	// timezone
	let d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00")
	let tz1 = d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset(); dom.tz1 = tz1
	let tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone; dom.tz2 = tz2
	let lHash0 = sha1(tz1 + "-"	+ tz2)
	bTZ = (lHash0 == "f8296e18b30a4ae7669d1992c943b90dde8bf94f" ? true : false)
	lHash0 += (bTZ ? rfp_green : rfp_red)
	dom.lHash0.innerHTML = lHash0

	// language
	let isB = "blocked"
	let lang1 = isB, lang2 = isB, lang3 = isB, lang4 = isB, lang5 = isB
	try {lang1 = navigator.languages} catch(e) {}
	dom.lang1.innerHTML = (lang1 == isB ? zB : lang1)
	try {lang2 = navigator.language} catch(e) {}
	dom.lang2.innerHTML = (lang2 == isB ? zB : lang2)
	try {lang3 = navigator.languages[0]} catch(e) {}
	dom.lang3.innerHTML = (lang3 == isB ? zB : lang3)
	try {lang4 = new Intl.PluralRules().resolvedOptions().locale} catch(e) {}
	dom.lang4.innerHTML = (lang4 == isB ? zB : lang4)
	try {lang5 = Intl.DateTimeFormat().resolvedOptions().locale} catch(e) {}
	dom.lang5.innerHTML = (lang5 == isB ? zB : lang5)
	let lHash1 = sha1(lang1 +"-"+ lang2 +"-"+ lang3 +"-"+ lang4 +"-"+ lang5)
	lHash1 += (lHash1 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98" ? enUS_green : enUS_red)
	dom.lHash1.innerHTML = lHash1

	// worker
	if (isFile) {
	} else if (typeof(Worker) == "undefined") {
	} else {
		try {
			let workerlang = new Worker("js/language_worker.js")
			workerlang.addEventListener("message", function(e) {
				workerlang.terminate
				// timezone
				let isLeak = false
				if (e.data[0] !== tz1) {dom.tz1.innerHTML = tz1 +" | "+ sb + e.data[0] + sc; isLeak = true}
				if (e.data[1] !== tz2) {dom.tz2.innerHTML = tz2 +" | "+ sb + e.data[1] + sc; isLeak = true}
				if (isLeak) {
					dom.lHash0.innerHTML = lHash0 +"<br>"+ sb + sha1(e.data[0]+"-"+e.data[1]) + " [see details]" +sc
				}
				// language
				isLeak = false
				if (sha1(e.data[2]) !== sha1(lang1)) {dom.lang1.innerHTML = lang1 +" | "+ sb + e.data[2] + sc; isLeak = true}
				if (e.data[3] !== lang2) {dom.lang2.innerHTML = lang2 +" | "+ sb + e.data[3] + sc; isLeak = true}
				if (e.data[4] !== lang3) {dom.lang3.innerHTML = lang3 +" | "+ sb + e.data[4] + sc; isLeak = true}
				if (e.data[5] !== lang4) {dom.lang4.innerHTML = lang4 +" | "+ sb + e.data[5] + sc; isLeak = true}
				if (e.data[6] !== lang5) {dom.lang5.innerHTML = lang5 +" | "+ sb + e.data[6] + sc; isLeak = true}
				if (isLeak) {
					dom.lHash1.innerHTML = lHash1 +"<br>"+ sb
						+ sha1(e.data[2]+"-"+e.data[3]+"-"+e.data[4]+"-"+e.data[5]+"-"+e.data[6])
						+ " [see details]" +sc
				}
			}, false)
			workerlang.postMessage("hi")
		} catch(e) {}
	}
}

function get_datetime() {
	// vars: d = date o = options f = format
	let d = new Date("January 30, 2019 13:00:00"),
	o = { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
		minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" },
	f = Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
		year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" })

	// one liners
	let tmp0 = d
	let tmp1 = d.toString()
	let tmp2 = d.toLocaleString(undefined, o)
	let tmp3 = d.toLocaleDateString(undefined, o)
	let tmp4 = d.toLocaleTimeString(undefined, o)
	let tmp5 = Intl.DateTimeFormat(undefined, o).format(d)
	let temp = f.formatToParts(d)
		let tmp6 = temp.map(function(entry){return entry.value}).join("")
	let tmp7 = d.toGMTString()
	let tmp8 = d.toUTCString()
	let tmp9 = d.toLocaleString()
	let tmp10 = [d].toLocaleString()
	let tmp11 = d.toLocaleDateString()
	let tmp12 = Intl.DateTimeFormat().format(d)
	let tmp13 = d.toLocaleTimeString()
	let tmp14 = d.toTimeString()
	let tmp15 = Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle

	let tmp16 = "",	tmp17 = "", is70 = false
	try {
		// 65+: Intl.RelativeTimeFormat
		let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
		tmp16 = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year")

		// 70+: Intl.RelativeTimeFormat formatToParts
		function concat_parts(length, value) {
			let output = ""
			let rtf2 = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
			let rtf3 = rtf2.formatToParts(length, value)
			for (let x=0; x < rtf3.length; x++) {
				output += rtf3[x].value
			}
			return output
		}
		try {
			let test17 = rtf.formatToParts(-1, "year")
			is70 = true
			tmp17 = concat_parts("-1", "year")
				+ ", " + concat_parts("-3", "week")
				+ ", " + concat_parts("-1", "hour")
				+ ", " + concat_parts("45", "second")
				+ ", " + concat_parts("1", "day")
				+ ", " + concat_parts("1", "quarter")
		} catch(e) {
			tmp17 = (is70 == false ? zNS : "supported" + sb + "[error: bad developer]" + sc)
		}
	} catch(e) {
		tmp16 = zNS
		tmp17 = zNS
	}

	// Intl.NumberFormat
	let tmp18 = "", err18 = ""
	function err_check(error) {
		if (error == "5e74394a663ce1f31667968d4dbe3de7a21da4d2") {
			// 70-: invalid value unit...
			return " | unit " + zNS
		} else if (error == "dabc0b854a78cdfdf4c0e8e3aa744da7056dc9ed") {
			// 71+: invalid value "unit"...
			return " | \"unit\" " + zNS
		} else {
			return " | "+ error
		}
	}
	try {
		// decimals & groups
		tmp18 = new Intl.NumberFormat(undefined).format(123456.789)
		// unit long
		try {
			tmp18 += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(5)
		} catch(e) {
			tmp18 += err_check(sha1(e.message))
		}
		// notation: scientific
		try {
			tmp18 += " | "+ new Intl.NumberFormat(undefined, {notation: "scientific"}).format(987654321)
		} catch(e) {}
		// unit percent
		try {
			tmp18 += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "percent"}).format(1/2)
		} catch(e) {
			tmp18 += err_check(sha1(e.message))
		}
		// notation: long compact
		try {
			tmp18 += " | "+ new Intl.NumberFormat(undefined, {notation: "compact", compactDisplay: "long"}).format(654321987)
		} catch(e) {}
		// signDisplay
		try {
			tmp18 += " | "+ (55).toLocaleString(undefined, {signDisplay: "always"})
		} catch(e) {}
	} catch(e) {
		console.debug("tmp18 error:", e.message)
	}

	// [formatToParts] Intl.NumberFormat
	let tmp19 = "", str19 = "", type19 ="", charcode = ""
	function clean_string(type, string, extra) {
		// prettify
		try {
			string = string.replace(/"/g, "")
			string = string.replace("{type:", "")
			string = string.replace(",value:", " ")
			string = string.replace("}", "")
			if (extra == true) {
				// charCode single chars: e.g group/fr
				charcode = string.charCodeAt(string.length-1)
				string = string+" <code>"+ charcode +"</code>"
			}
			return string
		} catch(e) {
			if (e.message == "string is undefined") {
				return type+" "+zU
			} else {
				return type+" error"
			}
		}
	}
	try {
		// ToDo: formatToParts Intl.NumberFormat: add more types
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/formatToParts
			// currency, fraction, literal, percentSign, plusSign

		// decimal
		type19 = "decimal"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000.2)[3])
		tmp19 += clean_string(type19, str19, true)
		// group: e.g fr = narrow no-break space
		type19 = "group"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000)[1])
		tmp19 += " | "+ clean_string(type19, str19, true)
		// infinity
		type19 = "infinity"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(Infinity)[0])
		tmp19 += " | "+ clean_string(type19, str19, true)
		// minusSign
		type19 = "minusSign"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(-5)[0])
		tmp19 += " | " + clean_string(type19, str19, true)
		// nan: e.g. zh-TW
		type19 = "nan"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(4/5 + "%")[0])
		tmp19 += " | "+ clean_string(type19, str19, false)
	} catch(e) {
		console.debug("tmp19 error:", type19 + ":", e.message)
	}

	// 70+: [BigInt] Intl.NumberFormat
	let tmp20 = ""
	try {
		let bint1 = BigInt(9007199254740991)
		bint1 = eval("987654321987654321n")
		let numFormat = new Intl.NumberFormat(undefined)
		tmp20 = numFormat.format(bint1)
	} catch(e) {
		// condition ? 67- : 68-69
		tmp20 = (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : zNS)
	}

	// 70+: [BigInt] toLocaleString
	let tmp21 = ""
	try {
		let bint2 = BigInt(9007199254740991)
		bint2 = eval("123456789123456789n")
		tmp21 = bint2.toLocaleString()
		if (tmp21 == "123456789123456789") {
			// 68-69
			tmp21 = zNS
		}
	} catch(e) {
		// 67-
		tmp21 = (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : "error:" + e.message)
	}

	// currency
	let tmp22 = Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"})

	// calendar/numbering
	let tmp23 = Intl.DateTimeFormat().resolvedOptions().calendar
	let tmp24 = Intl.DateTimeFormat().resolvedOptions().numberingSystem
	let tmp24b = ""
	try {
		// 70+
		tmp24b = new Intl.RelativeTimeFormat().resolvedOptions().numberingSystem
		// 65-69
		if (tmp24b == undefined) {tmp24b = "undefined"}
	} catch(e) {
		// <65: ...not a constructor
		tmp24b = zNS
	}
	tmp24 += " | "+ tmp24b

	// relatedYear, yearName
	let tmp25 = Intl.DateTimeFormat(undefined, {relatedYear: "long"})
		tmp25 = tmp25.formatToParts(d)
		tmp25 = tmp25.map(function(entry){return entry.value}).join("")
	let tmp25b = Intl.DateTimeFormat(undefined, {year: "numeric", yearName: "long"})
		tmp25b = tmp25b.formatToParts(d)
		tmp25b = tmp25b.map(function(entry){return entry.value}).join("")
	tmp25 += " | "+ tmp25b

	// dayPeriod: 1569103: enabled nightly-only FF78+
	function get_day_period(date) {
		return new Intl.DateTimeFormat(undefined, {dayPeriod: "long"}).format(date)
	}
	let tmp26 = "",
		dayA = get_day_period(new Date("2019-01-30T08:00:00")),
		dayB = get_day_period(new Date("2019-01-30T12:00:00"))
	if (dayA == dayB) {
		tmp26 = zNS
	} else {
		// in the morning, noon, in the afternoon, in the evening, at night
		tmp26 = dayA + ", " + dayB
			+ ", " + get_day_period(new Date("2019-01-30T15:00:00"))
			+ ", " + get_day_period(new Date("2019-01-30T18:00:00"))
			+ ", " + get_day_period(new Date("2019-01-30T22:00:00"))
	}

	// ListFormat: 1589095: 78+
	let tmp27 = "", results27 = []
	try {
		let	styles = ['long','short','narrow'],
			types = ['conjunction', 'disjunction','unit']
		styles.forEach(function(s){
			types.forEach(function(t){
				results27.push(new Intl.ListFormat(undefined,{style: s, type: t}).format(["a","b","c"]))
			})
		})
	} catch(e) {
		tmp27 = zNS
	}
	if (tmp27 !== zNS) {tmp27 = results27.join(" | ")}

	// output
	let results = [tmp0,tmp1,tmp2,tmp3,tmp4,tmp5,tmp6,tmp7,tmp8,tmp9,tmp10,tmp11,tmp12,tmp13,
		tmp14,tmp15,tmp16,tmp17,tmp18,tmp19,tmp20,tmp21,tmp22,tmp23,tmp24,tmp25,tmp26,tmp27]
	for (let i=0; i < results.length; i++) {
		document.getElementById("dtf"+i).innerHTML = results[i]
	}
	// hash
	let lHash2 = sha1(results.join("-"))
	dom.lHash2 = lHash2
	// RFP
	let ff = ""
	if (bTZ) {
		// state1: both green
		if (lHash2 == "b4a4fa60d3ba4887249ae8aaca6a9d910386bea2") {
			ff = " [Nightly]"
		} else if (lHash2 == "10e9861618442970d570def914617958d03b570a") {
			ff = " [FF71+]"
		} else if (lHash2 == "445067b74382877c6b2239181515a94809fe9ceb") {
			ff = " [FF70]"
		} else if (lHash2 == "1b3671c4e6901e4bb855611876a6880e85fa866b") {
			ff = " [FF68-69]"
		} else if (lHash2 == "3c2486895b44a8494841e8c6aef22d475d71afd3") {
			ff = " [FF65-67]"
		} else if (lHash2 == "8e43263e3dc552bdf118b99042a82fe6d0a4005f") {
			ff = " [FF63-64]"
		} else if (lHash2 == "168bdac2cbbc42a7b233f5fb435c7285291ae2be") {
			ff = " [FF60-62]"
		}
	}
	if (ff == "") {
		if (bTZ == true) {
			// state2: lang red, time green
			lHash2 += enUS_red + rfp_green
		} else {
			// state3: lang green, time red
			// lHash2 += enUS_green + rfp_red

			// state4: both red: just default to "and/or"
			lHash2 += spoof_both_red
		}
	} else {
		lHash2 += spoof_both_green
	}
	dom.lHash2.innerHTML = lHash2 += (isFF ? ff : "")

}

function outputLanguage() {
	let t0 = performance.now()
	// run
	get_tz_lang()
	get_datetime()
	get_geo()
	// perf
	debug_page("perf","language",t0,gt0)
}

outputHeaders()
outputLanguage()
