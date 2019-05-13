/* TABLE: CSS */

'use strict';

function outputCSS() {
  // prefers-color-scheme
  var pColorElem = document.getElementById("pColorElement");
  var pRGB = window.getComputedStyle(pColorElem, null).getPropertyValue("background-color");
  if (pRGB == "rgb(255, 255, 255)") {pRGB = "light"}
  else if (pRGB == "rgb(255, 0, 0)") {pRGB = "not supported"}
  else if (pRGB == "rgb(0, 0, 0)") {pRGB = "dark"}
  else if (pRGB == "rgb(0, 0, 255)") {pRGB = "no-preference"};
  dom.pColorScheme = pRGB;
  // prefers-reduced-motion
  var pRGB = "";
  var pMotionElem = document.getElementById("pMotionElement");
  var pRGB = window.getComputedStyle(pMotionElem, null).getPropertyValue("background-color");
  if (pRGB == "rgb(255, 255, 255)") {pRGB = "no-preference"}
  else if (pRGB == "rgb(255, 0, 0)") {pRGB = "not supported"}
  else if (pRGB == "rgb(0, 0, 0)") {pRGB = "reduce"};
  dom.pReducedMotion = pRGB;
  // system colors
  var sColorStr = ""; var clrValue = "";
  var sColorArray = ['ActiveBorder', 'ActiveCaption', 'AppWorkspace', 'Background', 'ButtonFace', 'ButtonHighlight', 'ButtonShadow',
    'ButtonText', 'CaptionText', 'GrayText', 'Highlight', 'HighlightText', 'InactiveBorder', 'InactiveCaption', 'InactiveCaptionText',
    'InfoBackground', 'InfoText', 'Menu', 'MenuText', 'Scrollbar', 'ThreeDDarkShadow','ThreeDFace', 'ThreeDHighlight',
    'ThreeDLightShadow', 'ThreeDShadow', 'Window', 'WindowFrame', 'WindowText'];
  var sColorElem = document.getElementById("sColorElement");
  sColorArray.forEach(function (arrayItem) {
    sColorElem.style.backgroundColor = arrayItem;
    sColorStr = sColorStr + window.getComputedStyle(sColorElem, null).getPropertyValue("background-color")
  });
  dom.sColorHash = sha1(sColorStr);
};

outputCSS();
