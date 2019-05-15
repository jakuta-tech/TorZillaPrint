'use strict';

function getUniqueElements() {
  // live interface for snazzy access to DOM elements with an ID
  // more efficient and clean than calling getElementById a gazillion times
  const dom = document.getElementsByTagName('*');
  return new Proxy(dom, {
    get: function(obj, prop) {
      return obj[prop];
    },
    set: function(obj, prop, val) {
        obj[prop].textContent = `${val}`;
        return true;
    }
  });
};

// unicode chars affect line-height = jitter when rerun, shuffling when filling
var TBy = " <span class='good'> [TB]</span>"; // \u2714 = heavy checkmark
var RFPy = " <span class='good'> [RFP]</span>";
var RFPn =  " <span class='bad'> [RFP]</span>"; // \u2716 = heavy cross

function showhide(toggleType, toggleID, togWord) {
  var xyz = document.getElementsByClassName("tog"+toggleID); var abc;
  for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = toggleType;}
  document.getElementById("label"+toggleID).innerHTML = togWord+" details";
  // domrect show/hide extra sections & change drFirstHeader text
  if (toggleID == "D") {
    var drArray = [dom.dr1.innerHTML, dom.dr2.innerHTML, dom.dr3.innerHTML, dom.dr4.innerHTML];
    var xyz = document.getElementsByClassName("togD1"); var abc;
    if (drArray.every( (val, i, arr) => val === arr[0] )) {
      // hide last three
      dom.drFirstHeader.innerHTML = "Element.getClientRects"+`<br>`+"[note: the other three methods have the same hash and values]";
      for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = "none";};
    } else {
      // display last three
      dom.drFirstHeader.innerHTML = "Element.getClientRects";
      for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = toggleType;};
    };
  };
};

var drState = false; // track domrect details state
function toggleitems(chkbxState, chkbxID) {
  if (chkbxState.checked) {
    if (chkbxID == "D") {drState = false};
    showhide("none", chkbxID, "&#9660; show");
  }
  else {
    if (chkbxID == "D") {drState = true};
    showhide("table-row", chkbxID, "&#9650; hide");
  }
};

function copyclip(element) {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(element));
    range.select().createTextRange();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(element));
    window.getSelection().addRange(range);
    document.execCommand("copy");
  }
};

// check one: math (not sure if this detects 64bit android)
// we may need more tests: a chrome:// branding check takes too long
var amDroid = false;
var strDroid = Math.cos(1e251) + "-" + Math.cos(1e140) + "-" + Math.cos(1e12) + "-" + Math.cos(1e130) + "-" + 
  Math.cos(1e272) + "-" + Math.cos(1e0) + "-" + Math.cos(1e284) + "-" + Math.cos(1e75);
if ( sha1(strDroid) == "ae434b101452888b756da5916d81f68adeb2b6ae") { amDoid = true };

/* SHA1 STUFF*/
function sha1(str1){
  for (var blockstart=0,
    i = 0,
    W = [],
    H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
    A, B, C, D, F, G,
    word_array = [],
    temp2,
    s = unescape(encodeURI(str1)),
    str_len = s.length;
    i<=str_len;){
    word_array[i>>2] |= (s.charCodeAt(i)||128)<<(8*(3-i++%4));
  }
  word_array[temp2 = ((str_len+8)>>6<<4)+15] = str_len<<3;
  for (; blockstart <= temp2; blockstart += 16) {
    A = H,i=0;
    for (; i < 80;
      A = [[
        (G = ((s=A[0])<<5|s>>>27) + A[4] + (W[i] = (i<16) ? ~~word_array[blockstart + i] : G<<1|G>>>31) + 1518500249) + ((B=A[1]) & (C=A[2]) | ~B & (D=A[3])),
        F = G + (B ^ C ^ D) + 341275144,
        G + (B & C | B & D | C & D) + 882459459,
        F + 1535694389
      ][0|i++/20] | 0, s, B<<30|B>>>2, C, D]
    ) {
      G = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    }
    for(i=5;i;) H[--i] = H[i] + A[i] | 0;
  }
  for(str1='';i<40;)str1 += (H[i>>3] >> (7-i++%8)*4 & 15).toString(16);
  return str1;
};

/* BASE64 STUFF */
function base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
    return base64js.fromByteArray(bytes);
};
function base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
};
function byteArrayToHex(arrayBuffer){
  var chunks = [];
  (new Uint32Array(arrayBuffer)).forEach(function(num){
    chunks.push(num.toString(16));
  });
  return chunks.map(function(chunk){
    return "0".repeat(8 - chunk.length) + chunk;
  }).join("");
};

/* BUTTONS: (re)GENERATE SECTIONS */
function outputSection(section) {
  // elements to clear
  if (section == "audio") {
    var clearArray = ['audioSupport', 'audioCopy', 'audioGet', 'audioSum'];
  };
  if (section == "canvas") {
    var clearArray = [`cnv1`, `cnv2`, `cnv3`, `cnv4`, `cnv5`, `cnv6`, `cnv7`, `cnv8`, `cnv9`, `cnv10`, `cnv11`];
  };
  if (section == "chrome") {
    var clearArray = ['imgHash', 'jsHash', 'cssHash', 'allHash', 'allLoaded'];
  };
  if (section == "css") {
    var clearArray = ['pColorScheme', 'pReducedMotion', 'sColorHash'];
  };
  if (section == "devices") {
    var clearArray = [`nHardwareConcurrency`, 'nMaxTouchPoints', 'nGetGamepads', 'nMediaDevices', 'eMediaDevices',
    'speechSynth', 'speechEngines', 'nGetVR', 'nActiveVR'];
  };
  if (section == "fonts") {
    var clearArray = ['fontFB'];
  };
  if (section == "language") {
    var clearArray = ['nLanguages', 'nLanguage', 'nLanguages0', 'localeIPR', 'localeRO', `localeDTD`,
      'tzOffsets', 'tzRO', 'dateSystem', 'dateString', 'lngdateLS', 'lngdateLDS', 'lngdateLTS', 'lngdateIDTF',
      'dateFTP', 'dateGMT', 'dateUTC', 'dateLS', 'dateTAtoLS', 'dateLDS', 'dateIDTF', 'dateLTS', 'dateTS',
      'numFTP', 'hourRO', 'dateIRTF', 'calendarRO', 'numsysRO', 'nGeolocation', 'pGeolocation'];
  };
  if (section == "misc") {
    // don't reset mathmltest, it is done by the test
    var clearArray = ['nClipboard', 'intObserver', 'mathml', 'reqIdleCB'];
  };
  // clear elements
  clearArray.forEach(function (arrayItem) {
    document.getElementById(arrayItem).innerHTML="&nbsp"; // &nbsp stops line height jitter
  });
  // delay output so users can see something happened
  setTimeout(function(){
    if (section == "audio") {outputAudio()};
    if (section == "canvas") {outputCanvas()};
    if (section == "chrome") {outputChrome()};
    if (section == "css") {outputCSS()};
    if (section == "devices") {outputDevices()};
    if (section == "fonts") {outputFonts()};
    if (section == "language") {outputLanguage()};
    if (section == "misc") {outputMisc()};
  }, 170);
};
