'use strict';

// web worker
addEventListener("message", function(e) {self.postMessage("TZP-"+e.data)}, false)

// shared
var ports = []
onconnect = function(e) {
	let port = e.ports[0]
	ports.push(port)
	port.start()
	port.onmessage = function(e) {port.postMessage("TZP-"+e.data)}
}
