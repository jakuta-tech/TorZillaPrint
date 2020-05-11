'use strict';

addEventListener("message", function(e) {
	let res = [],
		d1 = new Date("January 30, 2019 13:00:00"),
		d2 = new Date("July 30, 2018 13:00:00")
	res.push(d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset())
	res.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
	res.push(navigator.languages)
	res.push(navigator.language)
	res.push(navigator.languages[0])
	res.push(new Intl.PluralRules().resolvedOptions().locale)
	res.push(Intl.DateTimeFormat().resolvedOptions().locale)
	self.postMessage(res)
}, false)

