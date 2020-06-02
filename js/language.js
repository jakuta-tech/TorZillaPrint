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
	try {
		navigator.permissions.query({name:"geolocation"}).then(e => geoState(e.state))
	} catch(e) {
		dom.geo2 = (e.name == "ReferenceError" ? zB1 : zB2)
	}
}

function get_tz_lang() {
	// timezone
	let d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00"),
		res = []
	function get_item(item) {
		try {
			if (item == 0) {return navigator.languages
			} else if (item == 1) {return navigator.language
			} else if (item == 2) {return navigator.languages[0]
			} else if (item == 3) {return new Intl.PluralRules().resolvedOptions().locale
			} else if (item == 4) {return Intl.DateTimeFormat().resolvedOptions().locale
			} else if (item == 5) {return d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset()
			} else if (item == 6) {return Intl.DateTimeFormat().resolvedOptions().timeZone}
		} catch(e) {
			if (e.name = "ReferenceError") {return zB1} else {return zB2}
		}
	}
	// output
	for (let i=0; i < 7; i++) {
		let result = get_item(i)
		if (result == undefined) {result = zB3}
		res.push(result)
		document.getElementById("tzl"+i).innerHTML = result
	}
	// hashes
	let lHash0 = sha1(res.slice(0,5).join("-"))
	lHash0 += (lHash0 == "a8d1f16a67efa3d7659d71d7bb08a08e21f34b98" ? enUS_green : enUS_red)
	dom.lHash0.innerHTML = lHash0

	let lHash1 = sha1(res.slice(5,7).join("-"))
	bTZ = (lHash1 == "f8296e18b30a4ae7669d1992c943b90dde8bf94f" ? true : false)
	lHash1 += (bTZ ? rfp_green : rfp_red)
	dom.lHash1.innerHTML = lHash1

	// worker
	if (isFile) {
	} else if (typeof(Worker) == "undefined") {
	} else {
		try {
			let workerlang = new Worker("js/language_worker.js")
			workerlang.addEventListener("message", function(e) {
				workerlang.terminate
				// compare
				for (let i=0; i < 7; i++) {
					if (res[i].toString() !== e.data[i].toString()) {
						document.getElementById("tzl"+i).innerHTML = res[i] + " | " + sb + e.data[i] + sc
					}
				}
				// hashes
				let wHash0 = sha1(e.data.slice(0,5).join("-"))
				if (wHash0 !== sha1(res.slice(0,5).join("-"))) {
					dom.lHash0.innerHTML = lHash0 +"<br>"+ sb + wHash0 + sc+" [see details]"
				}
				let wHash1 = sha1(e.data.slice(5,7).join("-"))
				if (wHash1 !== sha1(res.slice(5,7).join("-"))) {
					dom.lHash1.innerHTML = lHash1 +"<br>"+ sb + wHash1 + sc+" [see details]"
				}
			}, false)
			workerlang.postMessage("hi")
		} catch(e) {}
	}
}

