/* TABLES: Screen, User Agent, Math, chrome:// */

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

// browser: chrome: Firefox
// about:logo: desktop 300x236 vs 258x99 android dimensions
var imgLogoA = new Image();
imgLogoA.src = "about:logo";
imgLogoA.style.visibility = "hidden";
document.body.appendChild(imgLogoA);
imgLogoA.addEventListener("load", function() {
  var imgLogoAW = imgLogoA.width;
  if (imgLogoAW == 300) {
    dom.fdResourceOS = "Desktop";
    // change displayed resource to icon64 (not on android)
    document.getElementById("fdResourceCss").style.backgroundImage="url('chrome://branding/content/icon64.png')";
  };
  if (imgLogoAW == 258) {dom.fdResourceOS = "Android"};
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
if (isNaN(window.mozPaintCount) === false){
  dom.fdPaintCount="Firefox";
  // only run these subsequent tests for Firefox
  // browser: version
  var intVerNo = getVerNo();
  dom.versionNo = intVerNo;
  intVerNo = intVerNo.substring(0, 2);
  // math: os (refine browser)
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

  // font: os: use width of the fdCssOS* elements: delay it so fonts have loaded */
  setTimeout(function(){
    var elCount = 0; var elCssOS = "";
    var elCssOSW = document.getElementById("fdCssOSW").offsetWidth;
    if (elCssOSW > 0) {elCount = elCount+1; elCssOS = "Windows"};
    var elCssOSL = document.getElementById("fdCssOSL").offsetWidth;
    if (elCssOSL > 0) {elCount = elCount+1; elCssOS = "Linux"};
    var elCssOSM = document.getElementById("fdCssOSM").offsetWidth;
    if (elCssOSM > 0) {elCount = elCount+1; elCssOS = "Mac"};
    // set a default
    dom.fontOS = "unknown";
    // if all three don't load then it's android
    if (elCount == 0) {dom.fontOS="Android"};
    // if only one loads then it's that one
    if (elCount == 1) {dom.fontOS=elCssOS};
  }, 4000);

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
      else if (lh=="19.5167") {lhOS=strM}
      else if (lh=="19") {lhOS=strL}
      else if (lh=="17") {lhOS=strL};
    };
  }
  // cannot get 19.2 on any other zoom level when not TB
  if (lh=="19.2") {lhOS=lhOS+" [Tor Browser detected]"}
  // sbZoom already set in scrollbar width code
  dom.cssLH=lh + "px " + sbZoom + lhOS;
};

/* CHROME:// */

dom.jsHash = "tests are running";
dom.cssHash = "give it 5 seconds";
var c = "chrome://browser/content/";
var g = "chrome://global/content/";
var s = "chrome://browser/skin/";
var b = "chrome://branding/content/";

