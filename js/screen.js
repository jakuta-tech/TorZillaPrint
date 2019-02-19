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
// use devicePixelRatio if RFP is off
if (window.devicePixelRatio == 1) {
  var jsZoom = Math.round((varDPI/dpi_x)*100).toString();
} else {
  var jsZoom = Math.round(window.devicePixelRatio*100).toString();
};
/* based on FF zoom levels, fixup some numbers */
if (jsZoom == 109) {jsZoom=110};
if (jsZoom == 121) {jsZoom=120};
if (jsZoom == 171) {jsZoom=170};
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

// scrollbar width
// note: this is in the user agent section but everything we need is in screen.js
// only run the function for Firefox
if (isNaN(window.mozInnerScreenX) === false){
  var sbWidth = (window.innerWidth-vw);
  var sbWidthZoom = sbWidth;
  var sbOS = ""; var sbZoom = ""; var strW = "[Windows]"; var strL = "[Linux]"
  if (sbWidth == 0) {sbOS= "[MacOS, mobile device, or floating scrollbars]";}
  else {
    // start with known metrics at preset FF zoom levels
    if (jsZoom == 300) {
      if (sbWidth==6 || 5) {sbOS=strW};
      if (sbWidth==4) {sbOS=strL};
    } else if (jsZoom == 240) {
      if (sbWidth==7) {sbOS=strW};
      if (sbWidth==5) {sbOS=strL};
    } else if (jsZoom == 200) {
      if (sbWidth==9 || 8) {sbOS=strW};
      if (sbWidth==6) {sbOS=strL};
    } else if (jsZoom == 170) {
      if (sbWidth==10) {sbOS=strW};
      if (sbWidth==7) {sbOS=strL};
    } else if (jsZoom == 150) {
      if (sbWidth==12 || 11) {sbOS=strW};
      if (sbWidth==8) {sbOS=strL};
    } else if (jsZoom == 133) {
      if (sbWidth==13) {sbOS=strW};
      if (sbWidth==9) {sbOS=strL};
    } else if (jsZoom == 120) {
      if (sbWidth==14) {sbOS=strW};
      if (sbWidth==10) {sbOS=strL};
    } else if (jsZoom == 110) {
      if (sbWidth==16 || 15) {sbOS=strW};
      if (sbWidth==11) {sbOS=strL};
    } else if (jsZoom == 100) {
      if (sbWidth==17) {sbOS=strW};
      if (sbWidth==12) {sbOS=strL};
    } else if (jsZoom == 90) {
      if (sbWidth==19) {sbOS=strW};
      if (sbWidth==13) {sbOS=strL};
    } else if (jsZoom == 80) {
      if (sbWidth==21) {sbOS=strW};
      if (sbWidth==15) {sbOS=strL};
    } else if (jsZoom == 67) {
      if (sbWidth==26 || 25) {sbOS=strW};
      if (sbWidth==18) {sbOS=strL};
    } else if (jsZoom == 50) {
      if (sbWidth==34) {sbOS=strW};
      if (sbWidth==24) {sbOS=strL};
    } else if (jsZoom == 30) {
      if (sbWidth==57 || 56) {sbOS=strW};
      if (sbWidth==40) {sbOS=strL};
    };
    if (sbOS == "") {
      // not a preset FF zoom and known metric
      if (jsZoom == 100) {}
      else {
        // recalculate width based on zoom: this is not perfect
        if (window.devicePixelRatio == 1) {
          sbWidthZoom = sbWidth * (((varDPI/dpi_x)*100)/100);
        } else {
          sbWidthZoom = sbWidth * window.devicePixelRatio;
        };
      };
      // os logic
      if (sbWidthZoom>=16.5) {sbOS=strW}
        else if (sbWidthZoom>=14.5) {sbOS="[Linux or MacOSX]"}
          else {sbOS=strL};
      // add in notation if this is a best guess
      sbOS = sbOS+" [logical guess]"
    } else {
      // add in notation if this is a known metric
      sbOS = sbOS+" [known metric]"
    };
  };
  // add in zoom info if relevant
  if (jsZoom == 100) {} else { sbZoom = " at "+jsZoom+"% "};
  dom.scrollbarWidth = sbWidth+"px " + sbZoom + sbOS;
};

// css line-height
// note: this is in the user agent section but I want the zoom from screen.js
function getStyle(el,styleProp) {
  el = document.getElementById(el);
  if (el.currentStyle)
    var el = el.currentStyle[styleProp];
    else if (window.getComputedStyle)
      var el = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
  return el;
};
// only run the function for Firefox
if (isNaN(window.mozInnerScreenX) === false){
  var lh = getStyle ('testLH', 'line-height');
  lh = lh.slice(0, -2);
  var lhOS = "";
  if (jsZoom == 100) {
    console.time("vsn62");
    try {console.timeLog("vsn62");
      // FF62 or higher
      if (lh=="19.5") {lhOS="[Android]"}
      else if (lh=="19.2") {lhOS="[MacOS]"}
      else if (lh=="19") {lhOS="[Linux]"}
      else if (lh=="18") {lhOS="[Windows]"}
      else if (lh=="17") {lhOS="[Linux]"}
      else lhOS="[unknown]";
    }
    catch(e) {
      // FF61 or lower
      if (lh=="20") {lhOS="[Windows]"}
      else if (lh=="19.5167") {lhOS="[MacOS]"}
      else if (lh=="19.2") {lhOS="[Windows or Tor Browser]"}
      else if (lh=="19") {lhOS="[Linux]"}
      else if (lh=="17") {lhOS="[Linux]"}
      else lhOS="[unknown]";
    };
    console.timeEnd("vsn62");
  }
  else {
    // zoom not at 100% - css line-height outside 100% is not reliable or unique per OS
    if (lh=="19.2") {lhOS=lhOS+" [Tor Browser detected]"}
  };
  // sbZoom already set in scrollbar width code
  dom.cssLH=lh + "px " + sbZoom + lhOS;
};