function get_datetime() {
	let t0 = performance.now()

	// vars: d = date o = options
	let d = new Date("January 30, 2019 13:00:00"),
	o = {weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
		minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long"},
	res = [],
	err = []

	function get_item(item) {
		try {
			if (item == 0) {return d
			} else if (item == 1) {return d.toString()
			} else if (item == 2) {return d.toLocaleString(undefined, o)
			} else if (item == 3) {return d.toLocaleDateString(undefined, o)
			} else if (item == 4) {return d.toLocaleTimeString(undefined, o)
			} else if (item == 5) {return Intl.DateTimeFormat(undefined, o).format(d)
			} else if (item == 6) {
				let f = Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
					year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" })
				let temp = f.formatToParts(d)
				return temp.map(function(entry){return entry.value}).join("")
			} else if (item == 7) {return d.toGMTString()
			} else if (item == 8) {return d.toUTCString()
			} else if (item == 9) {return d.toLocaleString()
			} else if (item == 10) {return [d].toLocaleString()
			} else if (item == 11) {return d.toLocaleDateString()
			} else if (item == 12) {return Intl.DateTimeFormat().format(d)
			} else if (item == 13) {return d.toLocaleTimeString()
			} else if (item == 14) {return d.toTimeString()
			} else if (item == 15) {
				return Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle
			} else if (item == 16 || item == 17) {
				try {
					// 65+: Intl.RelativeTimeFormat
					let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
					if (item == 16) {
						return rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
							rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year")
					}
					// 70+: Intl.RelativeTimeFormat formatToParts
					if (item == 17) {
						let is70 = false
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
							return concat_parts("-1", "year")
								+ ", " + concat_parts("-3", "week")
								+ ", " + concat_parts("-1", "hour")
								+ ", " + concat_parts("45", "second")
								+ ", " + concat_parts("1", "day")
								+ ", " + concat_parts("1", "quarter")
						} catch(e) {
							return (is70 == false ? zNS : "supported" + sb + "[error: bad developer]" + sc)
						}

					}
				} catch(e) {
					// TypeError Intl.RelativeTimeFormat is not a constructor
					if (e.name == "TypeError") { return zNS
					} else if (e.name == "ReferenceError") {return zB1
					} else {return zB2}
				}
			} else if (item == 18) {
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
				return tmp18
			} else if (item == 19) {
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
				return tmp19

			} else if (item == 20) {
				// 70+: [BigInt] Intl.NumberFormat
				try {
					let bint1 = BigInt(9007199254740991)
					bint1 = eval("987654321987654321n")
					let numFormat = new Intl.NumberFormat(undefined)
					return numFormat.format(bint1)
				} catch(e) {
					// condition ? 67- : 68-69
					return (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : zNS)
				}
			} else if (item == 21) {
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
					return tmp21
				} catch(e) {
					// 67-
					return (e.message == "BigInt is not defined" ? zNS + " [BigInt]" : "error:" + e.message)
				}
			} else if (item == 22) {
				return Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"})
			} else if (item == 23) {
				return Intl.DateTimeFormat().resolvedOptions().calendar
			} else if (item == 24) {
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
				return tmp24 += " | "+ tmp24b
			} else if (item == 25) {
				// relatedYear, yearName
				let tmp25 = Intl.DateTimeFormat(undefined, {relatedYear: "long"})
					tmp25 = tmp25.formatToParts(d)
					tmp25 = tmp25.map(function(entry){return entry.value}).join("")
				let tmp25b = Intl.DateTimeFormat(undefined, {year: "numeric", yearName: "long"})
					tmp25b = tmp25b.formatToParts(d)
					tmp25b = tmp25b.map(function(entry){return entry.value}).join("")
				return tmp25 += " | "+ tmp25b

			} else if (item == 26) {
				// dayPeriod: 1569103: nightly-only FF78+
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
				return tmp26
			} else if (item == 27) {
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
				return tmp27

			} else {
				return sf.trim() +"not coded yet"+sc
			}

		} catch(e) {
			err.push(i +": "+ e.name)
			if (e.name = "ReferenceError") {return zB1} else {return zB2}
		}
	}

	// build
	for (let i=0; i < 28; i++) {
		let result = get_item(i)
		if (result == undefined) {result = zB3}
		res.push(result)
		document.getElementById("dtf"+i).innerHTML = result
	}
	// hash
	let lHash2 = sha1(res.join("-"))
	dom.lHash2 = lHash2
	// RFP
	let ff = ""
	if (bTZ) {
		// state1: both green
		if (lHash2 == "b4a4fa60d3ba4887249ae8aaca6a9d910386bea2") {
			// nightly has dayPeriod
			ff = " [Nightly]"
		} else if (lHash2 == "b295a51dce74c7ae0711ed1f6d42dc2c6331fad4") {
			ff = " [FF78+]"
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

	// debug
	//console.debug(res.join("\n"))
	if (err.length > 0) {console.log(err.join("dtf errors\n"))}

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
