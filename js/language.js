/* TABLE: Language & Locale etc */
'use strict';

/* VARIABLES */
let	bTZ = false

function get_geo() {
	// geo
	let r = ("geolocation" in navigator ? zE : zD)
	dom.geo1 = r
	function geoState(state) {
		dom.geo2 = state
		r = sha1(r + "-" + state)
		if (r == "175f198d52a4381a6cf15505aae8cd85101f8e72") {
			r += default_ff_green
		} else if (r == "8845161313a6aace13d9a29c675144b09840b11a") {
			r += default_tb_green
		} else {
			r += default_red
		}
		dom.lHash3.innerHTML = r
	}
	navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state))
}

function get_lang() {
	// lang/locale
	let lang1 = navigator.languages; dom.lang1 = lang1
	let lang2 = navigator.language; dom.lang2 = lang2
	let lang3 = navigator.languages[0]; dom.lang3 = lang3
	let lang4 = new Intl.PluralRules().resolvedOptions().locale; dom.lang4 = lang4
	let lang5 = Intl.DateTimeFormat().resolvedOptions().locale; dom.lang5 = lang5
	let lHash1 = sha1(lang1 +"-"+ lang2 +"-"+ lang3 +"-"+ lang4 +"-"+ lang5)
	dom.lHash1.innerHTML = lHash1 += (lHash1 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98" ? enUS_green : enUS_red)
}

function get_tz() {
	// tz/offset
	let d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00")
	let tz1 = d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset(); dom.tz1 = tz1
	let tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone; dom.tz2 = tz2
	let h = sha1(tz1 + "-"	+ tz2)
	bTZ = (h == "f8296e18b30a4ae7669d1992c943b90dde8bf94f" ? true : false)
	dom.lHash0.innerHTML = h + (bTZ ? rfp_green : rfp_red)
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
		// FF65+: Intl.RelativeTimeFormat: "7 days ago, yesterday, tomorrow, next month, in 2 years"
		let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
		tmp16 = rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
			rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year")

		// FF70+: Intl.RelativeTimeFormat formatToParts
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
			// trap support
			let trap17 = rtf.formatToParts(-1, "year")
			is70 = true
			// "last year, 3 weeks ago, 1 hour ago, in 45 seconds, tomorrow, next quarter"
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
			// FF70 and lower: invalid value unit for option style
			return " | unit " + zNS
		} else if (error == "dabc0b854a78cdfdf4c0e8e3aa744da7056dc9ed") {
			// FF71+: invalid value "unit" for option style
			return " | \"unit\"" + zNS
		} else {
			return " | " + error
		}
	}
	try {
		// decimals & groups
		tmp18 = new Intl.NumberFormat(undefined).format(123456.789)
		// unit long
		try {
			tmp18 += " | " + new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(5)
		} catch(e) {
			tmp18 += err_check(sha1(e.message))
		}
		// notation: scientific
		try {
			tmp18 += " | " + new Intl.NumberFormat(undefined, {notation: "scientific"}).format(987654321)
		} catch(e) {}
		// unit percent
		try {
			tmp18 += " | " + new Intl.NumberFormat(undefined, {style: "unit", unit: "percent"}).format(1/2)
		} catch(e) {
			tmp18 += err_check(sha1(e.message))
		}
		// notation: long compact
		try {
			tmp18 += " | " + new Intl.NumberFormat(undefined, {notation: "compact", compactDisplay: "long"}).format(654321987)
		} catch(e) {}
		// signDisplay
		try {
			tmp18 += " | " + (55).toLocaleString(undefined, {signDisplay: "always"})
		} catch(e) {}
	} catch(e) {
		console.debug("tmp18 error:", e.message)
	}

	// [formatToParts] Intl.NumberFormat
	let tmp19 = "", str19 = "", type19 ="", debugchar = ""
	function clean_string(type, string, extra) {
		// prettify result
		try {
			string = string.replace(/"/g, "")
			string = string.replace("{type:", "")
			string = string.replace(",value:", " ")
			string = string.replace("}", "")
			if (extra == true) {
				// output charCode for single chars: e.g group/fr
				debugchar = string.charCodeAt(string.length-1)
				string = string + " <code>" + debugchar + "</code>"
			}
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
		tmp19 += " | " + clean_string(type19, str19, true)
		// infinity
		type19 = "infinity"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(Infinity)[0])
		tmp19 += " | " + clean_string(type19, str19, true)
		// minusSign
		type19 = "minusSign"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(-5)[0])
		tmp19 += " | " + clean_string(type19, str19, true)
		// nan: e.g. zh-TW
		type19 = "nan"
		str19 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(4/5 + "%")[0])
		tmp19 += " | " + clean_string(type19, str19, false)
	} catch(e) {
		console.debug("tmp19 error:", type19 + ":", e.message)
	}

	// FF70+: [BigInt] Intl.NumberFormat
	let tmp20 = ""
	try {
		let bint1 = BigInt(9007199254740991)
		// eval = no parsing errors
		bint1 = eval("987654321987654321n")
		let numFormat = new Intl.NumberFormat(undefined)
		tmp20 = numFormat.format(bint1)
	} catch(e) {
		// true: FF67- / false: FF68-69
		tmp20 = (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : zNS)
	}

	// FF70+: [BigInt] toLocaleString
	let tmp21 = ""
	try {
		let bint2 = BigInt(9007199254740991)
		// eval = no parsing errors
		bint2 = eval("123456789123456789n")
		tmp21 = bint2.toLocaleString()
		if (tmp21 == "123456789123456789") {
			// no change: FF68-69
			tmp21 = zNS
		}
	} catch(e) {
		// FF67 or lower
		tmp21 = (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : "error:" + e.message)
	}

	// currency
	let tmp22 = Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"})

	// calendar/numbering/geo
	let tmp23 = Intl.DateTimeFormat().resolvedOptions().calendar
	let tmp24 = Intl.DateTimeFormat().resolvedOptions().numberingSystem

	// output
	let results = [tmp0,tmp1,tmp2,tmp3,tmp4,tmp5,tmp6,tmp7,tmp8,tmp9,tmp10,tmp11,tmp12,
		tmp13,tmp14,tmp15,tmp16,tmp17,tmp18,tmp19,tmp20,tmp21,tmp22, tmp23, tmp24]
	for (let i=0; i < results.length; i++) {
		document.getElementById("dtf"+i).innerHTML = results[i]
	}
	// hash
	lHash2 = sha1(results.join("-"))
	dom.lHash2 = lHash2
	// notation
	let ff = "", yup = spoof_both_green
	if (bTZ) {
		// state1: both green
		if (lHash2 == "21e2e654c6a233b19114449720f51c0c3d045caf") {
			// ToDo: keep checking when various Intl.NumberFormat changes ride the train
			lHash2 += yup; ff = " [Nightly]"
		} else if (lHash2 == "c9830c97dac7521beab7989619c19f97b92213c2") {
			// 71+
			lHash2 += yup; ff = " [FF71+]"
		} else if (lHash2 == "5be427e9c8c158e797579ca56648113b31a4eb7c") {
			// 70+
			lHash2 += yup; ff = " [FF70]"
		} else if (lHash2 == "48924ffee511b3fcdef805427a0331e196ac3c0b") {
			// 68+
			lHash2 += yup; ff = " [FF68-69]"
		} else if (lHash2 == "5987dd55b3b9b33a4b6c40eae09488ef1cdd5ad1") {
			// 65+
			lHash2 += yup; ff = " [FF65-67]"
		} else if (lHash2 == "df6e25c6fd98c60b68ca7c8bdc880ee9ef686f48") {
			// 63
			lHash2 += yup; ff = " [FF63-64]"
		} else if (lHash2 == "9758d0a0efb5214a30bcc749af2d724aba3370ad") {
			// 60+
			lHash2 += yup; ff = " [FF60-62]"
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
	}
	dom.lHash2.innerHTML = lHash2 += (isFF ? ff : "")

}

function outputLanguage() {
	let t0 = performance.now()
	// run
	get_lang()
	get_tz()
	get_datetime()
	get_geo()
	// perf
	debug_page("perf","language",t0,gt0)
}

outputLanguage()
