'use strict';

let bTZ = false

function outputHeaders() {
	let t0 = performance.now()
	// online
	let r2 = ""
	try {
		r2 = navigator.onLine
		if (r2 == undefined) {r2 = zB2}
	} catch(e) {r2 = zB1}
	dom.nOnLine.innerHTML = r2
	// FF
	if (isFF) {
		// DNT
		let r1 = ""
		try {
			r1 = navigator.doNotTrack
			if (r1 == undefined) {r1 = zB2}
		} catch(e) {r1 = zB1}
		dom.nDNT.innerHTML = r1
		// network
		let r3 = "", test = ""
		if ("connection" in navigator) {
			// retest
			try {
				test = navigator.connection
				dom.nNetwork = (test == undefined ? zB2 : zE)
			} catch(e) {dom.nNetwork = zB1}
			// type
			try {
				r3 = navigator.connection.type
				if (r3 == undefined) {r3 = zB3}
			} catch(e) {
				r3 = (e.name == "ReferenceError" ? zB1 : zB2)
			}
			if (r3 == zB1 || r3 == zB2 || r3 == zB3) {
				dom.nConnection.innerHTML = r3
			} else {
				dom.nConnection.innerHTML = r3 += (r3 == "unknown" ? rfp_green : rfp_red)
			}
		} else {
			// retest
			try {
				test = navigator.connection; dom.nNetwork = zD
			} catch(e) {dom.nNetwork = zB3}
			// type
			try {
				r3 = navigator.connection
			} catch(e) {r3 = (e.name == "ReferenceError" ? zB4 : zB5)} // never used
			dom.nConnection.innerHTML = r3
		}
	} else {
		// non-FF
		dom.nDNT = navigator.doNotTrack
		if ("connection" in navigator) {
			dom.nNetwork = zE; dom.nConnection.innerHTML = navigator.connection.type
		} else {
			dom.nNetwork = zD; dom.nConnection = navigator.connection
		}
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
		r = sha1(r +"-"+ state)
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
	try {
		navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state))
	} catch(e) {
		dom.geo2 = (e.name == "ReferenceError" ? zB1 : zB2)
		r = sha1(r +"-"+ (e.name == "ReferenceError" ? zB1 : zB2))
		geoWrite(r)
	}
}

