/* TABLES: Screen, User Agent, Math */

'use strict';

/* FUNCTIONS */

function getStyle(el,styleProp) {
  el = document.getElementById(el);
  if (el.currentStyle)
    var el = el.currentStyle[styleProp];
    else if (window.getComputedStyle)
      var el = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
  return el;
};
function getVerNo(){
  //59 or lower
  var verNo = "59 or lower";
  //60
  try {(Object.getOwnPropertyDescriptor(Document.prototype, "body")
    || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "body")).get.call((new DOMParser).parseFromString(
      "<html xmlns='http://www.w3.org/1999/xhtml'><body/></html>","application/xhtml+xml")) !== null; verNo="60";}
  catch(e) {};
  //61
  var str61=" blah";
  try {str61 = str61.trimStart(); verNo="61"} catch(e) {};
  //62
  console.time("ver62");
  try {console.timeLog("ver62"); verNo="62"} catch(e) {};
  console.timeEnd("ver62");
  //63
  if (Symbol.for(`foo`).description == "foo"){ verNo="63"};
  //64
  if (window.screenLeft == undefined){} else { verNo="64"};
  //65
  try {const rtf = new Intl.RelativeTimeFormat("en", {style: "long",}); verNo="65"} catch(e) {};
  //66
  try {
    const string66 = "this is a test for firefox 66";
    const textEncoder = new TextEncoder();
    const utf8 = new Uint8Array(string66.length);
    let encodedResults = textEncoder.encodeInto(string66, utf8);
    verNo="66"}
  catch(e) {};
  //67
  if (!Symbol.hasOwnProperty('matchAll')) {} else { verNo="67+" };
  // reminder: ^^ always append + ONLY on the LAST test
  return verNo;
};

/* SCREEN */

// screen/window
dom.ScrRes = screen.width+" x "+screen.height+" ("+screen.left+","+screen.top+")";
dom.ScrAvail = screen.availWidth+" x "+screen.availHeight+" ("+screen.availLeft+","+screen.availTop+")";
dom.WndOut = window.outerWidth+" x "+window.outerHeight+" ("+window.screenX+","+window.screenY+")";
dom.WndIn = window.innerWidth+" x "+window.innerHeight+" ("+window.mozInnerScreenX+","+window.mozInnerScreenY+")";
dom.PixDepth = screen.pixelDepth;
dom.ColDepth = screen.colorDepth;
dom.fsState = window.fullScreen;
dom.DevPR = window.devicePixelRatio;
// viewport
var e=document.createElement( "div" );
e.style.cssText="position:fixed;top:0;left:0;bottom:0;right:0;";
document.documentElement.insertBefore(e,document.documentElement.firstChild);
var vw=e.offsetWidth;
var vh=e.offsetHeight;
document.documentElement.removeChild(e);
dom.Viewport = vw + " x " + vh;
// full-screen-api.enabled
try {
  if (document.mozFullScreenEnabled) { dom.fsSupport="enabled"; }
  else {dom.fsSupport="disabled"; dom.fsLeak="no"};}
catch(e) {dom.fsSupport="no: " + e.name; dom.fsLeak="no"};
// private window
try {
  var db = indexedDB.open("IsPBMode");
  db.onerror = function() {dom.IsPBMode = "true";};
  db.onsuccess = function() {dom.IsPBMode = "false";};
}
catch(e) {dom.IsPBMode = "unknown: " + e.name;};
// orientation
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
  // dirty hack: doesn't always work e.g. if a smartphone keyboard reduces the height
  if (window.innerHeight === window.innerWidth) return "no idea, you're square!";
  if (window.innerHeight < window.innerWidth) return "landscape";
  return "portrait";
})();
// js dpi
const devicePixelRatio = window.devicePixelRatio || 1;
const dpi_x = Math.round(dom.testdpi.offsetWidth * devicePixelRatio);
const dpi_y = Math.round(dom.testdpi.offsetHeight * devicePixelRatio);
dom.jsDPI = dpi_x;
// matchmedia dpi: handles FF default zoom levels 30%-300%
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
  // fixup some numbers
if (jsZoom == 109) {jsZoom=110};
if (jsZoom == 121) {jsZoom=120};
if (jsZoom == 171) {jsZoom=170};
if (jsZoom == 172) {jsZoom=170};
if (jsZoom == 241) {jsZoom=240};
dom.jsZoom = jsZoom;

/* MATH */