var jsUris = [c+'ext-android.js', c+'aboutDialog-appUpdater.js', c+'aboutDialog.js', c+'aboutNetError.js',
 c+'aboutPrivateBrowsing.js', c+'aboutRestartRequired.js', c+'aboutRobots.js', c+'aboutSessionRestore.js', c+'aboutTabCrashed.js',
 c+'aboutTabGroupsMigration.js', c+'aboutaccounts/aboutaccounts.js', c+'abouthealthreport/abouthealth.js', c+'abouthome/aboutHome.js',
 c+'blockedSite.js', c+'bookmarks/bookmarksPanel.js', c+'bookmarks/sidebarUtils.js', c+'browser-addons.js',
 c+'browser-allTabsMenu.js', c+'browser-captivePortal.js', c+'browser-compacttheme.js', c+'browser-ctrlTab.js',
 c+'browser-customization.js', c+'browser-data-submission-info-bar.js', c+'browser-devedition.js', c+'browser-eme.js',
 c+'browser-feeds.js', c+'browser-fullScreen.js', c+'browser-fullScreenAndPointerLock.js', c+'browser-fullZoom.js',
 c+'browser-fxaccounts.js', c+'browser-gestureSupport.js', c+'browser-media.js', c+'browser-pageActions.js',
 c+'browser-places.js', c+'browser-plugins.js', c+'browser-refreshblocker.js', c+'browser-safebrowsing.js',
 c+'browser-sidebar.js', c+'browser-siteIdentity.js', c+'browser-social.js', c+'browser-sync.js', c+'browser-syncui.js',
 c+'browser-tabsintitlebar.js', c+'browser-thumbnails.js', c+'browser-trackingprotection.js', c+'browser-webrender.js',
 c+'browser.js', c+'child/ext-browser.js', c+'child/ext-devtools-inspectedWindow.js', c+'child/ext-devtools-network.js',
 c+'child/ext-devtools-panels.js', c+'child/ext-devtools.js', c+'child/ext-menus.js', c+'child/ext-omnibox.js',
 c+'child/ext-tabs.js', c+'content-UITour.js', c+'content-refreshblocker.js', c+'content-sessionStore.js', c+'content.js',
 c+'contentSearchUI.js', c+'customizableui/panelUI.js', c+'devtools/animationinspector/animation-controller.js',
 c+'devtools/animationinspector/animation-panel.js', c+'devtools/app-manager/connection-footer.js', c+'devtools/app-manager/device.js',
 c+'devtools/app-manager/index.js', c+'devtools/app-manager/manifest-editor.js', c+'devtools/app-manager/projects.js',
 c+'devtools/app-manager/template.js', c+'devtools/app-manager/utils.js', c+'devtools/canvasdebugger.js', c+'devtools/canvasdebugger/callslist.js',
 c+'devtools/canvasdebugger/snapshotslist.js', c+'devtools/codemirror/activeline.js', c+'devtools/codemirror/brace-fold.js',
 c+'devtools/codemirror/clike.js', c+'devtools/codemirror/closebrackets.js', c+'devtools/codemirror/codemirror.js',
 c+'devtools/codemirror/comment-fold.js', c+'devtools/codemirror/comment.js', c+'devtools/codemirror/css.js', c+'devtools/codemirror/dialog.js',
 c+'devtools/codemirror/emacs.js', c+'devtools/codemirror/foldcode.js', c+'devtools/codemirror/foldgutter.js', c+'devtools/codemirror/htmlmixed.js',
 c+'devtools/codemirror/javascript.js', c+'devtools/codemirror/matchbrackets.js', c+'devtools/codemirror/search.js',
 c+'devtools/codemirror/searchcursor.js', c+'devtools/codemirror/show-hint.js', c+'devtools/codemirror/sublime.js', c+'devtools/codemirror/tern.js',
 c+'devtools/codemirror/trailingspace.js', c+'devtools/codemirror/vim.js', c+'devtools/codemirror/xml-fold.js', c+'devtools/codemirror/xml.js',
 c+'devtools/commandline/commands-index.js', c+'devtools/connect.js', c+'devtools/d3.js', c+'devtools/dagre-d3.js',
 c+'devtools/debugger-controller.js', c+'devtools/debugger-panes.js', c+'devtools/debugger-toolbar.js', c+'devtools/debugger-view.js',
 c+'devtools/debugger/event-listeners-view.js', c+'devtools/debugger/filter-view.js', c+'devtools/debugger/global-search-view.js',
 c+'devtools/debugger/options-view.js', c+'devtools/debugger/sources-view.js', c+'devtools/debugger/stack-frames-classic-view.js',
 c+'devtools/debugger/stack-frames-view.js', c+'devtools/debugger/toolbar-view.js', c+'devtools/debugger/tracer-view.js', c+'devtools/debugger/utils.js',
 c+'devtools/debugger/variable-bubble-view.js', c+'devtools/debugger/watch-expressions-view.js', c+'devtools/debugger/workers-view.js',
 c+'devtools/fontinspector/font-inspector.js', c+'devtools/frame-script-utils.js', c+'devtools/framework/toolbox-options.js',
 c+'devtools/framework/toolbox-process-window.js', c+'devtools/layoutview/view.js', c+'devtools/memory/controller.js',
 c+'devtools/netmonitor-controller.js', c+'devtools/netmonitor-view.js', c+'devtools/performance/performance-controller.js',
 c+'devtools/performance/performance-view.js', c+'devtools/performance/system.js', c+'devtools/performance/views/details-js-call-tree.js',
 c+'devtools/performance/views/details-js-flamegraph.js', c+'devtools/performance/views/details-memory-call-tree.js',
 c+'devtools/performance/views/details-memory-flamegraph.js', c+'devtools/performance/views/details-optimizations.js', c+'devtools/performance/views/details-subview.js',
 c+'devtools/performance/views/details-waterfall.js', c+'devtools/performance/views/details.js', c+'devtools/performance/views/frames-list.js',
 c+'devtools/performance/views/jit-optimizations.js', c+'devtools/performance/views/optimizations-list.js', c+'devtools/performance/views/overview.js',
 c+'devtools/performance/views/recordings.js', c+'devtools/performance/views/toolbar.js', c+'devtools/profiler.js',
 c+'devtools/profiler/cleopatra/js/ProgressReporter.js', c+'devtools/profiler/cleopatra/js/devtools.js', c+'devtools/profiler/cleopatra/js/parser.js',
 c+'devtools/profiler/cleopatra/js/parserWorker.js', c+'devtools/profiler/cleopatra/js/strings.js', c+'devtools/profiler/cleopatra/js/tree.js',
 c+'devtools/profiler/cleopatra/js/ui.js', c+'devtools/projecteditor-loader.js', c+'devtools/promisedebugger/promise-controller.js',
 c+'devtools/promisedebugger/promise-debugger.js', c+'devtools/promisedebugger/promise-panel.js', c+'devtools/readdir.js',
 c+'devtools/responsivedesign/resize-commands.js', c+'devtools/scratchpad-commands.js', c+'devtools/scratchpad.js', c+'devtools/shadereditor.js',
 c+'devtools/theme-switching.js', c+'devtools/timeline/timeline.js', c+'devtools/ui-profile.js', c+'devtools/ui-recordings.js',
 c+'devtools/webaudioeditor-controller.js', c+'devtools/webaudioeditor-view.js', c+'devtools/webaudioeditor/controller.js',
 c+'devtools/webaudioeditor/includes.js', c+'devtools/webaudioeditor/models.js', c+'devtools/webaudioeditor/views/automation.js',
 c+'devtools/webaudioeditor/views/context.js', c+'devtools/webaudioeditor/views/inspector.js', c+'devtools/webaudioeditor/views/properties.js',
 c+'devtools/webaudioeditor/views/utils.js', c+'downloads/allDownloadsView.js', c+'downloads/allDownloadsViewOverlay.js',
 c+'downloads/contentAreaDownloadsView.js', c+'downloads/downloads.js', c+'downloads/indicator.js', c+'ext-bookmarks.js',
 c+'ext-browser.js', c+'ext-browserAction.js', c+'ext-browsingData.js', c+'ext-c-browser.js', c+'ext-c-contextMenus.js',
 c+'ext-c-devtools-inspectedWindow.js', c+'ext-c-devtools-network.js', c+'ext-c-devtools-panels.js', c+'ext-c-devtools.js',
 c+'ext-c-menus.js', c+'ext-c-omnibox.js', c+'ext-c-tabs.js', c+'ext-chrome-settings-overrides.js', c+'ext-commands.js',
 c+'ext-contextMenus.js', c+'ext-desktop-runtime.js', c+'ext-devtools-inspectedWindow.js', c+'ext-devtools-network.js',
 c+'ext-devtools-panels.js', c+'ext-devtools.js', c+'ext-find.js', c+'ext-geckoProfiler.js', c+'ext-history.js',
 c+'ext-menus.js', c+'ext-omnibox.js', c+'ext-pageAction.js', c+'ext-pkcs11.js', c+'ext-sessions.js',
 c+'ext-sidebarAction.js', c+'ext-tabs.js', c+'ext-theme.js', c+'ext-url-overrides.js', c+'ext-utils.js',
 c+'ext-windows.js', c+'feeds/subscribe.js', c+'loop/js/client.js', c+'loop/js/contacts.js', c+'loop/js/conversation.js',
 c+'loop/js/conversationAppStore.js', c+'loop/js/conversationViews.js', c+'loop/js/desktopRouter.js', c+'loop/js/feedbackViews.js',
 c+'loop/js/otconfig.js', c+'loop/js/panel.js', c+'loop/js/roomStore.js', c+'loop/js/roomViews.js', c+'loop/libs/l10n.js',
 c+'loop/libs/sdk.js', c+'loop/sdk-content/js/dynamic_config.min.js', c+'loop/shared/js/actions.js', c+'loop/shared/js/activeRoomStore.js',
 c+'loop/shared/js/conversationStore.js', c+'loop/shared/js/dispatcher.js', c+'loop/shared/js/feedbackApiClient.js', c+'loop/shared/js/feedbackStore.js',
 c+'loop/shared/js/feedbackViews.js', c+'loop/shared/js/fxOSActiveRoomStore.js', c+'loop/shared/js/linkifiedTextView.js', c+'loop/shared/js/mixins.js',
 c+'loop/shared/js/models.js', c+'loop/shared/js/otSdkDriver.js', c+'loop/shared/js/roomStates.js', c+'loop/shared/js/roomStore.js',
 c+'loop/shared/js/router.js', c+'loop/shared/js/store.js', c+'loop/shared/js/textChatStore.js', c+'loop/shared/js/textChatView.js',
 c+'loop/shared/js/urlRegExps.js', c+'loop/shared/js/utils.js', c+'loop/shared/js/validate.js', c+'loop/shared/js/views.js',
 c+'loop/shared/js/websocket.js', c+'loop/shared/libs/backbone-1.1.2.js', c+'loop/shared/libs/backbone-1.2.1.js', c+'loop/shared/libs/jquery-2.1.0.js',
 c+'loop/shared/libs/jquery-2.1.4.js', c+'loop/shared/libs/lodash-2.4.1.js', c+'loop/shared/libs/lodash-3.9.3.js', c+'loop/shared/libs/react-0.10.0.js',
 c+'loop/shared/libs/react-0.11.1.js', c+'loop/shared/libs/react-0.11.2.js', c+'loop/shared/libs/react-0.12.2.js', c+'migration/migration.js',
 c+'newtab/newTab.js', c+'newtab/preloaderContent.js', c+'nsContextMenu.js', c+'pageinfo/feeds.js', c+'pageinfo/pageInfo.js',
 c+'pageinfo/permissions.js', c+'pageinfo/security.js', c+'parent/ext-bookmarks.js', c+'parent/ext-browser.js',
 c+'parent/ext-browserAction.js', c+'parent/ext-browsingData.js', c+'parent/ext-chrome-settings-overrides.js', c+'parent/ext-commands.js',
 c+'parent/ext-devtools-inspectedWindow.js', c+'parent/ext-devtools-network.js', c+'parent/ext-devtools-panels.js', c+'parent/ext-devtools.js',
 c+'parent/ext-find.js', c+'parent/ext-geckoProfiler.js', c+'parent/ext-history.js', c+'parent/ext-menus.js',
 c+'parent/ext-omnibox.js', c+'parent/ext-pageAction.js', c+'parent/ext-pkcs11.js', c+'parent/ext-sessions.js',
 c+'parent/ext-sidebarAction.js', c+'parent/ext-tabs.js', c+'parent/ext-url-overrides.js', c+'parent/ext-windows.js',
 c+'places/bookmarkProperties.js', c+'places/bookmarksSidebar.js', c+'places/browserPlacesViews.js', c+'places/controller.js',
 c+'places/editBookmark.js', c+'places/editBookmarkOverlay.js', c+'places/history-panel.js', c+'places/historySidebar.js',
 c+'places/moveBookmarks.js', c+'places/places.js', c+'places/treeView.js', c+'pocket/main.js',
 c+'pocket/panels/js/dictionary.js', c+'pocket/panels/js/messages.js', c+'pocket/panels/js/saved.js', c+'pocket/panels/js/signup.js',
 c+'pocket/panels/js/tmpl.js', c+'pocket/panels/js/vendor/handlebars.runtime.js', c+'pocket/panels/js/vendor/jquery-2.1.1.min.js',
 c+'pocket/panels/js/vendor/jquery.tokeninput.min.js', c+'pocket/pktApi.js', c+'preferences/aboutPermissions.js', c+'preferences/advanced.js',
 c+'preferences/applicationManager.js', c+'preferences/applications.js', c+'preferences/blocklists.js', c+'preferences/clearSiteData.js',
 c+'preferences/colors.js', c+'preferences/connection.js', c+'preferences/containers.js', c+'preferences/content.js',
 c+'preferences/cookies.js', c+'preferences/fonts.js', c+'preferences/in-content-new/advanced.js', c+'preferences/in-content-new/applications.js',
 c+'preferences/in-content-new/containers.js', c+'preferences/in-content-new/findInPage.js', c+'preferences/in-content-new/main.js',
 c+'preferences/in-content-new/preferences.js', c+'preferences/in-content-new/privacy.js', c+'preferences/in-content-new/search.js',
 c+'preferences/in-content-new/subdialogs.js', c+'preferences/in-content-new/sync.js', c+'preferences/in-content/advanced.js',
 c+'preferences/in-content/applications.js', c+'preferences/in-content/containers.js', c+'preferences/in-content/content.js',
 c+'preferences/in-content/extensionControlled.js', c+'preferences/in-content/findInPage.js', c+'preferences/in-content/home.js',
 c+'preferences/in-content/main.js', c+'preferences/in-content/preferences.js', c+'preferences/in-content/privacy.js',
 c+'preferences/in-content/search.js', c+'preferences/in-content/security.js', c+'preferences/in-content/subdialogs.js',
 c+'preferences/in-content/sync.js', c+'preferences/in-content/syncDisconnect.js', c+'preferences/languages.js', c+'preferences/main.js',
 c+'preferences/permissions.js', c+'preferences/preferences.js', c+'preferences/privacy.js', c+'preferences/sanitize.js',
 c+'preferences/search.js', c+'preferences/security.js', c+'preferences/selectBookmark.js', c+'preferences/siteDataRemoveSelected.js',
 c+'preferences/siteDataSettings.js', c+'preferences/sitePermissions.js', c+'preferences/sync.js', c+'preferences/tabs.js',
 c+'preferences/translation.js', c+'readinglist/sidebar.js', c+'remote-newtab/newTab.js', c+'safeMode.js', c+'sanitize.js',
 c+'sanitizeDialog.js', c+'search/engineManager.js', c+'search/searchReset.js', c+'searchSuggestionUI.js',
 c+'setDesktopBackground.js', c+'social-content.js', c+'sync/aboutSyncTabs.js', c+'sync/addDevice.js', c+'sync/customize.js',
 c+'sync/genericChange.js', c+'sync/progress.js', c+'sync/quota.js', c+'sync/setup.js', c+'sync/utils.js',
 c+'syncedtabs/sidebar.js', c+'tab-content.js', c+'tabbrowser.js', c+'tabview-content.js', c+'tabview.js',
 c+'utilityOverlay.js', c+'web-panels.js', c+'webext-panels.js', c+'webrtcIndicator.js', g+'BrowserElementChild.js',
 g+'BrowserElementChildPreload.js', g+'BrowserElementCopyPaste.js', g+'BrowserElementPanning.js', g+'BrowserElementPanningAPZDisabled.js',
 g+'PushServiceChildPreload.js', g+'TopLevelVideoDocument.js', g+'XPCNativeWrapper.js', g+'about.js', g+'aboutAbout.js',
 g+'aboutCache.js', g+'aboutCheckerboard.js', g+'aboutCompartments.js', g+'aboutMedia.js', g+'aboutMemory.js',
 g+'aboutNetworking.js', g+'aboutPerformance.js', g+'aboutProfiles.js', g+'aboutRights.js', g+'aboutServiceWorkers.js',
 g+'aboutSupport.js', g+'aboutTelemetry.js', g+'aboutUrlClassifier.js', g+'aboutwebrtc/aboutWebrtc.js',
 g+'accessibility/content-script.js', g+'alerts/alert.js', g+'appPicker.js', g+'backgroundPageThumbsContent.js',
 g+'bindings/calendar.js', g+'bindings/datekeeper.js', g+'bindings/datepicker.js', g+'bindings/spinner.js', g+'bindings/timekeeper.js',
 g+'bindings/timepicker.js', g+'browser-child.js', g+'browser-content.js', g+'charsetOverlay.js', g+'commonDialog.js',
 g+'config.js', g+'console.js', g+'content-HybridContentTelemetry.js', g+'contentAreaUtils.js', g+'crashes.js',
 g+'customElements.js', g+'customizeCharset.js', g+'customizeToolbar.js', g+'dialogOverlay.js', g+'editMenuOverlay.js',
 g+'elements/general.js', g+'elements/stringbundle.js', g+'extensions.js', g+'filepicker.js', g+'findUtils.js',
 g+'finddialog.js', g+'forms.js', g+'globalOverlay.js', g+'inlineSpellCheckUI.js', g+'l10n.js',
 g+'macWindowMenu.js', g+'manifestMessages.js', g+'nsClipboard.js', g+'nsDragAndDrop.js', g+'nsUserSettings.js',
 g+'post-fork-preload.js', g+'preferencesBindings.js', g+'preload.js', g+'printPageSetup.js', g+'printPreviewProgress.js',
 g+'printProgress.js', g+'printUtils.js', g+'printdialog.js', g+'printjoboptions.js', g+'process-content.js',
 g+'reader/JSDOMParser.js', g+'reader/Readability.js', g+'reader/aboutReader.js', g+'reader/readerWorker.js', g+'remote-test-ipc.js',
 g+'resetProfile.js', g+'select-child.js', g+'selectDialog.js', g+'strres.js', g+'test-ipcbrowser-chrome.js',
 g+'test-ipcbrowser-content.js', g+'treeUtils.js', g+'viewPartialSource.js', g+'viewSource-content.js', g+'viewSource.js',
 g+'viewSourceUtils.js', g+'viewZoomOverlay.js'
];

