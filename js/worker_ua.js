'use strict';

addEventListener("message", function(e) {
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = [],
		zBT = "<span class='bad'>[blocked]</span>",
		amFF = (e.data == "y" ? true : false)
	console.debug("I am firefox?", amFF, e.data)
	for (let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = "undefined"}
		if (r == undefined && amFF) {r = zBT}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	self.postMessage(res)
}, false)
