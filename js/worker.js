/* WORKER SCRIPT */
'use strict';

addEventListener("message", function(e) {self.postMessage("TZP-"+e.data)}, false)