var imgUris = [b+'about-logo.png', b+'about-logo@2x.png', b+'about-wordmark.png', b+'about-wordmark.svg', b+'about.png',
 b+'icon128.png', b+'icon16.png', b+'icon32.png', b+'icon48.png', b+'icon64.png',
 b+'identity-icons-brand.png', b+'identity-icons-brand.svg', b+'identity-icons-brand@2x.png', b+'silhouette-40.svg',
 c+'aboutRobots-icon.png', c+'aboutRobots-widget-left.png', c+'aboutaccounts/images/fox.png', c+'aboutaccounts/images/graphic_sync_intro.png',
 c+'aboutaccounts/images/graphic_sync_intro@2x.png', c+'abouthome/addons.png', c+'abouthome/addons@2x.png', c+'abouthome/apps.png',
 c+'abouthome/apps@2x.png', c+'abouthome/bookmarks.png', c+'abouthome/bookmarks@2x.png', c+'abouthome/downloads.png',
 c+'abouthome/downloads@2x.png', c+'abouthome/history.png', c+'abouthome/history@2x.png', c+'abouthome/mozilla.png',
 c+'abouthome/mozilla.svg', c+'abouthome/mozilla@2x.png', c+'abouthome/restore-large.png', c+'abouthome/restore-large@2x.png',
 c+'abouthome/restore.png', c+'abouthome/restore@2x.png', c+'abouthome/settings.png', c+'abouthome/settings@2x.png',
 c+'abouthome/snippet1.png', c+'abouthome/snippet1@2x.png', c+'abouthome/snippet2.png', c+'abouthome/snippet2@2x.png',
 c+'abouthome/sync.png', c+'abouthome/sync@2x.png', c+'aboutneterror/alert.svg', c+'aboutneterror/info.svg',
 c+'default-theme-icon.svg', c+'defaultthemes/1.footer.jpg', c+'defaultthemes/1.header.jpg', c+'defaultthemes/1.icon.jpg',
 c+'defaultthemes/1.preview.jpg', c+'defaultthemes/2.footer.jpg', c+'defaultthemes/2.header.jpg', c+'defaultthemes/2.icon.jpg',
 c+'defaultthemes/2.preview.jpg', c+'defaultthemes/3.footer.png', c+'defaultthemes/3.header.png', c+'defaultthemes/3.icon.png',
 c+'defaultthemes/3.preview.png', c+'defaultthemes/4.footer.png', c+'defaultthemes/4.header.png', c+'defaultthemes/4.icon.png',
 c+'defaultthemes/4.preview.png', c+'defaultthemes/5.footer.png', c+'defaultthemes/5.header.png', c+'defaultthemes/5.icon.jpg',
 c+'defaultthemes/5.preview.jpg', c+'defaultthemes/compact.header.png', c+'defaultthemes/compactdark.icon.svg', c+'defaultthemes/compactlight.icon.svg',
 c+'defaultthemes/dark.icon.svg', c+'defaultthemes/devedition.header.png', c+'defaultthemes/devedition.icon.png', c+'defaultthemes/light.icon.svg',
 c+'devtools/framework/dev-edition-logo.png', c+'devtools/profiler/cleopatra/images/circlearrow.svg', c+'devtools/profiler/cleopatra/images/noise.png',
 c+'devtools/profiler/cleopatra/images/throbber.svg', c+'devtools/profiler/cleopatra/images/treetwisty.svg', c+'extension.svg', c+'gcli_sec_bad.svg',
 c+'gcli_sec_good.svg', c+'gcli_sec_moderate.svg', c+'history-swipe-arrow.svg', c+'illustrations/error-connection-failure.svg',
 c+'illustrations/error-malformed-url.svg', c+'illustrations/error-server-not-found.svg', c+'illustrations/under-construction.svg',
 c+'loop/sdk-content/images/rtc/access-denied-chrome.png', c+'loop/sdk-content/images/rtc/access-denied-copy-firefox.png',
 c+'loop/sdk-content/images/rtc/access-denied-firefox.png', c+'loop/sdk-content/images/rtc/access-predenied-chrome.png',
 c+'loop/sdk-content/images/rtc/access-prompt-chrome.png', c+'loop/sdk-content/images/rtc/audioonly-publisher.png', c+'loop/sdk-content/images/rtc/audioonly-subscriber.png',
 c+'loop/sdk-content/images/rtc/buttons.png', c+'loop/sdk-content/images/rtc/mic-off.png', c+'loop/sdk-content/images/rtc/mic-on.png',
 c+'loop/sdk-content/images/rtc/speaker-off.png', c+'loop/sdk-content/images/rtc/speaker-on.png', c+'loop/shared/img/02.png',
 c+'loop/shared/img/02@2x.png', c+'loop/shared/img/animated-spinner.svg', c+'loop/shared/img/audio-call-avatar.svg',
 c+'loop/shared/img/audio-inverse-14x14.png', c+'loop/shared/img/audio-inverse-14x14@2x.png', c+'loop/shared/img/avatars.svg',
 c+'loop/shared/img/beta-ribbon.svg', c+'loop/shared/img/chatbubble-arrow-left.svg', c+'loop/shared/img/chatbubble-arrow-right.svg',
 c+'loop/shared/img/check.svg', c+'loop/shared/img/dropdown-inverse.png', c+'loop/shared/img/dropdown-inverse@2x.png',
 c+'loop/shared/img/ellipsis-v.svg', c+'loop/shared/img/empty_contacts.svg', c+'loop/shared/img/empty_conversations.svg',
 c+'loop/shared/img/empty_search.svg', c+'loop/shared/img/facemute-14x14.png', c+'loop/shared/img/facemute-14x14@2x.png',
 c+'loop/shared/img/firefox-avatar.svg', c+'loop/shared/img/hangup-inverse-14x14.png', c+'loop/shared/img/hangup-inverse-14x14@2x.png',
 c+'loop/shared/img/happy.png', c+'loop/shared/img/hello_logo.svg', c+'loop/shared/img/helloicon.svg', c+'loop/shared/img/icon_32.png',
 c+'loop/shared/img/icon_64.png', c+'loop/shared/img/icons-10x10.svg', c+'loop/shared/img/icons-14x14.svg', c+'loop/shared/img/icons-16x16.svg',
 c+'loop/shared/img/movistar.png', c+'loop/shared/img/movistar@2x.png', c+'loop/shared/img/mute-inverse-14x14.png',
 c+'loop/shared/img/mute-inverse-14x14@2x.png', c+'loop/shared/img/sad.png', c+'loop/shared/img/sad_hello_icon_64x64.svg',
 c+'loop/shared/img/spinner.png', c+'loop/shared/img/spinner.svg', c+'loop/shared/img/spinner@2x.png', c+'loop/shared/img/svg/audio-hover.svg',
 c+'loop/shared/img/svg/audio-mute-hover.svg', c+'loop/shared/img/svg/audio-mute.svg', c+'loop/shared/img/svg/audio.svg',
 c+'loop/shared/img/svg/exit.svg', c+'loop/shared/img/svg/glyph-account-16x16.svg', c+'loop/shared/img/svg/glyph-email-16x16.svg',
 c+'loop/shared/img/svg/glyph-facebook-16x16.svg', c+'loop/shared/img/svg/glyph-help-16x16.svg', c+'loop/shared/img/svg/glyph-link-16x16.svg',
 c+'loop/shared/img/svg/glyph-settings-16x16.svg', c+'loop/shared/img/svg/glyph-signin-16x16.svg', c+'loop/shared/img/svg/glyph-signout-16x16.svg',
 c+'loop/shared/img/svg/glyph-user-16x16.svg', c+'loop/shared/img/svg/media-group-left-hover.svg', c+'loop/shared/img/svg/media-group-right-hover.svg',
 c+'loop/shared/img/svg/media-group.svg', c+'loop/shared/img/svg/settings-hover.svg', c+'loop/shared/img/svg/settings.svg',
 c+'loop/shared/img/svg/sharing-active.svg', c+'loop/shared/img/svg/sharing-hover.svg', c+'loop/shared/img/svg/sharing-pending.svg',
 c+'loop/shared/img/svg/sharing.svg', c+'loop/shared/img/svg/video-hover.svg', c+'loop/shared/img/svg/video-mute-hover.svg',
 c+'loop/shared/img/svg/video-mute.svg', c+'loop/shared/img/svg/video.svg', c+'loop/shared/img/telefonica.png', c+'loop/shared/img/telefonica@2x.png',
 c+'loop/shared/img/video-inverse-14x14.png', c+'loop/shared/img/video-inverse-14x14@2x.png', c+'loop/shared/img/vivo.png',
 c+'loop/shared/img/vivo@2x.png', c+'microsoft-translator-attribution.png', c+'pocket/panels/img/pocketerror@1x.png',
 c+'pocket/panels/img/pocketerror@2x.png', c+'pocket/panels/img/pocketlogo@1x.png', c+'pocket/panels/img/pocketlogo@2x.png',
 c+'pocket/panels/img/pocketlogosolo@1x.png', c+'pocket/panels/img/pocketlogosolo@2x.png', c+'pocket/panels/img/pocketmenuitem16.png',
 c+'pocket/panels/img/pocketmenuitem16@2x.png', c+'pocket/panels/img/pocketsignup_button@1x.png', c+'pocket/panels/img/pocketsignup_button@2x.png',
 c+'pocket/panels/img/pocketsignup_devices@1x.png', c+'pocket/panels/img/pocketsignup_devices@2x.png', c+'pocket/panels/img/pocketsignup_hero@1x.png',
 c+'pocket/panels/img/pocketsignup_hero@2x.png', c+'pocket/panels/img/signup_firefoxlogo@1x.png', c+'pocket/panels/img/signup_firefoxlogo@2x.png',
 c+'pocket/panels/img/signup_help@1x.png', c+'pocket/panels/img/signup_help@2x.png', c+'pocket/panels/img/tag_close@1x.png',
 c+'pocket/panels/img/tag_close@2x.png', c+'pocket/panels/img/tag_closeactive@1x.png', c+'pocket/panels/img/tag_closeactive@2x.png',
 c+'static-robot.png', c+'usercontext-briefcase.svg', c+'usercontext-cart.svg', c+'usercontext-circle.svg',
 c+'usercontext-dollar.svg', c+'usercontext-fingerprint.svg', c+'usercontext.svg', s+'Geolocation-16.png', s+'Geolocation-16@2x.png',
 s+'Geolocation-64.png', s+'Geolocation-64@2x.png', s+'Info-XP.png', s+'Info.png', s+'KUI-background.png',
 s+'Metro_Glyph-inverted.png', s+'Metro_Glyph-menuPanel.png', s+'Metro_Glyph.png', s+'Privacy-16-XP.png', s+'Privacy-16.png',
 s+'Privacy-32.png', s+'Privacy-48.png', s+'Push-16.png', s+'Push-16@2x.png', s+'Push-64.png', s+'Push-64@2x.png',
 s+'Search.png', s+'Search@2x.png', s+'Secure-Glyph.png', s+'Secure-Glyph@2x.png', s+'Secure.png', s+'Secure24-XP.png',
 s+'Secure24.png', s+'Security-broken.png', s+'Toolbar-XP.png', s+'Toolbar-aero.png', s+'Toolbar-aero@2x.png',
 s+'Toolbar-background-noise.png', s+'Toolbar-inverted.png', s+'Toolbar-inverted@2x.png', s+'Toolbar-lunaSilver.png', s+'Toolbar-small.png',
 s+'Toolbar-win7.png', s+'Toolbar-win7@2x.png', s+'Toolbar-win8.png', s+'Toolbar-win8@2x.png', s+'Toolbar.png',
 s+'Toolbar@2x.png', s+'aboutCertError_sectionCollapsed-rtl.png', s+'aboutCertError_sectionCollapsed.png', s+'aboutCertError_sectionExpanded.png',
 s+'aboutNetError_alert.svg', s+'aboutNetError_info.svg', s+'aboutSessionRestore-window-icon.png', s+'accessibility-active.svg',
 s+'accessibility.svg', s+'actionicon-tab-XPVista7.png', s+'actionicon-tab.png', s+'actionicon-tab@2x.png', s+'addons.svg',
 s+'addons/addon-badge.svg', s+'addons/addon-install-anchor.svg', s+'addons/addon-install-blocked.svg', s+'addons/addon-install-confirm.svg',
 s+'addons/addon-install-downloading.svg', s+'addons/addon-install-error.svg', s+'addons/addon-install-installed.svg', s+'addons/addon-install-restart.svg',
 s+'addons/addon-install-warning.svg', s+'arrow-dropdown.svg', s+'arrow-left.svg', s+'back-12.svg', s+'back-large.svg',
 s+'back.svg', s+'bad-content-blocked-16.png', s+'bad-content-blocked-16@2x.png', s+'bad-content-blocked-64.png',
 s+'bad-content-blocked-64@2x.png', s+'bad-content-unblocked-16.png', s+'bad-content-unblocked-16@2x.png', s+'bad-content-unblocked-64.png',
 s+'bad-content-unblocked-64@2x.png', s+'badge-add-engine.png', s+'badge-add-engine@2x.png', s+'bookmark-animation.svg', s+'bookmark-hollow.svg',
 s+'bookmark-star-on-tray.svg', s+'bookmark.svg', s+'bookmarks-toolbar.svg', s+'bookmarksMenu.svg', s+'caption-buttons.svg',
 s+'cert-error.svg', s+'characterEncoding.svg', s+'check-animation.svg', s+'check.svg', s+'chevron-animation.svg',
 s+'chevron.svg', s+'click-to-play-warning-stripes.png', s+'compacttheme/loading-inverted.png', s+'compacttheme/loading-inverted@2x.png',
 s+'compacttheme/urlbar-history-dropmarker.svg', s+'connection-mixed-active-loaded.svg', s+'connection-mixed-passive-loaded.svg', s+'connection-secure.svg',
 s+'containers.svg', s+'content-contextmenu.svg', s+'controlcenter/arrow-subview-back.svg', s+'controlcenter/arrow-subview.svg',
 s+'controlcenter/conn-degraded.svg', s+'controlcenter/conn-not-secure.svg', s+'controlcenter/conn-secure.svg', s+'controlcenter/connection.svg',
 s+'controlcenter/extension.svg', s+'controlcenter/mcb-disabled.svg', s+'controlcenter/permissions.svg', s+'controlcenter/tracking-protection-disabled.svg',
 s+'controlcenter/tracking-protection.svg', s+'controlcenter/warning-gray.svg', s+'controlcenter/warning-yellow.svg',
 s+'customizableui/background-noise-toolbar.png', s+'customizableui/customize-illustration-rtl.png', s+'customizableui/customize-illustration-rtl@2x.png',
 s+'customizableui/customize-illustration.png', s+'customizableui/customize-illustration@2x.png', s+'customizableui/customize-titleBar-toggle.png',
 s+'customizableui/customize-titleBar-toggle@2x.png', s+'customizableui/customizeMode-gridTexture.png', s+'customizableui/customizeMode-separatorHorizontal.png',
 s+'customizableui/customizeMode-separatorVertical.png', s+'customizableui/density-compact.svg', s+'customizableui/density-normal.svg',
 s+'customizableui/density-touch.svg', s+'customizableui/empty-overflow-panel.png', s+'customizableui/empty-overflow-panel@2x.png',
 s+'customizableui/info-icon-customizeTip.png', s+'customizableui/info-icon-customizeTip@2x.png', s+'customizableui/menu-arrow.svg',
 s+'customizableui/menuPanel-customizeFinish.png', s+'customizableui/menuPanel-customizeFinish@2x.png', s+'customizableui/panelarrow-customizeTip.png',
 s+'customizableui/panelarrow-customizeTip@2x.png', s+'customizableui/subView-arrow-back-inverted-rtl.png', s+'customizableui/subView-arrow-back-inverted-rtl@2x.png',
 s+'customizableui/subView-arrow-back-inverted.png', s+'customizableui/subView-arrow-back-inverted@2x.png', s+'customizableui/thumburger-XP.png',
 s+'customizableui/thumburger-XP@2x.png', s+'customizableui/thumburger-aero.png', s+'customizableui/thumburger-aero@2x.png',
 s+'customizableui/thumburger-inverted.png', s+'customizableui/thumburger-inverted@2x.png', s+'customizableui/thumburger-lunaSilver.png',
 s+'customizableui/thumburger-lunaSilver@2x.png', s+'customizableui/thumburger-win8.png', s+'customizableui/thumburger-win8@2x.png',
 s+'customizableui/thumburger.png', s+'customizableui/thumburger@2x.png', s+'customizableui/whimsy-bw.png', s+'customizableui/whimsy-bw@2x.png',
 s+'customizableui/whimsy.png', s+'customizableui/whimsy@2x.png', s+'customize.svg', s+'devedition/search.svg', s+'devedition/urlbar-arrow.png',
 s+'devedition/urlbar-arrow@2x.png', s+'devedition/urlbar-history-dropmarker.svg', s+'developer.svg', s+'device-desktop.svg',
 s+'device-mobile.svg', s+'device-phone.svg', s+'device-tablet.svg', s+'devtools/add.svg', s+'devtools/alerticon-warning.png',
 s+'devtools/alerticon-warning@2x.png', s+'devtools/animation-fast-track.svg', s+'devtools/app-manager/add.svg', s+'devtools/app-manager/default-app-icon.png',
 s+'devtools/app-manager/error.svg', s+'devtools/app-manager/index-icons.svg', s+'devtools/app-manager/noise.png', s+'devtools/app-manager/plus.svg',
 s+'devtools/app-manager/remove.svg', s+'devtools/app-manager/rocket.svg', s+'devtools/app-manager/warning.svg', s+'devtools/arrow-e.png',
 s+'devtools/arrow-e@2x.png', s+'devtools/background-noise-toolbar.png', s+'devtools/breadcrumbs-divider@2x.png', s+'devtools/breadcrumbs-scrollbutton.png',
 s+'devtools/breadcrumbs-scrollbutton@2x.png', s+'devtools/close.png', s+'devtools/close@2x.png', s+'devtools/command-console.png',
 s+'devtools/command-console@2x.png', s+'devtools/command-eyedropper.png', s+'devtools/command-eyedropper@2x.png', s+'devtools/command-frames.png',
 s+'devtools/command-frames@2x.png', s+'devtools/command-paintflashing.png', s+'devtools/command-paintflashing@2x.png', s+'devtools/command-pick.png',
 s+'devtools/command-pick@2x.png', s+'devtools/command-responsivemode.png', s+'devtools/command-responsivemode@2x.png', s+'devtools/command-rulers.png',
 s+'devtools/command-rulers@2x.png', s+'devtools/command-scratchpad.png', s+'devtools/command-scratchpad@2x.png', s+'devtools/command-screenshot.png',
 s+'devtools/command-screenshot@2x.png', s+'devtools/command-tilt.png', s+'devtools/command-tilt@2x.png', s+'devtools/commandline-icon.png',
 s+'devtools/commandline-icon@2x.png', s+'devtools/controls.png', s+'devtools/controls@2x.png', s+'devtools/cubic-bezier-swatch.png',
 s+'devtools/cubic-bezier-swatch@2x.png', s+'devtools/debugger-blackbox-eye.png', s+'devtools/debugger-blackbox.png', s+'devtools/debugger-blackbox@2x.png',
 s+'devtools/debugger-collapse.png', s+'devtools/debugger-collapse@2x.png', s+'devtools/debugger-expand.png', s+'devtools/debugger-expand@2x.png',
 s+'devtools/debugger-pause.png', s+'devtools/debugger-pause@2x.png', s+'devtools/debugger-play.png', s+'devtools/debugger-play@2x.png',
 s+'devtools/debugger-prettyprint.png', s+'devtools/debugger-prettyprint@2x.png', s+'devtools/debugger-step-in.png', s+'devtools/debugger-step-in@2x.png',
 s+'devtools/debugger-step-out.png', s+'devtools/debugger-step-out@2x.png', s+'devtools/debugger-step-over.png', s+'devtools/debugger-step-over@2x.png',
 s+'devtools/debugger-toggleBreakpoints.png', s+'devtools/debugger-toggleBreakpoints@2x.png', s+'devtools/dock-bottom-maximize@2x.png',
 s+'devtools/dock-bottom-minimize@2x.png', s+'devtools/dock-bottom@2x.png', s+'devtools/dock-side@2x.png', s+'devtools/dropmarker.png',
 s+'devtools/dropmarker.svg', s+'devtools/editor-breakpoint.png', s+'devtools/editor-breakpoint@2x.png', s+'devtools/editor-debug-location.png',
 s+'devtools/editor-debug-location@2x.png', s+'devtools/editor-error.png', s+'devtools/fast-forward.png', s+'devtools/fast-forward@2x.png',
 s+'devtools/filetype-dir-close.svg', s+'devtools/filetype-dir-open.svg', s+'devtools/filetype-globe.svg', s+'devtools/filetype-store.svg',
 s+'devtools/filter-swatch.svg', s+'devtools/filters.svg', s+'devtools/itemArrow-dark-ltr.png', s+'devtools/itemArrow-dark-ltr.svg',
 s+'devtools/itemArrow-dark-rtl.png', s+'devtools/itemArrow-dark-rtl.svg', s+'devtools/itemArrow-ltr.svg', s+'devtools/itemArrow-rtl.svg',
 s+'devtools/itemToggle-light.png', s+'devtools/itemToggle.png', s+'devtools/itemToggle@2x.png', s+'devtools/layout-background-grid.png',
 s+'devtools/magnifying-glass-light.png', s+'devtools/magnifying-glass-light@2x.png', s+'devtools/magnifying-glass.png', s+'devtools/magnifying-glass@2x.png',
 s+'devtools/newtab-inverted.png', s+'devtools/newtab-inverted@2x.png', s+'devtools/newtab.png', s+'devtools/newtab@2x.png',
 s+'devtools/noise.png', s+'devtools/option-icon.png', s+'devtools/performance-icons.svg', s+'devtools/power.svg',
 s+'devtools/profiler-stopwatch-checked.svg', s+'devtools/profiler-stopwatch.png', s+'devtools/profiler-stopwatch.svg',
 s+'devtools/projecteditor/file-icons-sheet@2x.png', s+'devtools/pseudo-class.svg', s+'devtools/responsive-background.png',
 s+'devtools/responsive-horizontal-resizer.png', s+'devtools/responsive-horizontal-resizer@2x.png', s+'devtools/responsive-se-resizer.png',
 s+'devtools/responsive-se-resizer@2x.png', s+'devtools/responsive-vertical-resizer.png', s+'devtools/responsive-vertical-resizer@2x.png',
 s+'devtools/responsiveui-home.png', s+'devtools/responsiveui-rotate.png', s+'devtools/responsiveui-rotate@2x.png', s+'devtools/responsiveui-screenshot.png',
 s+'devtools/responsiveui-screenshot@2x.png', s+'devtools/responsiveui-touch.png', s+'devtools/responsiveui-touch@2x.png', s+'devtools/rewind.png',
 s+'devtools/rewind@2x.png', s+'devtools/search-clear-dark.svg', s+'devtools/search-clear-failed.svg', s+'devtools/search-clear-light.svg',
 s+'devtools/timeline-filter.svg', s+'devtools/toggle-tools.png', s+'devtools/toggle-tools@2x.png', s+'devtools/tool-debugger-paused.svg',
 s+'devtools/tool-debugger.svg', s+'devtools/tool-inspector.svg', s+'devtools/tool-network.svg', s+'devtools/tool-options.svg',
 s+'devtools/tool-profiler-active.svg', s+'devtools/tool-profiler.svg', s+'devtools/tool-scratchpad.svg', s+'devtools/tool-shadereditor.svg',
 s+'devtools/tool-storage.svg', s+'devtools/tool-styleeditor.svg', s+'devtools/tool-webaudio.svg', s+'devtools/tool-webconsole.svg',
 s+'devtools/tooltip/arrow-horizontal-dark.png', s+'devtools/tooltip/arrow-horizontal-dark@2x.png', s+'devtools/tooltip/arrow-horizontal-light.png',
 s+'devtools/tooltip/arrow-horizontal-light@2x.png', s+'devtools/tooltip/arrow-vertical-dark.png', s+'devtools/tooltip/arrow-vertical-dark@2x.png',
 s+'devtools/tooltip/arrow-vertical-light.png', s+'devtools/tooltip/arrow-vertical-light@2x.png', s+'devtools/tracer-icon.png', s+'devtools/tracer-icon@2x.png',
 s+'devtools/undock@2x.png', s+'devtools/vview-delete.png', s+'devtools/vview-delete@2x.png', s+'devtools/vview-edit.png',
 s+'devtools/vview-edit@2x.png', s+'devtools/vview-lock.png', s+'devtools/vview-lock@2x.png', s+'devtools/vview-open-inspector.png',
 s+'devtools/vview-open-inspector@2x.png', s+'devtools/webconsole.png', s+'devtools/webconsole.svg', s+'devtools/webconsole@2x.png',
 s+'dots.png', s+'dots@2x.png', s+'download.svg', s+'downloads/buttons-XP.png', s+'downloads/buttons.png',
 s+'downloads/buttons@2x.png', s+'downloads/download-blocked.svg', s+'downloads/download-glow-XPVista7.png', s+'downloads/download-glow-menuPanel-XPVista7.png',
 s+'downloads/download-glow-menuPanel-win7.png', s+'downloads/download-glow-menuPanel.png', s+'downloads/download-glow-menuPanel@2x.png',
 s+'downloads/download-glow.png', s+'downloads/download-glow@2x.png', s+'downloads/download-icons.svg', s+'downloads/download-notification-finish.png',
 s+'downloads/download-notification-finish@2x.png', s+'downloads/download-notification-start.png', s+'downloads/download-notification-start@2x.png',
 s+'downloads/download-summary.png', s+'downloads/download-summary.svg', s+'downloads/download-summary@2x.png', s+'downloads/menubutton-dropmarker.svg',
 s+'downloads/notification-start-animation.svg', s+'drm-icon.svg', s+'e10s-64@2x.png', s+'edit-copy.svg', s+'edit-cut.svg',
 s+'edit-paste.svg', s+'email-link.svg', s+'favicon-search-16.svg', s+'feed.svg', s+'feeds/audioFeedIcon.png',
 s+'feeds/audioFeedIcon16.png', s+'feeds/feedIcon-XP.png', s+'feeds/feedIcon.png', s+'feeds/feedIcon16-XP.png', s+'feeds/feedIcon16.png',
 s+'feeds/videoFeedIcon.png', s+'feeds/videoFeedIcon16.png', s+'filters.svg', s+'find.svg', s+'folder.svg', s+'forget.svg',
 s+'forward.svg', s+'fullscreen-darknoise.png', s+'fullscreen-enter.svg', s+'fullscreen-exit.svg', s+'fullscreen.svg',
 s+'fullscreen/insecure.svg', s+'fullscreen/secure.svg', s+'fxa/android.png', s+'fxa/android@2x.png', s+'fxa/default-avatar.png',
 s+'fxa/default-avatar.svg', s+'fxa/default-avatar@2x.png', s+'fxa/default-profile-image.svg', s+'fxa/ios.png', s+'fxa/ios@2x.png',
 s+'fxa/logo.png', s+'fxa/logo@2x.png', s+'fxa/sync-illustration-issue.svg', s+'fxa/sync-illustration.png', s+'fxa/sync-illustration.svg',
 s+'fxa/sync-illustration@2x.png', s+'gear.svg', s+'heartbeat-icon.svg', s+'heartbeat-star-lit.svg', s+'heartbeat-star-off.svg',
 s+'help.svg', s+'history.svg', s+'home.svg', s+'icon-search-64.svg', s+'identity-XP.png', s+'identity-icon-hover.svg',
 s+'identity-icon-notice-hover.svg', s+'identity-icon-notice.svg', s+'identity-icon.svg', s+'identity-icons-generic.png',
 s+'identity-icons-generic@2x.png', s+'identity-icons-https-ev.png', s+'identity-icons-https-ev@2x.png', s+'identity-icons-https-mixed-active.png',
 s+'identity-icons-https-mixed-active@2x.png', s+'identity-icons-https-mixed-display.png', s+'identity-icons-https-mixed-display@2x.png',
 s+'identity-icons-https.png', s+'identity-icons-https@2x.png', s+'identity-mixed-active-blocked.svg', s+'identity-mixed-active-loaded.svg',
 s+'identity-mixed-passive-loaded.svg', s+'identity-not-secure.svg', s+'identity-secure.svg', s+'identity.png', s+'identity@2x.png',
 s+'illustrations/error-session-restore.svg', s+'info.svg', s+'keyhole-circle.png', s+'keyhole-circle@2x.png', s+'keyhole-forward-mask.svg',
 s+'library-bookmark-animation.svg', s+'library.svg', s+'link.svg', s+'lion/places/toolbar.png', s+'lion/tabbrowser/alltabs-box-bkgnd-icon.png',
 s+'lion/tabview/tabview.png', s+'lion/toolbarbutton-dropmarker.png', s+'livemark-folder-XP.png', s+'livemark-folder.png',
 s+'loop/menuPanel-aero.png', s+'loop/menuPanel-aero@2x.png', s+'loop/menuPanel.png', s+'loop/menuPanel@2x.png', s+'loop/toolbar-XP.png',
 s+'loop/toolbar-XP@2x.png', s+'loop/toolbar-aero.png', s+'loop/toolbar-aero@2x.png', s+'loop/toolbar-inverted.png',
 s+'loop/toolbar-inverted@2x.png', s+'loop/toolbar-lunaSilver.png', s+'loop/toolbar-lunaSilver@2x.png', s+'loop/toolbar-win8.png',
 s+'loop/toolbar-win8@2x.png', s+'loop/toolbar.png', s+'loop/toolbar@2x.png', s+'magnifier.png', s+'magnifier@2px.png',
 s+'magnifier@2x.png', s+'mail.svg', s+'mask.png', s+'mask@2x.png', s+'menu-back-XP.png', s+'menu-back.png',
 s+'menu-badged.svg', s+'menu-forward-XP.png', s+'menu-forward.png', s+'menu.svg', s+'menuPanel-aero.png',
 s+'menuPanel-aero@2x.png', s+'menuPanel-customize.png', s+'menuPanel-customize@2x.png', s+'menuPanel-exit.png', s+'menuPanel-exit@2x.png',
 s+'menuPanel-help.png', s+'menuPanel-help@2x.png', s+'menuPanel-small-aero.png', s+'menuPanel-small-aero@2x.png', s+'menuPanel-small.png',
 s+'menuPanel-small.svg', s+'menuPanel-small@2x.png', s+'menuPanel.png', s+'menuPanel.svg', s+'menuPanel@2x.png',
 s+'mixed-content-blocked-16.png', s+'mixed-content-blocked-64.png', s+'monitor.png', s+'monitor_16-10.png', s+'new-tab.svg',
 s+'new-window.svg', s+'newtab/close.png', s+'newtab/controls.png', s+'newtab/controls.svg', s+'newtab/whimsycorn.png',
 s+'notification-16.png', s+'notification-16@2x.png', s+'notification-64.png', s+'notification-64@2x.png', s+'notification-icons.svg',
 s+'notification-icons/autoplay-media-blocked.svg', s+'notification-icons/autoplay-media.svg', s+'notification-icons/camera-blocked.svg',
 s+'notification-icons/camera.svg', s+'notification-icons/canvas-blocked.svg', s+'notification-icons/canvas.svg', s+'notification-icons/default-info.svg',
 s+'notification-icons/desktop-notification-blocked.svg', s+'notification-icons/desktop-notification.svg', s+'notification-icons/focus-tab-by-prompt.svg',
 s+'notification-icons/geo-blocked.svg', s+'notification-icons/geo-detailed.svg', s+'notification-icons/geo.svg', s+'notification-icons/indexedDB-blocked.svg',
 s+'notification-icons/indexedDB.svg', s+'notification-icons/login-detailed.svg', s+'notification-icons/login.svg', s+'notification-icons/microphone-blocked.svg',
 s+'notification-icons/microphone-detailed.svg', s+'notification-icons/microphone.svg', s+'notification-icons/midi.svg',
 s+'notification-icons/persistent-storage-blocked.svg', s+'notification-icons/persistent-storage.svg', s+'notification-icons/plugin-badge.svg',
 s+'notification-icons/plugin-blocked.svg', s+'notification-icons/plugin.svg', s+'notification-icons/popup-subitem.svg', s+'notification-icons/popup.svg',
 s+'notification-icons/screen-blocked.svg', s+'notification-icons/screen.svg', s+'notification-icons/update.svg', s+'notification-icons/webauthn.svg',
 s+'notification-pluginAlert.png', s+'notification-pluginAlert@2x.png', s+'notification-pluginBlocked.png', s+'notification-pluginBlocked@2x.png',
 s+'notification-pluginNormal.png', s+'notification-pluginNormal@2x.png', s+'open.svg', s+'page-action.svg', s+'page-livemarks.png',
 s+'page-livemarks@2x.png', s+'pageInfo-XP.png', s+'pageInfo.png', s+'panel-expander-closed.png', s+'panel-expander-closed@2x.png',
 s+'panel-expander-open.png', s+'panel-expander-open@2x.png', s+'panel-icon-arrow-left.svg', s+'panel-icon-arrow-right.svg',
 s+'panel-icon-cancel.svg', s+'panel-icon-folder.svg', s+'panel-icon-magnifier.svg', s+'panel-icon-retry.svg', s+'panel-icons.svg',
 s+'panel-plus-sign.png', s+'panic-panel/header-small.png', s+'panic-panel/header-small@2x.png', s+'panic-panel/header.png',
 s+'panic-panel/header@2x.png', s+'panic-panel/icons.png', s+'panic-panel/icons@2x.png', s+'places/allBookmarks-XP.png',
 s+'places/allBookmarks.png', s+'places/autocomplete-star-XPVista7.png', s+'places/autocomplete-star.png', s+'places/autocomplete-star@2x.png',
 s+'places/bookmark-XP.png', s+'places/bookmark.png', s+'places/bookmarks-menu-arrow.png', s+'places/bookmarks-notification-finish.png',
 s+'places/bookmarks-notification-finish@2x.png', s+'places/bookmarksMenu-XP.png', s+'places/bookmarksMenu.png', s+'places/bookmarksMenu.svg',
 s+'places/bookmarksToolbar-XP.png', s+'places/bookmarksToolbar-menuPanel-XP.png', s+'places/bookmarksToolbar-menuPanel.png',
 s+'places/bookmarksToolbar-menuPanel@2x.png', s+'places/bookmarksToolbar.png', s+'places/bookmarksToolbar.svg', s+'places/bookmarksToolbar@2x.png',
 s+'places/calendar-XP.png', s+'places/calendar.png', s+'places/downloads.png', s+'places/expander-closed-active.png',
 s+'places/expander-closed.png', s+'places/expander-open-active.png', s+'places/expander-open.png', s+'places/folder-live.svg',
 s+'places/folder-smart.svg', s+'places/folder.svg', s+'places/folderDropArrow.png', s+'places/folderDropArrow@2x.png',
 s+'places/history-XP.png', s+'places/history.png', s+'places/history.svg', s+'places/history@2x.png', s+'places/libraryToolbar-XP.png',
 s+'places/libraryToolbar.png', s+'places/livemark-item.png', s+'places/minus-active.png', s+'places/minus.png', s+'places/plus-active.png',
 s+'places/plus.png', s+'places/query-XP.png', s+'places/query.png', s+'places/query@2x.png', s+'places/star-icons.png',
 s+'places/star-icons@2x.png', s+'places/starred48-XP.png', s+'places/starred48.png', s+'places/starred48@2x.png', s+'places/tag-XP.png',
 s+'places/tag.png', s+'places/tag.svg', s+'places/tag@2x.png', s+'places/toolbar.png', s+'places/toolbarDropMarker-XP.png',
 s+'places/toolbarDropMarker.png', s+'places/unfiledBookmarks.png', s+'places/unfiledBookmarks.svg', s+'places/unfiledBookmarks@2x.png',
 s+'places/unsortedBookmarks-XP.png', s+'places/unsortedBookmarks.png', s+'places/unstarred48.png', s+'pluginInstall-16.png',
 s+'pluginInstall-16@2x.png', s+'pluginInstall-64.png', s+'pluginInstall-64@2x.png', s+'pointerLock-16.png', s+'pointerLock-16@2x.png',
 s+'pointerLock-64.png', s+'pointerLock-64@2x.png', s+'preferences/Options-XP.png', s+'preferences/Options-sync.png',
 s+'preferences/Options.png', s+'preferences/alwaysAsk-XP.png', s+'preferences/alwaysAsk.png', s+'preferences/application-XP.png',
 s+'preferences/application.png', s+'preferences/checkbox-aero.png', s+'preferences/checkbox-classic.png', s+'preferences/checkbox-xp.png',
 s+'preferences/checkbox.png', s+'preferences/checkbox@2x.png', s+'preferences/in-content-new/icons.svg', s+'preferences/in-content-new/search-arrow-indicator.svg',
 s+'preferences/in-content/check.png', s+'preferences/in-content/check@2x.png', s+'preferences/in-content/critters-postcard.jpg',
 s+'preferences/in-content/default-profile-image.svg', s+'preferences/in-content/dropdown-disabled.png', s+'preferences/in-content/dropdown-disabled@2x.png',
 s+'preferences/in-content/dropdown.png', s+'preferences/in-content/dropdown@2x.png', s+'preferences/in-content/face-sad.svg',
 s+'preferences/in-content/face-smile.svg', s+'preferences/in-content/fxa-avatar.svg', s+'preferences/in-content/general.svg', s+'preferences/in-content/header.png',
 s+'preferences/in-content/header@2x.png', s+'preferences/in-content/help-glyph.png', s+'preferences/in-content/help-glyph@2x.png',
 s+'preferences/in-content/icons.png', s+'preferences/in-content/icons.svg', s+'preferences/in-content/icons@2x.png', s+'preferences/in-content/logo-android.svg',
 s+'preferences/in-content/logo-ios.svg', s+'preferences/in-content/no-search-bar.svg', s+'preferences/in-content/no-search-results.svg',
 s+'preferences/in-content/privacy-security.svg', s+'preferences/in-content/search-arrow-indicator.svg', s+'preferences/in-content/search-bar.svg',
 s+'preferences/in-content/search.svg', s+'preferences/in-content/sorter.png', s+'preferences/in-content/sorter@2x.png', s+'preferences/in-content/sync-devices.svg',
 s+'preferences/in-content/sync.svg', s+'preferences/mail-XP.png', s+'preferences/mail.png', s+'preferences/saveFile-XP.png',
 s+'preferences/saveFile.png', s+'print.svg', s+'private-browsing.svg', s+'privateBrowsing.svg', s+'privatebrowsing-mask-short.png',
 s+'privatebrowsing-mask-short@2x.png', s+'privatebrowsing-mask-tabstrip-XPVista7.png', s+'privatebrowsing-mask-tabstrip-win7.png',
 s+'privatebrowsing-mask-tabstrip.png', s+'privatebrowsing-mask-titlebar-XPVista7-tall.png', s+'privatebrowsing-mask-titlebar-XPVista7.png',
 s+'privatebrowsing-mask-titlebar-win7-tall.png', s+'privatebrowsing-mask-titlebar-win7.png', s+'privatebrowsing-mask-titlebar.png', s+'privatebrowsing-mask.png',
 s+'privatebrowsing-mask@2x.png', s+'privatebrowsing/attention.png', s+'privatebrowsing/attention@2x.png', s+'privatebrowsing/check.png',
 s+'privatebrowsing/check.svg', s+'privatebrowsing/check@2x.png', s+'privatebrowsing/favicon.svg', s+'privatebrowsing/mask.svg',
 s+'privatebrowsing/private-browsing.svg', s+'privatebrowsing/shield-page.png', s+'privatebrowsing/shield-page@2x.png',
 s+'privatebrowsing/tracking-protection-off.svg', s+'privatebrowsing/tracking-protection.svg', s+'quit.svg', s+'reader-tour.png',
 s+'reader-tour@2x.png', s+'readerMode.svg', s+'readinglist/icons.svg', s+'readinglist/readinglist-icon.svg', s+'reload-stop-go-XPVista7.png',
 s+'reload-stop-go-XPVista7@2x.png', s+'reload-stop-go-preWin10.png', s+'reload-stop-go-preWin10@2x.png', s+'reload-stop-go-win7.png',
 s+'reload-stop-go-win7@2x.png', s+'reload-stop-go.png', s+'reload-stop-go@2x.png', s+'reload-to-stop.svg', s+'reload.svg',
 s+'restore-session.svg', s+'save.svg', s+'search-arrow-go.svg', s+'search-engine-placeholder.png', s+'search-engine-placeholder@2x.png',
 s+'search-glass.svg', s+'search-history-icon.svg', s+'search-indicator-add-engine.png', s+'search-indicator-add-engine@2x.png',
 s+'search-indicator-badge-add.png', s+'search-indicator-badge-add.svg', s+'search-indicator-badge-add@2x.png', s+'search-indicator-magnifying-glass.svg',
 s+'search-indicator.png', s+'search-indicator@2x.png', s+'search-pref.png', s+'searchbar-dropdown-arrow-XP.png',
 s+'searchbar-dropdown-arrow.png', s+'searchbar-dropmarker.png', s+'searchbar-dropmarker@2x.png', s+'send-to-device.svg',
 s+'session-restore.svg', s+'settings.svg', s+'share.svg', s+'sidebar/close.svg', s+'sidebars-right.svg', s+'sidebars.svg',
 s+'slowStartup-16.png', s+'social/chat-icons.png', s+'social/chat-icons.svg', s+'social/gear_clicked.png', s+'social/gear_default.png',
 s+'social/services-16.png', s+'social/services-16@2x.png', s+'social/services-64.png', s+'social/services-64@2x.png',
 s+'social/share-button-active.png', s+'social/share-button.png', s+'stop-to-reload.svg', s+'stop.svg', s+'subtle-pattern.png',
 s+'sync-128.png', s+'sync-16.png', s+'sync-32.png', s+'sync-bg.png', s+'sync-desktopIcon.png', s+'sync-desktopIcon.svg',
 s+'sync-horizontalbar-XPVista7.png', s+'sync-horizontalbar-XPVista7@2x.png', s+'sync-horizontalbar-win7.png', s+'sync-horizontalbar-win7@2x.png',
 s+'sync-horizontalbar.png', s+'sync-horizontalbar@2x.png', s+'sync-mobileIcon.png', s+'sync-mobileIcon.svg', s+'sync-notification-24.png',
 s+'sync.svg', s+'syncProgress-horizontalbar-XPVista7.png', s+'syncProgress-horizontalbar-XPVista7@2x.png', s+'syncProgress-horizontalbar-win7.png',
 s+'syncProgress-horizontalbar-win7@2x.png', s+'syncProgress-horizontalbar.png', s+'syncProgress-horizontalbar@2x.png', s+'syncProgress-menuPanel.png',
 s+'syncProgress-menuPanel@2x.png', s+'syncProgress-toolbar-XPVista7.png', s+'syncProgress-toolbar-XPVista7@2x.png', s+'syncProgress-toolbar-inverted.png',
 s+'syncProgress-toolbar-inverted@2x.png', s+'syncProgress-toolbar.png', s+'syncProgress-toolbar@2x.png', s+'synced-tabs.svg',
 s+'tab-crashed.svg', s+'tab.svg', s+'tabbrowser/alltabs-box-bkgnd-icon-inverted.png', s+'tabbrowser/alltabs-box-bkgnd-icon-inverted@2x.png',
 s+'tabbrowser/alltabs-box-bkgnd-icon.png', s+'tabbrowser/alltabs-box-bkgnd-icon@2x.png', s+'tabbrowser/alltabs-inverted.png', s+'tabbrowser/alltabs.png',
 s+'tabbrowser/badge-audio-playing.svg', s+'tabbrowser/connecting.png', s+'tabbrowser/connecting@2x.png', s+'tabbrowser/crashed.svg',
 s+'tabbrowser/indicator-tab-attention.svg', s+'tabbrowser/loading-20fps.svg', s+'tabbrowser/loading-30fps.svg', s+'tabbrowser/loading-burst.svg',
 s+'tabbrowser/loading.png', s+'tabbrowser/loading.svg', s+'tabbrowser/loading@2x.png', s+'tabbrowser/newtab-XPVista7.png',
 s+'tabbrowser/newtab-XPVista7.svg', s+'tabbrowser/newtab-XPVista7@2x.png', s+'tabbrowser/newtab-inverted-XPVista7.png', s+'tabbrowser/newtab-inverted-XPVista7.svg',
 s+'tabbrowser/newtab-inverted-XPVista7@2x.png', s+'tabbrowser/newtab-inverted-win7.svg', s+'tabbrowser/newtab-inverted.png', s+'tabbrowser/newtab-inverted.svg',
 s+'tabbrowser/newtab-inverted@2x.png', s+'tabbrowser/newtab-win7.svg', s+'tabbrowser/newtab.png', s+'tabbrowser/newtab.svg',
 s+'tabbrowser/newtab@2x.png', s+'tabbrowser/pendingpaint.png', s+'tabbrowser/tab-active-middle.png', s+'tabbrowser/tab-active-middle@2x.png',
 s+'tabbrowser/tab-arrow-left-XPVista7.png', s+'tabbrowser/tab-arrow-left-XPVista7.svg', s+'tabbrowser/tab-arrow-left-XPVista7@2x.png',
 s+'tabbrowser/tab-arrow-left-inverted.png', s+'tabbrowser/tab-arrow-left-inverted.svg', s+'tabbrowser/tab-arrow-left-inverted@2x.png',
 s+'tabbrowser/tab-arrow-left-win7.svg', s+'tabbrowser/tab-arrow-left.png', s+'tabbrowser/tab-arrow-left.svg', s+'tabbrowser/tab-arrow-left@2x.png',
 s+'tabbrowser/tab-arrow-right-inverted.png', s+'tabbrowser/tab-arrow-right-inverted@2x.png', s+'tabbrowser/tab-arrow-right.png',
 s+'tabbrowser/tab-arrow-right@2x.png', s+'tabbrowser/tab-audio-blocked.svg', s+'tabbrowser/tab-audio-muted.svg', s+'tabbrowser/tab-audio-playing.svg',
 s+'tabbrowser/tab-audio-small.svg', s+'tabbrowser/tab-audio.svg', s+'tabbrowser/tab-background-end-preWin10.png', s+'tabbrowser/tab-background-end-preWin10@2x.png',
 s+'tabbrowser/tab-background-end.png', s+'tabbrowser/tab-background-end@2x.png', s+'tabbrowser/tab-background-middle-preWin10.png',
 s+'tabbrowser/tab-background-middle-preWin10@2x.png', s+'tabbrowser/tab-background-middle.png', s+'tabbrowser/tab-background-middle@2x.png',
 s+'tabbrowser/tab-background-start-preWin10.png', s+'tabbrowser/tab-background-start-preWin10@2x.png', s+'tabbrowser/tab-background-start.png',
 s+'tabbrowser/tab-background-start@2x.png', s+'tabbrowser/tab-connecting.png', s+'tabbrowser/tab-connecting@2x.png', s+'tabbrowser/tab-loading-inverted.png',
 s+'tabbrowser/tab-loading-inverted@2x.png', s+'tabbrowser/tab-loading.png', s+'tabbrowser/tab-loading@2x.png', s+'tabbrowser/tab-overflow-border.png',
 s+'tabbrowser/tab-overflow-indicator.png', s+'tabbrowser/tab-selected-end.svg', s+'tabbrowser/tab-selected-start.svg', s+'tabbrowser/tab-separator-XP.png',
 s+'tabbrowser/tab-separator-luna-blue.png', s+'tabbrowser/tab-separator.png', s+'tabbrowser/tab-separator@2x.png', s+'tabbrowser/tab-stroke-end.png',
 s+'tabbrowser/tab-stroke-end@2x.png', s+'tabbrowser/tab-stroke-start.png', s+'tabbrowser/tab-stroke-start@2x.png', s+'tabbrowser/tab.png',
 s+'tabbrowser/tabDragIndicator.png', s+'tabbrowser/tabDragIndicator@2x.png', s+'tabview/close.png', s+'tabview/edit-light.png',
 s+'tabview/grain.png', s+'tabview/search.png', s+'tabview/stack-expander.png', s+'tabview/tabview-inverted.png', s+'tabview/tabview.png',
 s+'theme-switcher-icon.png', s+'theme-switcher-icon@2x.png', s+'toolbar.svg', s+'toolbarbutton-dropdown-arrow-XPVista7.png',
 s+'toolbarbutton-dropdown-arrow-inverted.png', s+'toolbarbutton-dropdown-arrow-win7.png', s+'toolbarbutton-dropdown-arrow.png', s+'toolbarbutton-dropmarker.png',
 s+'toolbarbutton-dropmarker@2x.png', s+'tracking-protection-16.svg', s+'tracking-protection-disabled-16.svg', s+'tracking-protection-disabled.svg',
 s+'tracking-protection.svg', s+'translating-16.png', s+'translating-16@2x.png', s+'translation-16.png', s+'translation-16@2x.png',
 s+'undo.svg', s+'undoCloseTab.png', s+'undoCloseTab@2x.png', s+'update-badge-failed.svg', s+'update-badge.svg',
 s+'urlbar-arrow.png', s+'urlbar-arrow@2x.png', s+'urlbar-history-dropmarker-XPVista7.png', s+'urlbar-history-dropmarker-XPVista7@2x.png',
 s+'urlbar-history-dropmarker-preWin10.png', s+'urlbar-history-dropmarker-preWin10@2x.png', s+'urlbar-history-dropmarker-win7.png',
 s+'urlbar-history-dropmarker-win7@2x.png', s+'urlbar-history-dropmarker.png', s+'urlbar-history-dropmarker@2x.png', s+'urlbar-popup-blocked.png',
 s+'urlbar-popup-blocked@2x.png', s+'urlbar-star.svg', s+'urlbar-tab.svg', s+'usercontext/banking.svg', s+'usercontext/personal.svg',
 s+'usercontext/shopping.svg', s+'usercontext/work.svg', s+'warning-white.svg', s+'warning.svg', s+'warning16.png',
 s+'warning16@2x.png', s+'web-notifications-icon.svg', s+'web-notifications-tray.svg', s+'webIDE.svg', s+'webRTC-camera-white-16.png',
 s+'webRTC-microphone-white-16.png', s+'webRTC-screen-white-16.png', s+'webRTC-shareDevice-16.png', s+'webRTC-shareDevice-16@2x.png',
 s+'webRTC-shareDevice-64.png', s+'webRTC-shareDevice-64@2x.png', s+'webRTC-shareMicrophone-16.png', s+'webRTC-shareMicrophone-16@2x.png',
 s+'webRTC-shareMicrophone-64.png', s+'webRTC-shareMicrophone-64@2x.png', s+'webRTC-shareScreen-16.png', s+'webRTC-shareScreen-16@2x.png',
 s+'webRTC-shareScreen-64.png', s+'webRTC-shareScreen-64@2x.png', s+'webRTC-sharingDevice-16.png', s+'webRTC-sharingDevice-16@2x.png',
 s+'webRTC-sharingDevice-menubar.png', s+'webRTC-sharingDevice-menubar@2x.png', s+'webRTC-sharingMicrophone-16.png', s+'webRTC-sharingMicrophone-16@2x.png',
 s+'webRTC-sharingMicrophone-menubar.png', s+'webRTC-sharingMicrophone-menubar@2x.png', s+'webRTC-sharingScreen-16.png', s+'webRTC-sharingScreen-16@2x.png',
 s+'webRTC-sharingScreen-menubar.png', s+'webRTC-sharingScreen-menubar@2x.png', s+'welcome-back.svg', s+'wifi.svg',
 s+'window-controls/close-highcontrast.svg', s+'window-controls/close-themes.svg', s+'window-controls/close.svg', s+'window-controls/maximize-highcontrast.svg',
 s+'window-controls/maximize-themes.svg', s+'window-controls/maximize.svg', s+'window-controls/minimize-highcontrast.svg', s+'window-controls/minimize-themes.svg',
 s+'window-controls/minimize.svg', s+'window-controls/restore-highcontrast.svg', s+'window-controls/restore-themes.svg', s+'window-controls/restore.svg',
 s+'window.svg', s+'yosemite/Toolbar.png', s+'yosemite/Toolbar@2x.png', s+'yosemite/loop/menuPanel.png', s+'yosemite/loop/menuPanel@2x.png',
 s+'yosemite/loop/toolbar.png', s+'yosemite/loop/toolbar@2x.png', s+'yosemite/menuPanel-customize.png', s+'yosemite/menuPanel-customize@2x.png',
 s+'yosemite/menuPanel-exit.png', s+'yosemite/menuPanel-exit@2x.png', s+'yosemite/menuPanel-help.png', s+'yosemite/menuPanel-help@2x.png',
 s+'yosemite/menuPanel-small.png', s+'yosemite/menuPanel-small@2x.png', s+'yosemite/menuPanel.png', s+'yosemite/menuPanel@2x.png',
 s+'yosemite/preferences/checkbox.png', s+'yosemite/preferences/checkbox@2x.png', s+'yosemite/reload-stop-go.png', s+'yosemite/reload-stop-go@2x.png',
 s+'yosemite/sync-horizontalbar.png', s+'yosemite/sync-horizontalbar@2x.png', s+'yosemite/tab-active-middle-inactive.png',
 s+'yosemite/tab-active-middle-inactive@2x.png', s+'yosemite/tab-selected-end-inactive.svg', s+'yosemite/tab-selected-start-inactive.svg',
 s+'yosemite/tab-stroke-end-inactive.png', s+'yosemite/tab-stroke-end-inactive@2x.png', s+'yosemite/tab-stroke-start-inactive.png',
 s+'yosemite/tab-stroke-start-inactive@2x.png', s+'yosemite/thumburger.png', s+'yosemite/thumburger@2x.png', s+'zoom-in.svg', s+'zoom-out.svg'
];

