'use strict';

self.addEventListener("activate", function(e) {
	console.debug("workerservice_ua.js: activated")
	let list = ['userAgent','appCodeName','appName','product','appVersion','platform'],
		res = []
	for (let i=0; i < list.length; i++) {
		let r = navigator[list[i]]
		if (r == "") {r = "undefined"}
		res.push((i).toString().padStart(2,"0")+" "+r)
	}
	let channel = new BroadcastChannel("sw-ua");
	channel.postMessage({msg: res});
})
