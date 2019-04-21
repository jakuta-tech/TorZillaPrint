/* TABLE: Miscellaneous */

'use strict';

/* mathml */
// use empty clipbooard as it has no tooltip which affects the height
var mathml1 = document.getElementById("nClipboard").offsetHeight;
var mathml2 = document.getElementById("mathml2").offsetHeight;
if ( mathml1 == mathml2) {dom.mathml1="disabled"} else {dom.mathml1="enabled"};

/* clipboard */
if ("clipboard" in navigator) {dom.nClipboard="enabled"} else {dom.nClipboard="disabled"};

/* Intersection Observer api (dom.IntersectionObserver.enabled) */
var callback = function(entries, observer) {};
try {
  var observer = new IntersectionObserver(callback);
  dom.intObserver="enabled"
} catch(e) {dom.intObserver="disabled" };

/* requestIdleCallback (dom.requestIdleCallback.enabled) */
if ("requestIdleCallback" in window) {dom.reqIdleCB="enabled"} else {dom.reqIdleCB="disabled"};
