/* TABLE: chrome:// */
'use strict';

function outputResource() {

// FF only
if ("undefined" != typeof InstallTrigger) {
	dom.jsHashR = "tests are running"
	dom.cssHashR = "give it a second"
	let c = "chrome://browser/content/",
		o =  "resource://onboarding/",
		oi = "resource://onboarding/img/",
		ol = "resource://onboarding/lib/",
		s = "chrome://browser/skin/"

	// we only want to pick up TB files: so exclude anything used by FF (for now)
	// can I detect anything for TB on Android

	let jsUris = [
		'resource://torbutton-abouttor/aboutTor.js', // new in 9.5a5
		o+'onboarding-tor-circuit-display.js',
	]
	let imgUris = [
		c+'torpreferences/torPreferencesIcon.svg', // new in 9
		c+'securitylevel/securityLevelButton.svg',
		s+'new_circuit.svg', // new in 9
		s+'new_identity.svg', // new in 9
		s+'onion.svg',
		s+'onion-disabled.svg',
		s+'onion-lock.svg',
		oi+'figure_tor-circuit-display.png',
		oi+'figure_tor-expect-differences.png',
		oi+'figure_tor-network.png',
		oi+'figure_tor-onion-services.png',
		oi+'figure_tor-privacy.png',
		oi+'figure_tor-security-level.png',
		oi+'figure_tor-security.png',
		oi+'figure_tor-toolbar-layout.png',
		oi+'figure_tor-welcome.png',
		oi+'icons_no-icon.png',
		oi+'tor-watermark.png',
	]
	let cssUris = [
		'resource://torbutton-assets/aboutTor.css',
		//o+'onboarding.css', // isFF and isTB: can I read the contents
	]

	// JS
	let allHash = [],
		jsHash = []
	jsUris.forEach(function(src) {
		let script = document.createElement('script')
		script.src = src
		document.head.appendChild(script)
		script.onload = function() {
			jsHash.push(src)
			allHash.push(src)
		};
		document.head.removeChild(script)
	})
	// IMAGES
	let imgHash = []
	imgUris.forEach(function(imgUri) {
		let img = document.createElement("img");
		img.src = imgUri
		img.style.height = "20px"
		img.style.width = "20px"
		img.onload = function() {
			imgHash.push(imgUri)
			allHash.push(imgUri)
		}
	})
	// CSS
	let cssHash = []
	cssUris.forEach(function(cssUri) {
		let css = document.createElement("link")
		css.href = cssUri
		css.type = "text/css"
		css.rel = "stylesheet"
		document.head.appendChild(css)
		css.onload = function() {
			cssHash.push(cssUri)
			allHash.push(cssUri)
		};
		document.head.removeChild(css)
	})

	function output_chrome() {
		clearInterval(checking)
		// counts
		let foundI = imgHash.length,
			foundJ = jsHash.length,
			foundC = cssHash.length,
			foundA = allHash.length
		// hashes
		let hashI = sha1(imgHash.sort()),
			hashJ = sha1(jsHash.sort()),
			hashC = sha1(cssHash.sort()),
			hashA = sha1(allHash.sort())
		// output
		dom.imgHashR = hashI + " ["+ foundI +"/" + imgUris.length +"]"
		dom.jsHashR = hashJ + " ["+ foundJ +"/" + jsUris.length +"]"
		dom.cssHashR = hashC + " ["+ foundC +"/" + cssUris.length +"]"
		let countTested = imgUris.length + jsUris.length + cssUris.length
		dom.allHashR = sha1(hashA) + " ["+ foundA +"/"+ countTested +"]"
		// data
		cssHash.sort()
		jsHash.sort()
		imgHash.sort()
		let strOut = ""
		if (foundC > 0) {
			strOut = s2+"--- css ---"+sc + "<br>"+cssHash.join("<br>")
		}
		if (foundJ > 0) {
			strOut += "<br>"+s2+"--- js ---"+sc + "<br>"+jsHash.join("<br>")
		}
		if (foundI > 0) {
			strOut += "<br>"+s2+"--- img ---"+sc + "<br>"+imgHash.join("<br>")
		}
		if (strOut.substring(0,4) == "<br>") {strOut = strOut.slice(4, strOut.length)}
		dom.allLoadedR.innerHTML = strOut
		// label
		dom.resourceRun = "[ re-run tests ]"
	}
	// wait 1 second
	let checking = setInterval(output_chrome, 1000)

};
};