var cssUris = [b+'aboutDialog.css', c+'aboutDialog.css', c+'aboutPrivateBrowsing.css', c+'aboutRobots.css', c+'aboutTabCrashed.css',
 c+'aboutaccounts/aboutaccounts.css', c+'aboutaccounts/fonts.css', c+'aboutaccounts/main.css', c+'aboutaccounts/normalize.css',
 c+'abouthealthreport/abouthealth.css', c+'abouthome/aboutHome.css', c+'aboutneterror/netError.css', c+'browser.css',
 c+'certerror/aboutCertError.css', c+'contentSearchUI.css', c+'customizableui/panelUI.css', c+'devtools/codemirror/codemirror.css',
 c+'devtools/codemirror/dialog.css', c+'devtools/codemirror/mozilla.css', c+'devtools/commandline.css', c+'devtools/connect.css',
 c+'devtools/cubic-bezier.css', c+'devtools/debugger.css', c+'devtools/eyedropper/crosshairs.css', c+'devtools/eyedropper/nocursor.css',
 c+'devtools/filter-widget.css', c+'devtools/fontinspector/font-inspector.css', c+'devtools/framework/dev-edition-promo.css',
 c+'devtools/framework/options-panel.css', c+'devtools/inspector/inspector.css', c+'devtools/layoutview/view.css', c+'devtools/markup-view.css',
 c+'devtools/mdn-docs.css', c+'devtools/netmonitor.css', c+'devtools/profiler/cleopatra/css/devtools.css', c+'devtools/profiler/cleopatra/css/tree.css',
 c+'devtools/profiler/cleopatra/css/ui.css', c+'devtools/ruleview.css', c+'devtools/spectrum.css', c+'devtools/splitview.css',
 c+'devtools/styleeditor.css', c+'devtools/widgets.css', c+'downloads/allDownloadsViewOverlay.css', c+'downloads/contentAreaDownloadsView.css',
 c+'downloads/download.css', c+'downloads/downloads.css', c+'extension-mac-panel.css', c+'extension-mac.css',
 c+'extension-win-panel.css', c+'extension.css', c+'feeds/subscribe.css', c+'loop/css/contacts.css', c+'loop/css/panel.css',
 c+'loop/sdk-content/css/ot.css', c+'loop/shared/css/common.css', c+'loop/shared/css/contacts.css', c+'loop/shared/css/conversation.css',
 c+'loop/shared/css/panel.css', c+'loop/shared/css/reset.css', c+'newtab/newTab.css', c+'pageinfo/pageInfo.css',
 c+'places/organizer.css', c+'places/places.css', c+'pocket/panels/css/firasans.css', c+'pocket/panels/css/normalize.css',
 c+'pocket/panels/css/saved.css', c+'pocket/panels/css/signup.css', c+'preferences/aboutPermissions.css', c+'preferences/clearSiteData.css',
 c+'preferences/handlers.css', c+'preferences/in-content/search.css', c+'preferences/search.css', c+'preferences/siteDataSettings.css',
 c+'preferences/sitePermissions.css', c+'remote-newtab/newTab.css', c+'safeMode.css', c+'sanitizeDialog.css',
 c+'search/searchbarBindings.css', c+'searchSuggestionUI.css', c+'sync/aboutSyncTabs.css', c+'sync/customize.css',
 c+'tabbrowser.css', c+'tabview.css', c+'usercontext/usercontext.css', s+'aboutCertError.css', s+'aboutLibrary.css',
 s+'aboutNetError.css', s+'aboutPrivateBrowsing.css', s+'aboutProviderDirectory.css', s+'aboutRestartRequired.css', s+'aboutSessionRestore.css',
 s+'aboutSocialError.css', s+'aboutSyncTabs.css', s+'aboutTabCrashed.css', s+'aboutWelcomeBack.css', s+'blockedSite.css',
 s+'browser-lightweightTheme.css', s+'browser.css', s+'compacttheme.css', s+'controlcenter/panel.css', s+'customizableui/panelUI.css',
 s+'customizableui/panelUIOverlay.css', s+'devedition.css', s+'devtools/animationinspector.css', s+'devtools/app-manager/connection-footer.css',
 s+'devtools/app-manager/device.css', s+'devtools/app-manager/help.css', s+'devtools/app-manager/index.css', s+'devtools/app-manager/projects.css',
 s+'devtools/canvasdebugger.css', s+'devtools/commandline.css', s+'devtools/common.css', s+'devtools/computedview.css',
 s+'devtools/dark-theme.css', s+'devtools/debugger.css', s+'devtools/eyedropper.css', s+'devtools/floating-scrollbars-light.css',
 s+'devtools/floating-scrollbars.css', s+'devtools/font-inspector.css', s+'devtools/inspector.css', s+'devtools/layoutview.css',
 s+'devtools/light-theme.css', s+'devtools/markup-view.css', s+'devtools/memory.css', s+'devtools/netmonitor.css', s+'devtools/performance.css',
 s+'devtools/profiler.css', s+'devtools/projecteditor/projecteditor.css', s+'devtools/promisedebugger.css', s+'devtools/ruleview.css',
 s+'devtools/scratchpad.css', s+'devtools/shadereditor.css', s+'devtools/splitview.css', s+'devtools/storage.css', s+'devtools/styleeditor.css',
 s+'devtools/timeline.css', s+'devtools/webaudioeditor.css', s+'devtools/webconsole.css', s+'devtools/webconsole_networkpanel.css',
 s+'devtools/widgets.css', s+'downloads/allDownloadsView.css', s+'downloads/allDownloadsViewOverlay.css', s+'downloads/contentAreaDownloadsView.css',
 s+'downloads/downloads.css', s+'engineManager.css', s+'error-pages.css', s+'feeds/subscribe-ui.css', s+'feeds/subscribe.css',
 s+'in-content/common.css', s+'newtab/newTab.css', s+'pageInfo.css', s+'places/editBookmark.css', s+'places/editBookmarkOverlay.css',
 s+'places/organizer.css', s+'places/places.css', s+'preferences/aboutPermissions.css', s+'preferences/applications.css',
 s+'preferences/containers.css', s+'preferences/in-content-new/containers.css', s+'preferences/in-content-new/dialog.css',
 s+'preferences/in-content-new/preferences.css', s+'preferences/in-content-new/search.css', s+'preferences/in-content-new/siteDataSettings.css',
 s+'preferences/in-content/containers.css', s+'preferences/in-content/dialog.css', s+'preferences/in-content/preferences.css',
 s+'preferences/in-content/privacy.css', s+'preferences/in-content/search.css', s+'preferences/in-content/siteDataSettings.css',
 s+'preferences/in-content/syncDisconnect.css', s+'preferences/preferences.css', s+'preferences/search.css', s+'privatebrowsing/aboutPrivateBrowsing.css',
 s+'readinglist/sidebar.css', s+'sanitizeDialog.css', s+'searchReset.css', s+'searchbar.css', s+'setDesktopBackground.css',
 s+'syncCommon.css', s+'syncProgress.css', s+'syncQuota.css', s+'syncSetup.css', s+'syncedtabs/sidebar.css',
 s+'tabview/tabview.css', s+'webRTC-indicator.css', g+'aboutCheckerboard.css', g+'aboutMemory.css', g+'aboutMozilla.css',
 g+'aboutTelemetry.css', g+'aboutUrlClassifier.css', g+'aboutwebrtc/aboutWebrtc.css', g+'accessibility/AccessFu.css',
 g+'alerts/alert.css', g+'autocomplete.css', g+'bindings/datetimebox.css', g+'bindings/videocontrols.css', g+'buildconfig.css',
 g+'commonDialog.css', g+'components.css', g+'console.css', g+'crashes.css', g+'customizeToolbar.css',
 g+'menulist.css', g+'plugins.css', g+'resetProfile.css', g+'simplifyMode.css',
 g+'tabprompts.css', g+'textbox.css', g+'viewSource.css', g+'xml/XMLMonoPrint.css', g+'xml/XMLPrettyPrint.css',
 g+'xul.css'
];
// g+'minimal-xul.css' removed : causes crashes in Windows7 FF60+61+ESR, but not TB8
// var cssUris = [g+'minimal-xul.css'];

