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
		+ " | " + ("Geolocation" in window ? "true" : "false")
	dom.geo1 = r
	function geoWrite(r) {
		r= sha1(r)
		if (isTB2 == "y") {
			if (r == "ce3ac8f48088499747d70a031d3f4eaaed61da46" && isVer > 71) {
				// TB ESR78+: disabled, true, prompt
				r += default_tb_green + " [ESR78+]"
			} else if (r == "e9870617411d57d9cc8f722098a0ac7ff694f825" && isVer < 72) {
				// TB ESR68-: disabled, false, prompt
				r += default_tb_green + " [ESR60-68]"
			} else {
				r += default_tb_red
			}
		} else {
			if (isFF) {
				if (r == "d053193ca561271fb2d1f6c888c9a268d5d02e5b" && isVer > 71) {
					// FF72+: enabled, true, prompt
					r += default_ff_green + " [FF72+]"
				} else if (r == "e672602411121842c18d9fa63c964c5ea288b74c" && isVer < 72) {
					// FF71-: enabled, false, prompt
					r += default_ff_green + " [FF60-71]"
				} else {
					r += default_ff_red
				}
			}
		}
		dom.lHash3.innerHTML = r
	}
	function geoState(state) {
		dom.geo2 = state
		r += "-"+ state
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
		r += "-"+ (e.name == "ReferenceError" ? zB1 : zB2)
		geoWrite(r)
	}
}