function get_lang_datetime() {
	let d = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00"),
		o = {weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
			minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long"},
		res = [],
		err = []

	function get_item(item) {
		try {
			// language
			if (item == 0) {return navigator.languages
			} else if (item == 1) {return navigator.language
			} else if (item == 2) {return navigator.languages[0]
			} else if (item == 3) {return Intl.DateTimeFormat().resolvedOptions().locale
			} else if (item == 4) {return new Intl.PluralRules().resolvedOptions().locale
			} else if (item == 5) {return new Intl.ListFormat(undefined).resolvedOptions().locale
			// timezone
			} else if (item == 6) {return d.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset()
			} else if (item == 7) {return Intl.DateTimeFormat().resolvedOptions().timeZone
			// date/time format
			} else if (item == 8) {return d
			} else if (item == 9) {return d.toString()
			} else if (item == 10) {return d.toLocaleString(undefined, o)
			} else if (item == 11) {return d.toLocaleDateString(undefined, o)
			} else if (item == 12) {return d.toLocaleTimeString(undefined, o)
			} else if (item == 13) {return Intl.DateTimeFormat(undefined, o).format(d)
			} else if (item == 14) {
				let f = Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
					year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" })
				let temp = f.formatToParts(d)
				return temp.map(function(entry){return entry.value}).join("")
			} else if (item == 15) {return d.toGMTString()
			} else if (item == 16) {return d.toUTCString()
			} else if (item == 17) {return d.toLocaleString()
			} else if (item == 18) {return [d].toLocaleString()
			} else if (item == 19) {return d.toLocaleDateString()
			} else if (item == 20) {return Intl.DateTimeFormat().format(d)

			} else if (item == 21) {return d.toLocaleTimeString()
			} else if (item == 22) {return d.toTimeString()
			} else if (item == 23) {
				return Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle
			} else if (item == 24) {
				// 65+: Intl.RelativeTimeFormat
				let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
				return rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
					rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year")
			} else if (item == 25) {
				// 70+: Intl.RelativeTimeFormat formatToParts
				let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
				function concat_parts(length, value) {
					let output = ""
					let rtf2 = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
					let rtf3 = rtf2.formatToParts(length, value)
					for (let x=0; x < rtf3.length; x++) {
						output += rtf3[x].value
					}
					return output
				}
				let test25 = rtf.formatToParts(-1, "year")
				return concat_parts("-1", "year")
					+ ", " + concat_parts("-3", "week")
					+ ", " + concat_parts("-1", "hour")
					+ ", " + concat_parts("45", "second")
					+ ", " + concat_parts("1", "day")
					+ ", " + concat_parts("1", "quarter")
			} else if (item == 26) {
				// Intl.NumberFormat
				let tmp26 = "", err26 = ""
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
				// decimals & groups
				tmp26 = new Intl.NumberFormat(undefined).format(123456.789)
				// unit long
				try {
					tmp26 += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(5)
				} catch(e) {
					tmp26 += err_check(sha1(e.message))
				}
				// notation: scientific
				try {
					tmp26 += " | "+ new Intl.NumberFormat(undefined, {notation: "scientific"}).format(987654321)
				} catch(e) {}
				// unit percent
				try {
					tmp26 += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "percent"}).format(1/2)
				} catch(e) {
					tmp26 += err_check(sha1(e.message))
				}
				// notation: long compact
				try {
					tmp26 += " | "+ new Intl.NumberFormat(undefined, {notation: "compact", compactDisplay: "long"}).format(654321987)
				} catch(e) {}
				// signDisplay
				try {
					tmp26 += " | "+ (55).toLocaleString(undefined, {signDisplay: "always"})
				} catch(e) {}
				return tmp26
			} else if (item == 27) {
				// [formatToParts] Intl.NumberFormat
				let tmp27 = "", str27 = "", type27 ="", charcode = ""
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
				// decimal
				type27 = "decimal"
				str27 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000.2)[3])
				tmp27 += clean_string(type27, str27, true)
				// group: e.g fr = narrow no-break space
				type27 = "group"
				str27 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000)[1])
				tmp27 += " | "+ clean_string(type27, str27, true)
				// infinity
				type27 = "infinity"
				str27 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(Infinity)[0])
				tmp27 += " | "+ clean_string(type27, str27, true)
				// minusSign
				type27 = "minusSign"
				str27 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(-5)[0])
				tmp27 += " | " + clean_string(type27, str27, true)
				// nan: e.g. zh-TW
				type27 = "nan"
				str27 = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(4/5 + "%")[0])
				tmp27 += " | "+ clean_string(type27, str27, false)
				return tmp27
			} else if (item == 28) {
				// 70+: [BigInt] Intl.NumberFormat
				let tmp28 = ""
				let bint1 = BigInt(9007199254740991)
				bint1 = eval("987654321987654321n")
				let numFormat = new Intl.NumberFormat(undefined)
				return numFormat.format(bint1)
			} else if (item == 29) {
				// 70+: [BigInt] toLocaleString
				let tmp29 = ""
				let bint2 = BigInt(9007199254740991)
				bint2 = eval("123456789123456789n")
				tmp29 = bint2.toLocaleString()
				if (tmp29 == "123456789123456789") {
					// 68-69
					tmp29 = zNS
				}
				return tmp29
			} else if (item == 30) {
				return Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"})
			} else if (item == 31) {
				return Intl.DateTimeFormat().resolvedOptions().calendar
			} else if (item == 32) {
				return Intl.DateTimeFormat().resolvedOptions().numberingSystem
			} else if (item == 33) {
				// 70+
				let tmp33 = new Intl.RelativeTimeFormat().resolvedOptions().numberingSystem
				// 65-69
				if (isVer > 64 && isVer < 70) {
					if (tmp33 == undefined) {tmp33 = "not supported [undefined]"}
				}
				return tmp33
			} else if (item == 34) {
				// relatedYear, yearName
				let tmp34 = Intl.DateTimeFormat(undefined, {relatedYear: "long"})
					tmp34 = tmp34.formatToParts(d)
					tmp34 = tmp34.map(function(entry){return entry.value}).join("")
				let tmp34b = Intl.DateTimeFormat(undefined, {year: "numeric", yearName: "long"})
					tmp34b = tmp34b.formatToParts(d)
					tmp34b = tmp34b.map(function(entry){return entry.value}).join("")
				return tmp34 += " | "+ tmp34b
			} else if (item == 35) {
				// dayPeriod: 1569103: nightly-only FF78+
				function get_day_period(date) {
					return new Intl.DateTimeFormat(undefined, {dayPeriod: "long"}).format(date)
				}
				let tmp35 = "",
					dayA = get_day_period(new Date("2019-01-30T08:00:00")),
					dayB = get_day_period(new Date("2019-01-30T12:00:00"))
				if (dayA == dayB) {
					tmp35 = zNS
				} else {
					// in the morning, noon, in the afternoon, in the evening, at night
					tmp35 = dayA + ", " + dayB
						+ ", " + get_day_period(new Date("2019-01-30T15:00:00"))
						+ ", " + get_day_period(new Date("2019-01-30T18:00:00"))
						+ ", " + get_day_period(new Date("2019-01-30T22:00:00"))
				}
				return tmp35
			} else if (item == 36) {
				// ListFormat: 1589095: 78+
				let tmp36 = "", res36 = []
				let	styles = ['long','short','narrow'],
					types = ['conjunction', 'disjunction','unit']
				styles.forEach(function(s){
					types.forEach(function(t){
						res36.push(new Intl.ListFormat(undefined,{style: s, type: t}).format(["a","b","c"]))
					})
				})
				if (res36.length > 0) {tmp36 = res36.join(" | ")}
				return tmp36
			} else if (item == 37) {
				// 1557718: 79+
				let list37 = ["short", "medium","long"],
					res37 = []
				list37.forEach(function(s){
					let style37 = Intl.DateTimeFormat(undefined, {timeStyle: s,	dateStyle: s})
					res37.push(style37.format(d))
				})
				return res37.join(" | ")
			}
		} catch(e) {
			if (isFF) {
				// standard FF errors
				let msg = ""
				if (item == 5 || item == 36) {
					if (e.message == "Intl.ListFormat is not a constructor" && isVer < 78) {msg = zNS}
				} else if (item == 24) {
					if (e.message == "Intl.RelativeTimeFormat is not a constructor" && isVer < 65) {msg = zNS}
				} else if (item == 25 ) {
					if (e.message == "Intl.RelativeTimeFormat is not a constructor" && isVer < 65) {msg = zNS}
					if (e.message == "rtf.formatToParts is not a function" && isVer > 64 && isVer < 70) {msg = zNS}
				} else if (item == 28 || item == 29) {
					if (e.message == "BigInt is not defined" && isVer < 68) {msg = zNS + " [BigInt]"}
					if (e.message == "can't convert BigInt to number" && isVer > 67 && isVer < 70) {msg = zNS}
				} else if (item == 33) {
					if (e.message == "Intl.RelativeTimeFormat is not a constructor" && isVer < 65) {msg = zNS}
				}
				// script blocking
				if (msg == "") {
					err.push(item +" [unexpected]: "+ e.name + " : " + e.message)
					if (e.name == "ReferenceError") {return zB1
					} else if (e.name == "TypeError") {return zB2
					} else {return zB3}
				} else {
					err.push(item +" [expected]: "+ e.name + " : " + e.message)
				}
				return msg
			} else {
				return "error"
			}
		}
	}
	// output
	for (let i=0; i < 38; i++) {
		let result = get_item(i)
		if (result == undefined) {result = zB4}
		if (result == "undefined") {result = zB5}
		res.push(result)
		document.getElementById("ldt"+i).innerHTML = result
	}
	// debugging: error tracking
	if (err.length > 0) {console.log("language/datetime errors\n" + err.join("\n"))}

	// hash language
	let lHash0 = sha1(res.slice(0,6).join("-"))
	if (isFF) {
		if (lHash0 == "53173ef1cd3c7e699e74c84e0adc88d14519e72b") {
			lHash0 += enUS_green + " [FF77 or lower]"
		} else {
			lHash0 += (lHash0 == "9424371eb3e055c06bf0c9a63ab93769fd90f318" ? enUS_green + " [FF78+]" : enUS_red)
		}
	}
	dom.lHash0.innerHTML = lHash0

	// hash timezone
	let lHash1 = sha1(res.slice(6,8).join("-"))
	bTZ = (lHash1 == "f8296e18b30a4ae7669d1992c943b90dde8bf94f" ? true : false)
	lHash1 += (bTZ ? rfp_green : rfp_red)
	dom.lHash1.innerHTML = lHash1

	// hash datetime
	let lHash2 = sha1(res.slice(8,38).join("-"))
	dom.lHash2 = lHash2
	// RFP
	let ff = ""
	if (isFF) {
		if (bTZ) {
			// state1: both green
			if (lHash2 == "e89556c7124ee4a2f294c8d14b9673785df3a46c") {
				// note this will split
				// nightly has dayPeriod, 79+ has date+timeStyle
				ff = " [Nightly]"
			} else if (lHash2 == "d0047c24e2b65ef772fabd3e07f5ec334a2e8a0d") {
				ff = " [FF78+]"
			} else if (lHash2 == "5e9ddd42ab4a9c633d2f0abc8956e66304cb8edc") {
				ff = " [FF71-77]"
			} else if (lHash2 == "f1308e9bb7ccd184af13bd9c6b96422f8d6707d5") {
				ff = " [FF70]"
			} else if (lHash2 == "3f1d5af38a4cdafac8acfc151c7e5f9fa6193f66") {
				ff = " [FF68-69]"
			} else if (lHash2 == "7c7aba1e2d3a8ac858cc2f22c467c4c785af6169") {
				ff = " [FF65-67]"
			} else if (lHash2 == "bb03b960e9fee1dba7ada7486a713bf6a0d1a632") {
				ff = " [FF63-64]"
			} else if (lHash2 == "106a4ed98d0077e7a06586e88ccec098c6a90a84") {
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
	}
	dom.lHash2.innerHTML = lHash2 + (isFF ? ff : "")

	// worker
	let msgWorker = []
	msgWorker.push(isFF)
	if (isVer == "") {msgWorker.push("0")} else {msgWorker.push(isVer)}

	if (isFile) {
	} else if (typeof(Worker) == "undefined") {
	} else {
		try {
			let workerlang = new Worker("js/language_worker.js")
			workerlang.addEventListener("message", function(e) {
				workerlang.terminate
				// compare
				for (let i=0; i < 38; i++) {
					try {
						if (res[i].toString() !== e.data[i].toString()) {
							document.getElementById("ldt"+i).innerHTML = res[i] + " | " + sb + e.data[i] + sc
						}
					} catch(e) {
						console.debug("compare", i, e.name, e.message)
					}
				}
				// hashes
				let wHash0 = sha1(e.data.slice(0,6).join("-"))
				if (wHash0 !== sha1(res.slice(0,6).join("-"))) {
					dom.lHash0.innerHTML = lHash0 +"<br>"+ sb + wHash0 + sc+" [see details]"
				}
				let wHash1 = sha1(e.data.slice(6,8).join("-"))
				if (wHash1 !== sha1(res.slice(6,8).join("-"))) {
					dom.lHash1.innerHTML = lHash1 +"<br>"+ sb + wHash1 + sc+" [see details]"
				}
				let wHash2 = sha1(e.data.slice(8,38).join("-"))
				console.debug("document hash", sha1(res.slice(8,38).join("-")))
				console.debug("worker hash", wHash2)

				if (wHash2 !== sha1(res.slice(8,38).join("-"))) {
					dom.lHash2.innerHTML = lHash2 +"<br>"+ sb + wHash2 + sc+" [see details]"
				}
			}, false)
			workerlang.postMessage(msgWorker)
		} catch(e) {}
	}
}

function outputLanguage() {
	let t0 = performance.now()
	// run
	get_lang_datetime()
	get_geo()
	// perf
	debug_page("perf","language",t0,gt0)
}

outputHeaders()
outputLanguage()