// JS
var allHash = [];
var jsYes=0; var jsAll=0; var jsHash = [];
jsUris.forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
  script.onload = function() {
    jsHash.push(src); jsYes++;
    allHash.push(src);
  };
  document.head.removeChild(script);
  jsAll++;
});
// IMAGES
var imgYes=0; var imgAll=0; var imgHash = [];
imgUris.forEach(function(imgUri) {
  var img = document.createElement("img");
  img.src = imgUri;
  img.style.height = "20px";
  img.style.width = "20px";
  img.onload = function() {
    imgHash.push(imgUri); imgYes++;
    allHash.push(imgUri);
  };
  imgAll++;
});
// CSS
var cssYes=0; var cssAll=0; var cssHash = [];
cssUris.forEach(function(cssUri) {
  var css = document.createElement("link");
  css.href = cssUri;
  css.type = "text/css";
  css.rel = "stylesheet";
  document.head.appendChild(css);
  css.onload = function() {
    cssHash.push(cssUri); cssYes++;
    allHash.push(cssUri);
  };
  document.head.removeChild(css);
  cssAll++;
 });
// RESULTS: wait for all the resources to succeed/fail
setTimeout(function(){
  var hashJ = sha1(jsHash.sort());
  var hashI = sha1(imgHash.sort());
  var hashC = sha1(cssHash.sort());
  var hashA = sha1(allHash.sort());
  dom.jsHash = hashJ + " ["+jsYes+"/"+jsAll+"]";
  dom.imgHash = hashI + " ["+imgYes+"/"+imgAll+"]";
  dom.cssHash = hashC + " ["+cssYes+"/"+cssAll+"]";
  var allTrue = jsYes+imgYes+cssYes;
  var allTried = jsAll+imgAll+cssAll;
  dom.allHash = sha1(hashA) + " ["+allTrue+"/"+allTried+"]";
  // output all sorted with line breaks
  var strAll = allHash.sort().toString();
  var strOut = strAll.replace(/,/gi, '<br>');
  dom.allLoaded.innerHTML = strOut;
}, 5000);