function get_lang_datetime() {
	let d = new Date("January 30, 2019 13:00:00"),
		o = {weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric",
			minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long"},
		res = [],
		err = []

	function get_item(item) {
		let amWorker = false
		try {
			// language
			if (item == 0) {return navigator.languages
			} else if (item == 1) {return navigator.language
			} else if (item == 2) {return navigator.languages[0]
			} else if (item == 3) {return Intl.Collator().resolvedOptions().locale
			} else if (item == 4) {return Intl.DateTimeFormat().resolvedOptions().locale
			} else if (item == 5) {return Intl.DisplayNames().resolvedOptions().locale
			} else if (item == 6) {return new Intl.ListFormat(undefined).resolvedOptions().locale
			} else if (item == 7) {return Intl.NumberFormat().resolvedOptions().locale
			} else if (item == 8) {return new Intl.PluralRules().resolvedOptions().locale
			} else if (item == 9) {return new Intl.RelativeTimeFormat().resolvedOptions().locale
			// timezone
			} else if (item == 10) {

				let k = 60000, tzarray = [], tzstr = ""
				let yrs = [1066,1905,1915,1925,1935,1945,1955,1965,1975,1985,1995,2005,2015]
				yrs.push(Date().split` `[3])
				for (let i=0; i < yrs.length; i++) {
					let yr = yrs[i]
					// control
					let c1 = new Date("January 15, "+yr+" 13:00:00 UTC"),
						c2 = new Date("April 15, "+yr+" 13:00:00 UTC"),
						c3 = new Date("July 15, "+yr+" 13:00:00 UTC"),
						c4 = new Date("October 15, "+yr+" 13:00:00 UTC")
					// real
					let r1 = new Date("January 15, "+yr+" 13:00:00"),
						r2 = new Date("April 15, "+yr+" 13:00:00"),
						r3 = new Date("July 15, "+yr+" 13:00:00"),
						r4 = new Date("October 15, "+yr+" 13:00:00")
					tzstr = r1.getTimezoneOffset() +", "+ r2.getTimezoneOffset()
						+", "+ r3.getTimezoneOffset() +", "+ r4.getTimezoneOffset()
						// getTime
						+ " | "+ ((r1.getTime() - c1.getTime())/k) + ", "+ ((r2.getTime() - c2.getTime())/k)
						+ ", "+ ((r3.getTime() - c3.getTime())/k) + ", "+ ((r4.getTime() - c4.getTime())/k)
						// Date.parse
						+ " | "+ ((Date.parse(r1) - Date.parse(c1))/k) + ", "+ ((Date.parse(r2) - Date.parse(c2))/k)
						+ ", "+ ((Date.parse(r3) - Date.parse(c3))/k) + ", "+ ((Date.parse(r4) - Date.parse(c4))/k)
					tzarray.push(yr+ ":"+ tzstr)
				}
				console.log("TESTING: multi-timezones: " + sha1(tzarray.join()) + "\n - " + tzarray.join("\n - "))
				// return current year only for now
				return tzstr

			} else if (item == 11) {return Intl.DateTimeFormat().resolvedOptions().timeZone
			// date/time format
			} else if (item == 12) {
				return (amWorker ? ""+d : d)
			} else if (item == 13) {return d.toString()
			} else if (item == 14) {return d.toLocaleString(undefined, o)
			} else if (item == 15) {return d.toLocaleDateString(undefined, o)
			} else if (item == 16) {return d.toLocaleTimeString(undefined, o)
			} else if (item == 17) {return Intl.DateTimeFormat(undefined, o).format(d)
			} else if (item == 18) {
				let f = Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric",
					year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true, timeZoneName: "long" })
				let temp = f.formatToParts(d)
				return temp.map(function(entry){return entry.value}).join("")
			} else if (item == 19) {return d.toGMTString()
			} else if (item == 20) {return d.toUTCString()
			} else if (item == 21) {return d.toLocaleString()
			} else if (item == 22) {return [d].toLocaleString()
			} else if (item == 23) {return d.toLocaleDateString()
			} else if (item == 24) {return Intl.DateTimeFormat().format(d)
			} else if (item == 25) {return d.toLocaleTimeString()
			} else if (item == 26) {return d.toTimeString()
			} else if (item == 27) {
				return Intl.DateTimeFormat(undefined, {hour: "numeric"}).resolvedOptions().hourCycle
			} else if (item == 28) {
				// 65+: Intl.RelativeTimeFormat
				let rtf = new Intl.RelativeTimeFormat(undefined, {style: "long", numeric: "auto"})
				return rtf.format(-7, "day") +", "+ rtf.format(-1, "day") +", "+
					rtf.format(1, "day") +", "+ rtf.format(1, "month") +", "+ rtf.format(2, "year")
			} else if (item == 29) {
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
				let test = rtf.formatToParts(-1, "year")
				return concat_parts("-1", "year")
					+ ", " + concat_parts("-3", "week")
					+ ", " + concat_parts("-1", "hour")
					+ ", " + concat_parts("45", "second")
					+ ", " + concat_parts("1", "day")
					+ ", " + concat_parts("1", "quarter")
			} else if (item == 30) {
				// Intl.NumberFormat
				function err_check(name, error) {
					if (isFF) {
						if (error == "invalid value unit for option style" && isVer < 71) {
							// 70-
							err.push(item +" [expected]: "+ name + " : " + error)
							return " | unit " + zNS
						} else if (error == "invalid value \"unit\" for option style" && isVer > 70 && isVer < 78) {
							// 71-77
							err.push(item +" [expected]: "+ name + " : " + error)
							return " | \"unit\" " + zNS
						} else {
							err.push(item +" [unexpected]: "+ name + " : " + error)
							if (name == "ReferenceError") {return " | "+ zB1
							} else if (name == "TypeError") {return " | "+ zB2
							} else {return " | "+ zB3}
						}
					} else {
						return " | error"
					}
				}
				// decimals & groups
				let tmp = new Intl.NumberFormat(undefined).format(123456.789)
				// unit long
				try {
					tmp += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "mile-per-hour", unitDisplay: "long"}).format(5)
				} catch(e) {
					tmp += err_check(e.name, e.message)
				}
				// notation: scientific
				try {
					tmp += " | "+ new Intl.NumberFormat(undefined, {notation: "scientific"}).format(987654321)
				} catch(e) {}
				// unit percent
				try {
					tmp += " | "+ new Intl.NumberFormat(undefined, {style: "unit", unit: "percent"}).format(1/2)
				} catch(e) {
					tmp += err_check(e.name, e.message)
				}
				// notation: long compact
				try {
					tmp += " | "+ new Intl.NumberFormat(undefined, {notation: "compact", compactDisplay: "long"}).format(654321987)
				} catch(e) {}
				// signDisplay
				try {
					tmp += " | "+ (55).toLocaleString(undefined, {signDisplay: "always"})
				} catch(e) {}
				return tmp
			} else if (item == 31) {
				// [formatToParts] Intl.NumberFormat
					// ToDo: trap script blocking
				let tmp = "", str = "", type ="", charcode = ""
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
				type = "decimal"
				str = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000.2)[3])
				tmp += clean_string(type, str, true)
				// group: e.g fr = narrow no-break space
				type = "group"
				str = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(1000)[1])
				tmp += " | "+ clean_string(type, str, true)
				// infinity
				type = "infinity"
				str = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(Infinity)[0])
				tmp += " | "+ clean_string(type, str, true)
				// minusSign
				type = "minusSign"
				str = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(-5)[0])
				tmp += " | " + clean_string(type, str, true)
				// nan: e.g. zh-TW
				type = "nan"
				str = JSON.stringify(new Intl.NumberFormat(undefined).formatToParts(4/5 + "%")[0])
				tmp += " | "+ clean_string(type, str, false)
				return tmp
			} else if (item == 32) {
				// 70+: [BigInt] Intl.NumberFormat
				let bint = BigInt(9007199254740991)
				bint = eval("987654321987654321n")
				let numFormat = new Intl.NumberFormat(undefined)
				return numFormat.format(bint)
			} else if (item == 33) {
				// 70+: [BigInt] toLocaleString
				let bint = BigInt(9007199254740991)
				bint = eval("123456789123456789n")
				let tmp = bint.toLocaleString()
				if (tmp == "123456789123456789") {
					// 68-69
					tmp = zNS
				}
				return tmp
			} else if (item == 34) {
				return Number(1234567.89).toLocaleString(undefined, {style: "currency", currency: "USD", currencyDisplay: "symbol"})
			} else if (item == 35) {
				return Intl.DateTimeFormat().resolvedOptions().calendar
			} else if (item == 36) {
				return Intl.DateTimeFormat().resolvedOptions().numberingSystem
			} else if (item == 37) {
				// 70+
				let tmp = new Intl.RelativeTimeFormat().resolvedOptions().numberingSystem
				// 65-69
				if (isVer > 64 && isVer < 70) {
					if (tmp == undefined) {tmp = "not supported [undefined]"}
				}
				return tmp
			} else if (item == 38) {
				// relatedYear, yearName
				let tmp = Intl.DateTimeFormat(undefined, {relatedYear: "long"})
					tmp = tmp.formatToParts(d)
					tmp = tmp.map(function(entry){return entry.value}).join("")
				let tmpb = Intl.DateTimeFormat(undefined, {year: "numeric", yearName: "long"})
					tmpb = tmpb.formatToParts(d)
					tmpb = tmpb.map(function(entry){return entry.value}).join("")
				return tmp += " | "+ tmpb
			} else if (item == 39) {
				// dayPeriod: 1569103: nightly-only FF78+
				function get_day_period(date) {
					return new Intl.DateTimeFormat(undefined, {dayPeriod: "long"}).format(date)
				}
				let tmp ="",
					dayA = get_day_period(new Date("2019-01-30T08:00:00")),
					dayB = get_day_period(new Date("2019-01-30T12:00:00"))
				if (dayA == dayB) {
					tmp = zNS
					// ToDo: dayPeriod: version check when this leaves Nightly
					//if (isFF && isVer < 81) {
					//	tmp = zB1
					//	err.push(item +" [unexpected]: dayPeriod")
					//}
				} else {
					// in the morning, noon, in the afternoon, in the evening, at night
					tmp = dayA + ", " + dayB
						+ ", " + get_day_period(new Date("2019-01-30T15:00:00"))
						+ ", " + get_day_period(new Date("2019-01-30T18:00:00"))
						+ ", " + get_day_period(new Date("2019-01-30T22:00:00"))
				}
				return tmp
			} else if (item == 40) {
				// ListFormat: 1589095: 78+
				let tmp = "", res40 = []
				let	styles = ['long','short','narrow'],
					types = ['conjunction', 'disjunction','unit']
				styles.forEach(function(s){
					types.forEach(function(t){
						res40.push(new Intl.ListFormat(undefined,{style: s, type: t}).format(["a","b","c"]))
					})
				})
				if (res40.length > 0) {tmp = res40.join(" | ")}
				return tmp
			} else if (item == 41) {
				// 1557718: 79+
				let list = ["short", "medium","long"],
					res41 = []
				list.forEach(function(s){
					let style = Intl.DateTimeFormat(undefined, {timeStyle: s,	dateStyle: s})
					res41.push(style.format(d))
				})
				return res41.join(" | ")
			} else if (item == 42) {
				// FF80+: 1496584, 1653024: formatRange
				let date1 = new Date(Date.UTC(2020, 0, 15, 11, 59, 59)),
					date2 = new Date(Date.UTC(2020, 0, 15, 12, 0, 1)),
					date3 = new Date(Date.UTC(2020, 8, 19, 23, 15, 30))
				let f = Intl.DateTimeFormat(undefined, o)
				return f.formatRange(date1, date2) +"<br>"+ f.formatRange(date1, date3)
			} else if (item == 43) {
				let prules = [], nos = [0,1,2,3,4,6,7,11,20,21,100]
				let prev = "", current = ""
				for (let i=0; i < nos.length; i++) {
					try {
						current = new Intl.PluralRules(undefined).select(nos[i])
					} catch(e) {
						current = "error"
					}
					// record changes only
					if (prev !== current) {prules.push(nos[i] + ": "+ current)}
					prev = current
				}
				return prules.join(", ")
			}
		} catch(e) {
			if (isFF) {
				// standard FF errors
				let msg = ""
				if (item == 5) {
					// ToDo: add DisplayNames version check when it lands in stable
					if (e.message == "Intl.DisplayNames is not a function") {msg = zNS}
				} else if (item == 6 || item == 40) {
					if (e.message == "Intl.ListFormat is not a constructor" && isVer < 78) {msg = zNS}
				} else if (item == 9|| item == 28 || item == 37) {
					if (e.message == "Intl.RelativeTimeFormat is not a constructor" && isVer < 65) {msg = zNS}
				} else if (item == 29 ) {
					if (e.message == "Intl.RelativeTimeFormat is not a constructor" && isVer < 65) {msg = zNS}
					if (e.message == "rtf.formatToParts is not a function" && isVer > 64 && isVer < 70) {msg = zNS}
				} else if (item == 32 || item == 33) {
					if (e.message == "BigInt is not defined" && isVer < 68) {msg = zNS + " [BigInt]"}
					if (e.message == "can't convert BigInt to number" && isVer > 67 && isVer < 70) {msg = zNS}
				} else if (item == 42) {
					// ToDo: formatRange is nighly only: 1653024 add version when it rides the train
					if (e.message == "f.formatRange is not a function") {msg = zNS}
				}
				// script blocking
				if (msg == "") {
					if (amWorker) {
						console.log("language worker error: "+ item +": "+ e.name +": "+ e.message)
					}
					err.push(item +" [unexpected]: "+ e.name + " : " + e.message)
					if (e.name == "ReferenceError") {msg = zB1
					} else if (e.name == "TypeError") {msg = zB2
					} else {msg = zB3}
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
	let combo1 = "", combo2 = ""
	for (let i=0; i < 44; i++) {
		let result = get_item(i)
		if (isFF) {
			if (result == undefined) {result = zB4; err.push(i +" [unexpected]: undefined")}
			if (result == "undefined") {result = zB5; err.push(i +" [unexpected]: \"undefined\"")}
		}
		res.push(result)
		// combine 0-2, 3-9
		if (i < 3) {
			combo1 += (i == 0 ? "" : " | ") + result
			if (i == 2) {dom.ldt2.innerHTML = combo1}
		} else if (i < 10) {
			combo2 += (i == 3 ? "" : " | ") + result
			if (i == 9) {dom.ldt9.innerHTML = combo2}
		} else {
			document.getElementById("ldt"+i).innerHTML = result
		}
	}
	// debugging: error tracking
	if (err.length > 0) {console.log("language/datetime errors\n" + err.join("\n"))}

	// hash 0-9: language
	let lHash0 = sha1(res.slice(0,10).join("-"))
	if (isFF) {
		if (lHash0 == "69a5edf153457ace2c6926f104487af6186dd9fc") {
			// ListFormat supported
			lHash0 += enUS_green + " [FF78+]"
		} else if (lHash0 == "a381c0360ceba8eb1fd155cb76e855faa5080260") {
			// RelativeTimeFormat supported
			lHash0 += enUS_green + " [FF65-77]"
		} else {
			lHash0 += (lHash0 == "110576f79238747630ef398ff8bbbebaf8681fec" ? enUS_green + " [FF60-64]" : enUS_red)
		}
	}
	dom.lHash0.innerHTML = lHash0

	// hash 10-11: timezone
	let lHash1 = sha1(res.slice(10,12).join("-"))
	bTZ = (lHash1 == "73496b322fb9f2f893f3f4852d92a5a0d81f9588" ? true : false)
	lHash1 += (bTZ ? rfp_green : rfp_red)
	dom.lHash1.innerHTML = lHash1

	// hash 12+: datetime
	let lHash2 = sha1(res.slice(12,res.length).join("-"))
	dom.lHash2 = lHash2
	// RFP
	let ff = ""
	if (isFF) {
		if (bTZ) {
			// state1: both green
			if (lHash2 == "79d7dddb43af8873e5f9271bc03c5e65c022c48e") {
				// nightly has dayPeriod, formatRange
				ff = " [Nightly]"
			} else if (lHash2 == "1850636a34767cc10c2e72de7e9a460bf136bc4d") {
				ff = " [FF79+]"
			} else if (lHash2 == "ed964df4e555954fb897a3e868c4f18729335d73") {
				ff = " [FF78]"
			} else if (lHash2 == "4009d40e41812b66e6c0f66494bb4a1781ff9a80") {
				ff = " [FF71-77]"
			} else if (lHash2 == "657b6ea41edca81376a65c2fa81fa6bc641ec5a1") {
				ff = " [FF70]"
			} else if (lHash2 == "e8c8aaecdf81f60e2295c9beaeec6dd86ffa4caa") {
				ff = " [FF68-69]"
			} else if (lHash2 == "02f4b55b856e182cc2626a04246aee0c8d5499c6") {
				ff = " [FF65-67]"
			} else if (lHash2 == "b9d2ca0773957025f370d4060e666c405c3bf84d") {
				ff = " [FF63-64]"
			} else if (lHash2 == "5df6cb0174d57eeda7900ef81ca8aa1fd49587d7") {
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
				let swcombo1 = "", swcombo2 = ""
				for (let i=0; i < 42; i++) {
					let divider = " | "
					if (i > 11 && i < 19) {divider = "<br>"}
					else if (i == 26 || i == 10) {divider = "<br>"}
					else if (i > 27 && i < 32) {divider = "<br>"}
					else if (i > 38) {divider = "<br>"}
					try {
						if (i < 3) {
							swcombo1 +=  (i == 0 ? e.data[i].toString() : " | " + e.data[i])
							if (i == 2) {
								if (combo1 !== swcombo1) {
									dom.ldt2.innerHTML = combo1 + " | " + sb + swcombo1 + sc
								}
							}
						} else if (i < 10) {
							swcombo2 += (i == 3 ? "" : " | ") + e.data[i]
							if (i == 9) {
								if (combo2 !== swcombo2) {
									dom.ldt9.innerHTML = combo2 + "<br>" + sb + swcombo2 + sc
								}								
							}
						} else if (i == 12) {
							// date object
							if (""+res[i] !== e.data[i]) {
								document.getElementById("ldt"+i).innerHTML = res[i] + divider + sb + e.data[i] + sc
							}
						} else {
							if (res[i] !== e.data[i]) {
								document.getElementById("ldt"+i).innerHTML = res[i] + divider + sb + e.data[i] + sc
							}
						}
					} catch(k) {
						console.debug("compare", i, k.name, k.message)
					}
				}
				// compare hashes
				if (isFF) {
					let wHash0 = sha1(e.data.slice(0,10).join("-"))
					if (wHash0 !== sha1(res.slice(0,10).join("-"))) {
						dom.lHash0.innerHTML = lHash0 +"<br>"+ sb + wHash0 + sc+" [see details]"
					}
					let wHash1 = sha1(e.data.slice(10,12).join("-"))
					if (wHash1 !== sha1(res.slice(10,12).join("-"))) {
						dom.lHash1.innerHTML = lHash1 +"<br>"+ sb + wHash1 + sc+" [see details]"
					}
					let wHash2 = sha1(e.data.slice(12,e.data.length).join("-"))
					if (wHash2 !== sha1(res.slice(12,e.data.length).join("-"))) {
						dom.lHash2.innerHTML = lHash2 +"<br>"+ sb + wHash2 + sc+" [see details]"
					}
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