// ECMASCript 1st edtion: using cos values
var strR = ""; var strH = "";
strR = Math.cos(1e251); dom.cos1 = strR; strH = strR;
strR = Math.cos(1e140); dom.cos2 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e12); dom.cos3 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e130); dom.cos4 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e272); dom.cos5 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e0); dom.cos6 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e284); dom.cos7 = strR; strH = strH + "-" + strR;
strR = Math.cos(1e75); dom.cos8 = strR; strH = strH + "-" + strR;
var math1hash = sha1(strH);
var str1math = strH;
dom.math1hash = math1hash;
// ECMASCript 6th edtion
strR = ""; strH = ""; let x; let y;
x = 0.5; strR = Math.log((1 + x) / (1 - x)) / 2; // atanh(0.5)
dom.math1 = strR; strH = strR;
x=1; strR = Math.exp(x) - 1;   // expm1(1)
dom.math2 = strR; strH = strH + "-" + strR;
x = 1; y = Math.exp(x); strR = (y - 1 / y) / 2; // sinh(1)
dom.math3 = strR; strH = strH + "-" + strR;
var math6hash = sha1(strH);
var str6math = strH;
dom.math6hash = math6hash;
// HASH
var mathhash = sha1(str1math+"-"+str6math);
dom.mathhash = mathhash;

/* NAVIGATOR */

dom.nAppName = navigator.appName;
dom.nAppVersion = navigator.appVersion;
dom.nBuildID = navigator.buildID;
dom.nCodeName = navigator.appCodeName;
dom.nOscpu = navigator.oscpu;
dom.nPlatform = navigator.platform;
dom.nProduct = navigator.product;
dom.nProductSub = navigator.productSub;
dom.nUserAgent = navigator.userAgent;

/* USER AGENT */

// chrome:// and resource:// tests only work on Firefox, no need to check first
// browser: chrome: Firefox
// about:logo: desktop 300x236 vs 258x99 android dimensions
var imgLogoA = new Image();
imgLogoA.src = "about:logo";
imgLogoA.style.visibility = "hidden";
document.body.appendChild(imgLogoA);
imgLogoA.addEventListener("load", function() {
  var imgLogoAW = imgLogoA.width;
  if (imgLogoAW == 300) {
    // change displayed resource to icon64 (not on android)
    dom.fdResourceCss.style.backgroundImage="url('chrome://branding/content/icon64.png')";
  };
  if (imgLogoAW > 0) {dom.fdResource = "Firefox"};
  document.body.removeChild(imgLogoA);
});
// browser: chrome: refine if Tor Browser
var imgLogoB = new Image();
imgLogoB.src = "resource://onboarding/img/tor-watermark.png";
imgLogoB.style.visibility = "hidden";
document.body.appendChild(imgLogoB);
imgLogoB.addEventListener("load", function() {
  var imgLogoBW = imgLogoB.width;
  if (imgLogoBW > 0) {dom.fdResource = "Tor Browser"};
  document.body.removeChild(imgLogoB);
});
// browser: errors
var errh = "";
  // InternalError
  try { var err1 = new Array(1);
    function recurse(err1){
      err1[0] = new Array(1);
      recurse(err1[0]);
    }
   recurse(err1);
  } catch(e) {dom.err1=e; errh = errh+e};
  // RangeError
  try { var foodate = new Date(); var bar = new Date(foodate.endDate).toISOString();
  } catch(e) {dom.err2=e; errh = errh+e};
  // ReferenceError
  try {foo=2} catch(e) {dom.err3=e; errh = errh+e};
  // TypeError
  try {
    function foobar() {
      var foo = document.getElementById("bar");
      foo.value = screen.width;
     }
    window.onload = foobar();
  } catch(e) {dom.err4=e; errh = errh+e};
  // TypeError
  try {var bar = new Date(bar[0].endDate).toISOString()} catch(e) {dom.err5=e; errh = errh+e};
  // URIError
  try {decodeURIComponent("%")} catch(e) {dom.err6=e; errh = errh+e};
  // error hash
  errh = sha1(errh); dom.errh = errh;
  if (errh == "7f5472aff63b6ed45eae2af94d1db8b729738d8b") {dom.fdError = "Firefox"};
// browser: math
if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Firefox"};
if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Firefox [32-bit]"};
// browser: feature detection
  // if (isNaN(window.mozInnerScreenX) === false) {"Firefox"};
  // if (isNaN(window.window.scrollMaxX) === false) {"Firefox"};
  // if (navigator.oscpu == undefined){} else {"Firefox"};

