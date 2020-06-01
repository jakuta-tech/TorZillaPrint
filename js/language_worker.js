'use strict';

addEventListener("message", function(e) {
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
	// build
	for (let i=0; i < 7; i++) {
		let result = get_item(i)
		res.push(result)
	}
	// post
	self.postMessage(res)
}, false)
