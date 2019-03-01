/* TABLE: User Agent */

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

/* math section */
  var strR = ""; var strH = "";
  let xfd; let yfd;
  // atanh(0.5)
  xfd = 0.5;
  strR = Math.log((1 + xfd) / (1 - xfd)) / 2;;
  dom.brm1 = strR; strH = strR;
  // expm1(1)
  xfd=1;
  strR = Math.exp(xfd) - 1;;
  dom.brm2 = strR; strH = strH + "-" + strR;
  // sinh(1)
  xfd = 1; yfd = Math.exp(xfd);
  strR = (yfd - 1 / yfd) / 2;
  dom.brm3 = strR; strH = strH + "-" + strR;
  var strbrHash = sha1(strH);
  dom.brmhash = strbrHash;
  // cos values
  strH = "";
  strR = Math.cos(-1e251); dom.osm1 = strR; strH = strR;
  strR = Math.cos(-1e140); dom.osm2 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e12); dom.osm3 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e130); dom.osm4 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e272); dom.osm5 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e0); dom.osm6 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e284); dom.osm7 = strR; strH = strH + "-" + strR;
  strR = Math.cos(-1e75); dom.osm8 = strR; strH = strH + "-" + strR;
  var strosHash = sha1(strH);
  dom.osmhash = strosHash;
  // get hash of the two hashes
  var strcoHash = sha1(strbrHash+"-"+strosHash);
  dom.comhash = strcoHash;

/* browser: math values
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
if (strbrHash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Firefox"};
if (strbrHash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Firefox [32-bit]"};

/* os: math values: only if Firefox
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
  if (strosHash == "46f7c2bbe55a2cd28252d059604f8c3bac316c23") {dom.fdMathOS="Windows [64-bit]"; dom.fdMath="Firefox [64-bit]"};
  // purple: always Windows, FF-32bit
  if (strosHash == "97eee44856b0d2339f7add0d22feb01bcc0a430e") {dom.fdMathOS="Windows"; dom.fdMath="Firefox [32-bit]"};
  // blue: always linux
  if (strosHash == "96895e004b623552b9543dcdc030640d1b108816") {dom.fdMathOS="Linux";
    // within Linux: yellow is always 32-bit platform; bright blue is always 64-bit platform
    if (strbrHash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMathOS="Linux [64-bit]"};
    if (strbrHash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMathOS="Linux [32-bit]"};
  };
  // tan: always Windows and Tor Browser
  if (strosHash == "8464b989070dcff22c136e4d0fe21d466b708ece") {dom.fdMathOS="Windows";
    // within Windows: yellow is always TB 32-bit; bright blue is always TB 64-bit
    if (strbrHash == "7a73daaff1955eef2c88b1e56f8bfbf854d52486") {dom.fdMath="Tor Browser [64-bit]"};
    if (strbrHash == "0eb76fed1c087ebb8f80ce1c571b2f26a8724365") {dom.fdMath="Tor Browser [32-bit]"};
  };
  // orange: android
  if (strosHash == "ae434b101452888b756da5916d81f68adeb2b6ae") {dom.fdMathOS="Android";};
  // pink: macos
  if (strosHash == "06a01549b5841e0ac26c875b456a33f95b5c5c11") {dom.fdMathOS="macOS";};
};

/* Firefox Version 60+ Detection */
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
  try {const rtf = new Intl.RelativeTimeFormat("en", {style: "long",}); verNo="65+"} catch(e) {};
  //66
  //try {
    //verNo="66+"}
  //catch(e) {};
  // reminder: ^^ always append + ONLY on the LAST test
  return verNo;
  };
// only run the function for Firefox
if (isNaN(window.mozInnerScreenX) === false){dom.versionNo = getVerNo();};