// widgets & elements
const iframeWD = document.getElementById("iframeWD");
iframeWD.src = "iframes/widgets.html";
iframeWD.addEventListener("load", function(){
  // loop 13 elements
  var wdA = 1; var wdS = ""; var wdH = "";
  while (wdA < 13) {
    var wdItem = iframeWD.contentWindow.document.getElementById("widget"+wdA);
    wdS = wdItem.offsetWidth + " x " + wdItem.offsetHeight + ", " +
      wdItem.clientWidth + " x " + wdItem.clientHeight + ", " +
      wdItem.scrollWidth + " x " + wdItem.scrollHeight + ", " +
      getComputedStyle(wdItem).getPropertyValue("font-family") + ", " +
      getComputedStyle(wdItem).getPropertyValue("font-size");
    document.getElementById("wid"+wdA).innerHTML = wdS;
    if (wdA == 1) {wdH = wdS} else {wdH = wdH + " - "+wdS};
    wdA++;
  };
  dom.widgetH = sha1(wdH);
});

if (isNaN(window.mozPaintCount) === false){
  dom.fdPaintCount="Firefox";
  // only run these subsequent tests for Firefox

  // browser: version
  var intVerNo = getVerNo();
  dom.versionNo = intVerNo;
  intVerNo = intVerNo.substring(0, 2);

  // os: chrome://
  var b = "chrome://branding/content/";
  var c = "chrome://browser/content/";
  var s = "chrome://browser/skin/";
  var imgUris = [b+'icon64.png', s+'Toolbar-win7.png', s+'sync-horizontalbar-XPVista7.png'];
  var cssUris = [c+'extension-win-panel.css', c+'extension-mac-panel.css'];
  var chromeOS = "Linux"; // default if we can't detect Windows/Android/Mac
    // chrome:// images
    imgUris.forEach(function(imgUri) {
      var img = document.createElement("img");
      img.src = imgUri; img.style.height = "20px"; img.style.width = "20px";
      img.onload = function() {
        if (imgUri === s+"Toolbar-win7.png" || imgUri === s+"sync-horizontalbar-XPVista7.png") {chromeOS ="Windows"};
      };
      img.onerror = function() {if (imgUri === b+"icon64.png") {chromeOS = "Android"};};
    });
    // chrome:// css
    cssUris.forEach(function(cssUri) {
      var css = document.createElement("link");
      css.href = cssUri; css.type = "text/css"; css.rel = "stylesheet";
      document.head.appendChild(css);
      css.onload = function() {
        if (cssUri === c+"extension-win-panel.css") {chromeOS ="Windows"}
        else if (cssUri === c+"extension-mac-panel.css") {chromeOS ="Mac"};
      };
      document.head.removeChild(css);
     });
    // chrome:// results: wait for all the resources to succeed/fail
    setTimeout(function() {dom.fdChromeOS = chromeOS;}, 2000);

  // os: math (refine browser as we go)
  dom.fdMathOS="I just haven't worked out your combo yet"
  if (math1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {dom.fdMathOS="Windows [64-bit]"; dom.fdMath="Firefox [64-bit]"};
  if (math1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {dom.fdMathOS="Windows"; dom.fdMath="Firefox [32-bit]"};
  if (math1hash == "96895e004b623552b9543dcdc030640d1b108816") {dom.fdMathOS="Linux";
    if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMathOS="Linux [64-bit]"};
    if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMathOS="Linux [32-bit]"};};
  if (math1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {dom.fdMathOS="Windows";
    if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Tor Browser [64-bit]"; dom.fdMathOS="Windows [64-bit]"};
    if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Tor Browser [32-bit]"};};
  if (math1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {dom.fdMathOS="Android";};
  if (math1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {dom.fdMathOS="Mac"; dom.fdMath="Firefox [64-bit]";};

  // os: font: use width of the fdCssOS* elements
  // delay it so fonts have loaded: large delay due to slowness of Android
  setTimeout(function(){
    var elCount = 0; var elCssOS = "Android";
    if (dom.fdCssOSW.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Windows"};
    if (dom.fdCssOSL.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Linux"};
    if (dom.fdCssOSM.offsetWidth > 0) {elCount = elCount+1; elCssOS = "Mac"};
    if (elCount == 2 || elCount == 3) {elCssOS = "unknown"};
    dom.fontOS = elCssOS;
  }, 8000);

  // os: strings
  var strW = "[Windows]"; var strWL = "[Windows or Linux]";
  var strWM = "[Windows or Mac]"; var strWLM = "[Windows, Linux or Mac]";
  var strL = "[Linux]"; var strLM = "[Linux or Mac]";
  var strM = "[Mac]"; var strA = "[Android]";

  // os: scrollbar width
  var sbWidth = (window.innerWidth-vw);
  var sbWidthZoom = sbWidth;
  var sbOS = ""; var sbZoom = "";
  // note: only Mac OS X (el capitan or lower) have zero width
  if (sbWidth == 0) {sbOS= "[Mac OS X, mobile or floating scrollbars]";}
  else {
    // start with known metrics at preset FF zoom levels
    if (jsZoom == 300) {
      if (sbWidth==6) {sbOS=strWL};
      if (sbWidth==5) {sbOS=strWM};
      if (sbWidth==4) {sbOS=strL};
    } else if (jsZoom == 240) {
      if (sbWidth==7) {sbOS=strWM};
      if (sbWidth==6) {sbOS=strL};
      if (sbWidth==5) {sbOS=strL};
    } else if (jsZoom == 200) {
      if (sbWidth==9) {sbOS=strW};
      if (sbWidth==8) {sbOS=strWLM};
      if (sbWidth==7) {sbOS=strM};
      if (sbWidth==6) {sbOS=strL};
    } else if (jsZoom == 170) {
      if (sbWidth==10) {sbOS=strWL};
      if (sbWidth==8) {sbOS=strM};
      if (sbWidth==7) {sbOS=strL};
    } else if (jsZoom == 150) {
      if (sbWidth==12) {sbOS=strW};
      if (sbWidth==11) {sbOS=strW};
      if (sbWidth==10) {sbOS=strLM};
      if (sbWidth==8) {sbOS=strL};
    } else if (jsZoom == 133) {
      if (sbWidth==13) {sbOS=strW};
      if (sbWidth==12) {sbOS=strL};
      if (sbWidth==11) {sbOS=strM};
      if (sbWidth==9) {sbOS=strL};
    } else if (jsZoom == 120) {
      if (sbWidth==14) {sbOS=strWL};
      if (sbWidth==12) {sbOS=strM};
      if (sbWidth==10) {sbOS=strL};
    } else if (jsZoom == 110) {
      if (sbWidth==16) {sbOS=strW};
      if (sbWidth==15) {sbOS=strW};
      if (sbWidth==14) {sbOS=strLM};
      if (sbWidth==11) {sbOS=strL};
    } else if (jsZoom == 100) {
      if (sbWidth==17) {sbOS=strW};
      if (sbWidth==16) {sbOS=strL};
      if (sbWidth==15) {sbOS=strM};
      if (sbWidth==12) {sbOS=strL};
    } else if (jsZoom == 90) {
      if (sbWidth==19) {sbOS=strW};
      if (sbWidth==18) {sbOS=strL};
      if (sbWidth==17) {sbOS=strM};
      if (sbWidth==16) {sbOS=strM};
      if (sbWidth==13) {sbOS=strL};
    } else if (jsZoom == 80) {
      if (sbWidth==21) {sbOS=strW};
      if (sbWidth==20) {sbOS=strL};
      if (sbWidth==19) {sbOS=strM};
      if (sbWidth==15) {sbOS=strL};
    } else if (jsZoom == 67) {
      if (sbWidth==26) {sbOS=strW};
      if (sbWidth==25) {sbOS=strW};
      if (sbWidth==24) {sbOS=strL};
      if (sbWidth==23) {sbOS=strM};
      if (sbWidth==22) {sbOS=strM};
      if (sbWidth==18) {sbOS=strL};
    } else if (jsZoom == 50) {
      if (sbWidth==34) {sbOS=strW};
      if (sbWidth==32) {sbOS=strL};
      if (sbWidth==30) {sbOS=strM};
      if (sbWidth==24) {sbOS=strL};
    } else if (jsZoom == 30) {
      if (sbWidth==57) {sbOS=strW};
      if (sbWidth==56) {sbOS=strW};
      if (sbWidth==54) {sbOS=strL};
      if (sbWidth==50) {sbOS=strM};
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
      // os logic: need more Mac / Android data
      // for now at least always return Linux as a minimum
      if (sbWidthZoom>=16.5) {sbOS=strW} else {sbOS=strL};
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

  // os: css line-height
  var lh = getStyle ('testLH', 'line-height');
  lh = lh.slice(0, -2);
  var lhOS = "[unknown]";
  if (jsZoom == 100) {
    if (intVerNo > 61) {
      // FF62 or higher
      if (lh=="19.5") {lhOS=strA} // zoom is not reliable on droid: needs work
      else if (lh=="19.6833") {lhOS=strM}
      else if (lh=="19") {lhOS=strL}
      else if (lh=="18") {lhOS=strW}
      else if (lh=="17") {lhOS=strL};
    }
    else {
      // FF61 or lower
      if (lh=="20") {lhOS=strW}
      else if (lh=="19.6833") {lhOS=strM}
      else if (lh=="19.5167") {lhOS=strM} // never seen this in testing
      else if (lh=="19") {lhOS=strL}
      else if (lh=="17") {lhOS=strL};
    };
  }
  // cannot get 19.2 on any other zoom level when not TB
  if (lh=="19.2") {lhOS=lhOS+" [Tor Browser detected]"}
  // sbZoom already set in scrollbar width code
  dom.cssLH=lh + "px " + sbZoom + lhOS;
};
