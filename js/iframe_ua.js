'use strict';

let list = ['userAgent','appCodeName','appName','product','appVersion',
	'oscpu','platform','buildID','productSub','vendor','vendorSub'],
	res = []
for(let i=0; i < list.length; i++) {
	let r = navigator[list[i]]
	if (r == "") {r = "undefined"}
	res.push((i).toString().padStart(2,"0")+" "+r)
}
document.getElementById("result").innerHTML = sha1(res.join())
