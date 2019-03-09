/* TABLES: User Agent, Math */

'use strict';

dom.nAppName = navigator.appName;
dom.nAppVersion = navigator.appVersion;
dom.nBuildID = navigator.buildID;
dom.nCodeName = navigator.appCodeName;
dom.nOscpu = navigator.oscpu;
dom.nPlatform = navigator.platform;
dom.nProduct = navigator.product;
dom.nProductSub = navigator.productSub;
dom.nUserAgent = navigator.userAgent;

// browser: resource/chrome
// could also use: resource://normandy-content/about-studies/img/shield-logo.png"
// could also use: about:logo
const FFImg = new Image();
FFImg.src = "chrome://browser/content/aboutRobots-icon.png";
FFImg.onload = e => {if (!dom.fdResource.textContent) dom.fdResource = "Firefox";};

// browser: feature detection
if (isNaN(window.mozPaintCount) === false){ dom.fdPaintCount="Firefox"};
/* 
  if (isNaN(window.mozInnerScreenX) === false){ dom.fdScreenX="Firefox"};
  if (isNaN(window.window.scrollMaxX) === false){ dom.fdScrollMaxX="Firefox"};
  if (navigator.oscpu == undefined){} else { dom.fdOscpu="Firefox"};
*/

/* about:logo dimensions in android vs desktop: 300x236 desktop / 258x99 mobile */
// only run the function for Firefox
if (isNaN(window.mozInnerScreenX) === false){
  var imgLogo = new Image();
  imgLogo.src = "about:logo";
  imgLogo.style.visibility = "hidden";
  document.body.appendChild(imgLogo);
  imgLogo.addEventListener("load", function() {
    var imgLogoW = imgLogo.width;
    if (imgLogoW == 300) {dom.fdResourceOS = "Desktop"};
    if (imgLogoW == 258) {dom.fdResourceOS = "Android"};
  });
};

// Firefox 60+ feature detection
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
    verNo="66+"}
  catch(e) {};
  // reminder: ^^ always append + ONLY on the LAST test
  return verNo;
};
// only run the function for Firefox
if (isNaN(window.mozInnerScreenX) === false){
  var intVerNo = getVerNo();
  dom.versionNo = intVerNo;
  intVerNo = intVerNo.substring(0, 2);
};

// MATH table section
  var strR = ""; var strH = "";
  // ECMASCript 1st edtion: using cos values
    strR = Math.cos(-1e251); dom.cos1 = strR; strH = strR;
    strR = Math.cos(-1e140); dom.cos2 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e12); dom.cos3 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e130); dom.cos4 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e272); dom.cos5 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e0); dom.cos6 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e284); dom.cos7 = strR; strH = strH + "-" + strR;
    strR = Math.cos(-1e75); dom.cos8 = strR; strH = strH + "-" + strR;
    var math1hash = sha1(strH);
    var str1math = strH;
    dom.math1hash = math1hash;
  // ECMASCript 6th edtion
    strR = ""; strH = ""; let x; let y;
    // atanh(0.5)
    x = 0.5; strR = Math.log((1 + x) / (1 - x)) / 2;;
    dom.math1 = strR; strH = strR;
    // expm1(1)
    x=1; strR = Math.exp(x) - 1;;
    dom.math2 = strR; strH = strH + "-" + strR;
    // sinh(1)
    x = 1; y = Math.exp(x); strR = (y - 1 / y) / 2;
    dom.math3 = strR; strH = strH + "-" + strR;
    // hash
    var math6hash = sha1(strH);
    var str6math = strH;
    dom.math6hash = math6hash;
  // hash of combined strings
  var mathhash = sha1(str1math+"-"+str6math);
  dom.mathhash = mathhash;

// MATH logic to detect browser and os
/* browser: math6 values
  hash = 7a73daaff1955eef2c88b1e56f8bfbf854d52486 // bright blue
 atanh = 0.5493061443340548
 expm1 = 1.7182818284590455
  sinh = 1.1752011936438016
 then 64bit builds, or 32bit builds on 64bit Windows

  hash = 0eb76fed1c087ebb8f80ce1c571b2f26a8724365 // yellow
 atanh = 0.5493061443340549
 expm1 = 1.718281828459045
  sinh = 1.1752011936438014
  then 32bit tor browser (on 32 or 64 bit platform) or 32bit firefox (on 32bit linux)
*/
if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Firefox"};
if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Firefox [32-bit]"};

/* os: math1 values: only if Firefox
   green = 46f7c2bbe55a2cd28252d059604f8c3bac316c23
  purple = 97eee44856b0d2339f7add0d22feb01bcc0a430e
    blue = 96895e004b623552b9543dcdc030640d1b108816
     tan = 8464b989070dcff22c136e4d0fe21d466b708ece
  orange = ae434b101452888b756da5916d81f68adeb2b6ae
    pink = 06a01549b5841e0ac26c875b456a33f95b5c5c11
*/
// refine browser build if we go
if (isNaN(window.mozInnerScreenX) === false) {
  // default
  dom.fdMathOS="I just haven't worked out your combo yet"
  // known combos
  // green: always Win64, FF-64bit
  if (math1hash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {dom.fdMathOS="Windows [64-bit]"; dom.fdMath="Firefox [64-bit]"};
  // purple: always Windows, FF-32bit
  if (math1hash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {dom.fdMathOS="Windows"; dom.fdMath="Firefox [32-bit]"};
  // blue: always linux
  if (math1hash == "96895e004b623552b9543dcdc030640d1b108816") {dom.fdMathOS="Linux";
    // within Linux: yellow is always 32-bit platform; bright blue is always 64-bit platform
    if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMathOS="Linux [64-bit]"};
    if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMathOS="Linux [32-bit]"};
  };
  // tan: always Windows and Tor Browser
  if (math1hash == "8464b989070dcff22c136e4d0fe21d466b708ece") {dom.fdMathOS="Windows";
    // within Windows: yellow is always TB 32-bit; bright blue is always TB 64-bit and therefore on Windows 64=bit
    if (math6hash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Tor Browser [64-bit]"; dom.fdMathOS="Windows [64-bit]"};
    if (math6hash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Tor Browser [32-bit]"};
  };
  // orange: android
  if (math1hash == "ae434b101452888b756da5916d81f68adeb2b6ae") {dom.fdMathOS="Android";};
  // pink: mac
  if (math1hash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {
    // tested on Mojave, High Sierra, Sierra, El Capitan, Yosemite = 64bit only [Lion 10.8 was the last to support 32bit]
    // FF60+ is not supported prior to 10.9 (which wasn't tested), so therefore the browser is 64-bit as well
    dom.fdMathOS="Mac"; dom.fdMath="Firefox [64-bit]";
  };
};

/* get width of the fdCssOS* elements > dom.fontOS */
// artifically delay it so the fonts have time to load
setTimeout(function(){ 
// only run the function for Firefox
  if (isNaN(window.mozInnerScreenX) === false){
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
  };
}, 4000);
