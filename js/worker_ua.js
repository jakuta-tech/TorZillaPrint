'use strict';

addEventListener("message", function(e) {
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = [],
		zBT = "<span class='bad'>[blocked]</span>"
	console.debug("isFF", e.data)
	if (e.data) {console.debug("banana")}
	for (let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = "undefined"}
		if (r == undefined && e.data) {r = zBT}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	self.postMessage(res)
}, false)
