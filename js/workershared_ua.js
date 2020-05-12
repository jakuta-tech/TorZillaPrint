'use strict';

var ports = []
onconnect = function(e) {
	let port = e.ports[0]
	ports.push(port)
	port.start()
	port.onmessage = function(e) {
		let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
			res = [],
			zBT = "<span class='bad'>[blocked]</span>"
		// e.data = isFF
		for (let i=0; i < list.length; i++) {
			let r = navigator[list[i]]
			if (r == "") {r = "undefined"}
			if (r == undefined && e.data) {r = zBT}
			res.push((i).toString().padStart(2,"0")+" "+r)
		}
		port.postMessage(res)
	}
}
