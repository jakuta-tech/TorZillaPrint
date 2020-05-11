'use strict';

var ports = []
onconnect = function(e) {
	console.debug("testing: onconnect")
	let port = e.ports[0]
	ports.push(port)
	port.start()
	port.onmessage = function(e) {
		console.debug("testing: onmessage")
		let res = [],
			d1 = new Date("January 30, 2019 13:00:00"),
			d2 = new Date("July 30, 2018 13:00:00")
		let tz1 = d1.getTimezoneOffset()+ ' | ' + d2.getTimezoneOffset()
		let tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone
		res.push(tz1)
		res.push(tz2)
		res.push(navigator.languages)
		res.push(navigator.language)
		res.push(navigator.languages[0])
		res.push(new Intl.PluralRules().resolvedOptions().locale)
		res.push(Intl.DateTimeFormat().resolvedOptions().locale)
		port.postMessage(res)
	}
}

