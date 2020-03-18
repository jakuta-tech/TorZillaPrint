'use strict';

function get_colors(runtype) {
	let results = [],
		list = [],
		m = "-moz-", mm = m+"mac-",
		element = dom.sColorElement
	if (runtype == "s") {
		list = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText',
		'Canvas','CanvasText','LinkText','VisitedText','ActiveText','Field','FieldText']
	} else {
		list = [m+'activehyperlinktext',m+'appearance',m+'buttondefault',m+'buttonhoverface',
		m+'buttonhovertext',m+'cellhighlight',m+'cellhighlighttext',m+'combobox',m+'comboboxtext',
		m+'default-background-color',m+'default-color',m+'dialog',m+'dialogtext',m+'dragtargetzone',
		m+'eventreerow',m+'field',m+'fieldtext',m+'gtk-buttonactivetext',m+'gtk-info-bar-text',
		m+'html-cellhighlight',m+'html-cellhighlighttext',m+'hyperlinktext',mm+'accentdarkestshadow',
		mm+'accentdarkshadow',mm+'accentface',mm+'accentlightesthighlight',mm+'accentlightshadow',
		mm+'accentregularhighlight',mm+'accentregularshadow',mm+'active-menuitem',mm+'buttonactivetext',
		mm+'chrome-active',mm+'chrome-inactive',mm+'defaultbuttontext',mm+'disabledtoolbartext',
		mm+'focusring',mm+'menuitem',mm+'menupopup',mm+'menuselect',mm+'menushadow',mm+'menutextdisable',
		mm+'menutextselect',mm+'secondaryhighlight',mm+'source-list',mm+'vibrancy-dark',mm+'vibrancy-light',
		mm+'vibrant-titlebar-dark',mm+'vibrant-titlebar-light',m+'menubarhovertext',m+'menubartext',
		m+'menuhover',m+'menuhovertext',m+'nativehyperlinktext',m+'oddtreerow',m+'visitedhyperlinktext',
		m+'win-accentcolor',m+'win-accentcolortext',m+'win-communications-toolbox',
		m+'win-communicationstext',	m+'win-media-toolbox',m+'win-mediatext']
	}
	list.forEach(function (item) {
		element.style.backgroundColor = item
		results.push(window.getComputedStyle(element, null).getPropertyValue("background-color"))
	})
	let hash = sha1(results.join())
	let count = " ["+list.length+"] "
	if (runtype == "s") {
		if (hash == "4701edd5e383b4875b5927bbf4c2ac36d2c7506a") {
			dom.sColorHash.innerHTML = hash + count + rfp_green + " [FF71 or lower]"
		} else if (hash == "43745a20b9434144f62917c78edfdea8661ac8c5") {
			dom.sColorHash.innerHTML = hash + count + rfp_green + " [FF72-75]" // "field"
		} else if (hash == "edde01c67c1e3c41e6a87a694f64b3d75413a8ee") {
			// note: browser.display.use_system_colors: default false affects this
			dom.sColorHash.innerHTML = hash + count + rfp_green + " [FF76+]" // 1590894
		} else {
			dom.sColorHash.innerHTML = hash + count + rfp_red
		}
	} else {
		dom.mColorHash = hash + count
	}
}

function get_mm_prefers(type){
	let x=zNS, l="light", d="dark", n="no-preference", r="reduce", q="(prefers-"+type+": "
	if (type == "color-scheme") {
		if (window.matchMedia(q+l+")").matches) x = l+rfp_green
		if (window.matchMedia(q+d+")").matches) x = d+rfp_red
		if (window.matchMedia(q+n+")").matches) x = n+rfp_red
		dom.mmPCS.innerHTML = x
	}
	if (type == "reduced-motion") {
		if (window.matchMedia(q+r+")").matches) x = r+rfp_red
		if (window.matchMedia(q+n+")").matches) x = n+rfp_green
		dom.mmPRM.innerHTML = x
	}
}

function outputCSS() {
	let t0 = performance.now()
	// functions
	get_mm_prefers("color-scheme")
	get_mm_prefers("reduced-motion")
	get_colors("s")
	get_colors("m")
	// perf
	debug_page("perf","css",t0,gt0)
}

outputCSS()
