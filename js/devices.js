/* TABLE: Devices & Hardware */

'use strict';

function outputDevices() {
  // navigator
  dom.nHardwareConcurrency = navigator.hardwareConcurrency;
  dom.nMaxTouchPoints = navigator.maxTouchPoints;
  if (navigator.getGamepads) {dom.nGetGamepads="enabled"} else {dom.nGetGamepads="disabled"};
  // media devices (media.navigator.enabled)
  if ("mediaDevices" in navigator) {
    dom.nMediaDevices="enabled";
    // enumerate media devices
    try {
      // don't do if insecure or file?
      //navigator.mediaDevices.getUserMedia({audio:true});
      dom.eMediaDevices="yes: test to come";
    }
    catch(e) {dom.eMediaDevices="no: " + e.name};
  }
  else {
    dom.nMediaDevices="disabled";
    dom.eMediaDevices="n/a"; // always use n/a for skipped tests
  };
  // media.webspeech.synth.enabled
  if ("speechSynthesis" in window) {
    dom.speechSynth="enabled"
    // speech engines
    //   ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
    // get properties of each voice: eg SpeechSynthesisVoice.default 
    //   ^^ https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice   
    // dom.speechEngines = speechSynthesis.getVoices().map(v => v.name+"|"+v.lang);
    dom.speechEngines="yes: test to come";
  }
  else {
    dom.speechSynth="disabled";
    dom.speechEngines="n/a"; // always use n/a for skipped tests
  };
  // VR (dom.vr.enabled)
  if ("getVRDisplays" in navigator) {
    dom.nGetVR="enabled";
    // active
    if ("activeVRDisplays" in navigator) {
      if (navigator.activeVRDisplays == "") {dom.nActiveVR="[empty array]"}
      else {dom.nActiveVR=navigator.activeVRDisplays};
    };
  }
  else {
    dom.nGetVR="disabled";
    dom.nActiveVR="n/a"; // always use n/a for skipped tests
  };
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

function runDevices(runType) {
  // clear display
  if (runType == "rerun") {
    var langArray = [`nHardwareConcurrency`, 'nMaxTouchPoints', 'nGetGamepads', 'nMediaDevices', 'eMediaDevices',
    'speechSynth', 'speechEngines', 'sColorHash', 'nGetVR', 'nActiveVR'];
    langArray.forEach(function (arrayItem) {
      document.getElementById(arrayItem).innerHTML="&nbsp"; // &nbsp stops line height jitter
    });
    setTimeout(function(){
      outputDevices();
    }, 170); // 170 is same as domrect rerun delay
  } else {
    outputDevices();
  };
};

runDevices("onload");
