'use strict';

var ports = []
onconnect = function(e) {
	let port = e.ports[0]
	ports.push(port)
	port.start()
	port.onmessage = function(e) {
		let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
			res = []
		for (let i=0; i < list.length; i++) {
			let r = navigator[list[i]]
			if (r == "") {r = "undefined"}
			res.push((i).toString().padStart(2,"0")+" "+r)
		}
		port.postMessage(res)
	}
}
