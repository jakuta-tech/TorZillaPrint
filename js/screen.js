/* TABLE: Screen */

'use strict';

// Test DPI
const devicePixelRatio = window.devicePixelRatio || 1;
const dpi_x = Math.round(dom.testdpi.offsetWidth * devicePixelRatio);
const dpi_y = Math.round(dom.testdpi.offsetHeight * devicePixelRatio);
dom.jsDPI = dpi_x;

// handles FF default zoom levels 30%-300%
const varDPI = (function () {
for (var i = 27; i < 2000; i++) {
    if (matchMedia("(max-resolution: " + i + "dpi)").matches === true) {
        return i;}}return i;})();
dom.mmDPI = varDPI;

// zoom: calculate from js dpi vs mediaMatch dpi
var jsZoom = Math.round((varDPI/dpi_x)*100).toString();
/* based on FF zoom levels, fixup some numbers */
if (jsZoom == 109) {jsZoom=110};
if (jsZoom == 121) {jsZoom=120};
if (jsZoom == 172) {jsZoom=170};
if (jsZoom == 241) {jsZoom=240};
dom.jsZoom = jsZoom;

dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
dom.WndIn = window.innerWidth+" x "+window.innerHeight+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
dom.PixDepth = screen.pixelDepth;
dom.ColDepth = screen.colorDepth;

dom.fsState = window.fullScreen;
// full-screen-api.enabled
try {
  if (document.mozFullScreenEnabled) { dom.fsSupport="enabled"; }
  else {dom.fsSupport="disabled"; dom.fsLeak="no"};}
catch(e) {dom.fsSupport="no: " + e.name; dom.fsLeak="no"};

dom.ScrOrient = (function () {
	var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
	if (orientation === "landscape-primary") return "landscape";
	if (orientation === "landscape-secondary") return "landscape upside down";
	if (orientation === "portrait-secondary" || orientation === "portrait-primary") return "portrait";
	if (orientation === undefined) return "undefined";
})();
dom.mmOrient = (function () {
	if (window.matchMedia("(orientation: portrait)").matches) return "portrait";
	if (window.matchMedia("(orientation: landscape)").matches) return "landscape";
})();
dom.mathOrient = (function () {
// this method is a dirty hack: doesn't always work e.g. if a smartphone keyboard reduces the height
	if (window.innerHeight === window.innerWidth) return "no idea, you're square!";
	if (window.innerHeight < window.innerWidth) return "landscape";
	return "portrait";
})();
dom.DevPR = window.devicePixelRatio;

// PB Mode
try {
  var db = indexedDB.open("IsPBMode");
  db.onerror = function() {dom.IsPBMode = "true";};
  db.onsuccess = function() {dom.IsPBMode = "false";};
}
catch(e) {dom.IsPBMode = "unknown: " + e.name;};

// viewport
var e=document.createElement( "div" );
e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
document.documentElement.insertBefore(e,document.documentElement.firstChild);
var vw=e.offsetWidth;
var vh=e.offsetHeight;
document.documentElement.removeChild(e);
dom.Viewport = vw + " x " + vh;

// scrollbar width: note: this is in the language section but everything we need is in screen.js
var sWidth = (window.innerWidth-vw);
if (jsZoom == 100) {
  dom.scrollbarWidth=sWidth+"px [os logic to follow]";
}
else {
  // recalculate width based on zoom
  dom.scrollbarWidth=sWidth+"px at "+jsZoom+"% zoom [os logic to follow]";
};
