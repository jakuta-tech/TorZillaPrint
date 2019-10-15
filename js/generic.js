'use strict';

function getUniqueElements() {
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

function showhide(toggleType, toggleID, togWord) {
	var xyz = document.getElementsByClassName("tog"+toggleID);
	var abc;
	for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = toggleType;}
	if (togWord !== "") {
		document.getElementById("label"+toggleID).innerHTML = togWord+" details";
	};
	// domrect show/hide extra sections & change drFirstHeader text
	if (toggleID == "D") {
		let drArray = [dom.dr1.innerHTML, dom.dr2.innerHTML, dom.dr3.innerHTML, dom.dr4.innerHTML];
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
	// font lists show/hide if same hash or not, and change label text
	if (toggleID == "F") {
		if (isPage == "main") {
			let fontA = dom.small_fontFPJS2.innerHTML;
			let fontB = dom.small_fontFB.innerHTML;
			if (fontA == fontB) {
				// same: hide the second
				dom.small_fontlabel = "whitelist";
				dom.fontB1.style.display = "none";
				dom.fontB2.style.display = "none";
			} else {
				// different: show both
				dom.small_fontlabel = "fingerprintjs2 [whitelist]";
				dom.fontB1.style.display = toggleType;
				dom.fontB2.style.display = toggleType;
			};
			let fontC = dom.all_fontFPJS2.innerHTML;
			let fontD = dom.all_fontFB.innerHTML;
			if (fontC == fontD) {
				// same: hide the second
				dom.all_fontlabel = "os";
				dom.fontD1.style.display = "none";
				dom.fontD2.style.display = "none";
			} else {
				// different: show both
				dom.all_fontlabel = "fingerprintjs2 [os]";
				dom.fontD1.style.display = toggleType;
				dom.fontD2.style.display = toggleType;
			};
		} else if (isPage == "extra") {
			let fontE = dom.monsta_fontFPJS2.innerHTML;
			let fontF = dom.monsta_fontFB.innerHTML;
			if (fontE == fontF) {
				// same: hide the second
				dom.monsta_fontlabel = "monsta";
				dom.fontF1.style.display = "none";
				dom.fontF2.style.display = "none";
			} else {
				// different: show both
				dom.monsta_fontlabel = "fingerprintjs2 [monsta]";
				dom.fontF1.style.display = toggleType;
				dom.fontF2.style.display = toggleType;
			};
		}
	};
};

var drState = false; // track domrect details state
var fntState = false; // track font details state
function toggleitems(chkbxState, chkbxID) {
	if (chkbxState.checked) {
		if (chkbxID == "D") {drState = false};
		if (chkbxID == "F") {fntState = false};
		showhide("none", chkbxID, "&#9660; show");
	}
	else {
		if (chkbxID == "D") {drState = true};
		if (chkbxID == "F") {fntState = true};
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
/* Base64 / binary data / UTF-8 strings utilities (#3)
	https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
	Author: madmurphy */
function btoaUTF16 (sString) {
	var aUTF16CodeUnits = new Uint16Array(sString.length);
	Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
	return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
}
function atobUTF16 (sBase64) {
	var sBinaryString = atob(sBase64), aBinaryView = new Uint8Array(sBinaryString.length);
	Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) { arr[idx] = sBinaryString.charCodeAt(idx); });
	return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer));
}
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
function outputSection(id, cls, page) {
	// clear elements, &nbsp stops line height jitter
	let tbl = document.getElementById("tb"+id);
	tbl.querySelectorAll(`.${cls}`).forEach(e => {e.innerHTML = "&nbsp";});
	// clear details if applicable
	if (id=="1") {dom.kbt.value = ""};
	if (id=="9") {reset_domrect()};
	if (id=="10" && cls=="c2") {reset_audio2()};
	if (id=="11" && cls=="c1") {reset_unicode()};
	let delay = 150;
	// delay output so users can see something happened
	function output_delay() {
		clearInterval(checking);
		// reset global timer
		gt0 = performance.now();
		if (page=="m") {
			if (id=="1") {outputScreen()};
			if (id=="2") {outputUA()};
			if (id=="3") {outputMath()};
			if (id=="4") {outputLanguage()};
			if (id=="5") {outputHeaders()};
			if (id=="6") {outputCookies()};
			if (id=="7") {outputDevices()};
			if (id=="8") {outputCanvas()};
			if (id=="9") {outputDomRect()};
			if (id=="10" && cls=="c1") {outputAudio1()};
			if (id=="10" && cls=="c2") {outputAudio2()};
			if (id=="11" && cls=="c1") {outputFonts1()};
			if (id=="12") {outputMedia()};
			if (id=="13") {outputWebGL()};
			if (id=="14") {outputCSS()};
			if (id=="18") {outputMisc()};
		} else if (page=="e") {
			if (id=="2") {outputWidgets()};
		}
	}
	let checking = setInterval(output_delay, delay);

	// don't delay these ones
	if (page=="m") {
		if (id=="11" && cls=="c2") {outputFonts2("small")};
		if (id=="11" && cls=="c3") {outputFonts2("all")};
	} else if (page=="e") {
		if (id=="3") {outputChrome()};
		if (id=="4") {outputFonts2("monsta")};
	};
};
