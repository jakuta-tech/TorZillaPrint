'use strict';

addEventListener("message", function(e) {
	let d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00"),
		res = [],
		zB1 = "script blocked [a]",
		zB2 = "script blocked [b]",
		zB3 = "script blocked [c]"
	function get_item(item) {
		try {
			if (item == 0) {return navigator.languages
			} else if (item == 1) {return navigator.language
			} else if (item == 2) {return navigator.languages[0]
			} else if (item == 3) {return Intl.DateTimeFormat().resolvedOptions().locale
			} else if (item == 4) {return new Intl.PluralRules().resolvedOptions().locale
			} else if (item == 5) {return new Intl.ListFormat(undefined).resolvedOptions().locale
			} else if (item == 6) {return d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset()
			} else if (item == 7) {return Intl.DateTimeFormat().resolvedOptions().timeZone}
		} catch(e) {
			if (isFF) {
				if (e.message == "Intl.ListFormat is not a constructor") {return zNS
				} else if (e.name == "ReferenceError") {return zB1} else {return zB2}
			} else {
				return e.name + ": " + e.message
			}
		}
	}
	// build
	for (let i=0; i < 8; i++) {
		let result = get_item(i)
		if (result == undefined) {result = zB3}
		res.push(result)
	}
	// post
	self.postMessage(res)
}, false)
