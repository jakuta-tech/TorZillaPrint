'use strict';

addEventListener("message", function(msg) {
	let d = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00"),
		o = {weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
			minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long"},
		res = [],
		err = [],
		zNS = "not supported",
		zB1 = "script blocked [a]",
		zB2 = "script blocked [b]",
		zB3 = "script blocked [c]",
		zB4 = "script blocked [d]",
		zB5 = "script blocked [e]"

	let isFF = msg.data[0]
	let isVer = msg.data[1]

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
			} else if (item == 6) {
				return d.getTimezoneOffset() +", "+ d2.getTimezoneOffset()
					+ " | "+ ((d.getTime() - 1548853200000)/60000)
					+ ", "+ ((d2.getTime() - 1532955600000)/60000)
					+ " | "+ ((Date.parse(d) - 1548853200000)/60000)
					+ ", "+ ((Date.parse(d2) - 1532955600000)/60000)
			} else if (item == 7) {return Intl.DateTimeFormat().resolvedOptions().timeZone
			// date/time format
			} else if (item == 8) {return ""+d
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
					// ToDo: > 78 is really Nightly
					if (isFF && isVer > 78) {tmp35 = zB1}
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
					console.log(item)
					console.log(item +": "+ e.name +": "+ e.message)
					err.push(item +": "+ e.name +": "+ e.message)
					if (e.name == "ReferenceError") {msg = zB1
					} else if (e.name == "TypeError") {msg = zB2
					} else {msg = zB3}
				}
				return msg
			} else {
				return "error"
			}
		}
	}
	// log unexpected errors
	if (err.length > 0) {console.log("language worker errors\n" + err.join("\n - "))}

	// build
	for (let i=0; i < 38; i++) {
		let result = get_item(i)
		if (result == undefined) {result = zB4}
		if (result == "undefined") {result = zB5}
		res.push(result)
	}
	// post
	self.postMessage(res)
}, false)
