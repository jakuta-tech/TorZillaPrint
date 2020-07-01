'use strict';

function reset_css() {
	dom.sColorHashData.style.color = zhide
	dom.sFontsHashData.style.color = zhide
}

function get_colors(runtype) {
	let results = [],
		data = [],
		list = [],
		error = "",
		m = "-moz-",
		mm = m+"mac-",
		element = dom.sColorElement
	if (runtype == "s") {
		list = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText']
	} else if (runtype == "n") {
		list = ['Canvas','CanvasText','LinkText','VisitedText','ActiveText','Field','FieldText']
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
	list.forEach(function(item) {
		element.style.backgroundColor = item
		try {
			let x = window.getComputedStyle(element, null).getPropertyValue("background-color")
			results.push(item+": "+x)
			if (runtype == "n") {
				data.push(item.padStart(11) + ": " + x)
			}
		} catch(e) {
			if (isFF) {
				if (e.name == "ReferenceError") {error = zB1
				} else if (e.name == "TypeError") {error = zB2
				} else {error = zB3}
			} else {
				error = "error"
			}
		}
	})
	let hash = sha1(results.join()),
		notation = s14 + "["+list.length+"] " + sc 
	if (runtype == "s") {
		let control = "1580959336948bb37120a893e8b1cb99c620129e"
		dom.sColorHash.innerHTML = error + (error == "" ? hash + (hash == control ? rfp_green : rfp_red) : "")
	} else if (runtype == "n") {
		dom.sColorHashNew.innerHTML = error + (error == "" ? hash + notation : "")
		dom.sColorHashData.innerHTML = error + (error == "" ? data.join("<br>") : "")
		dom.sColorHashData.style.color = zshow
	} else {
		dom.mColorHash.innerHTML = error + (error == "" ? hash + notation : "")
	}
}

function get_mm_prefers(type) {
	let x=zNS, l="light", d="dark", n="no-preference", r="reduce", q="(prefers-"+type+": "
	let msg = ""
	function get_block(name) {
		if (name == undefined) {return zB4
		} else if (name == "") {return zB5
		} else if (name == "ReferenceError") {return zB1
		} else if (name == "TypeError") {return zB2
		} else {return zB3}
	}

	if (type == "color-scheme") {
		try {
			if (window.matchMedia(q+l+")").matches) x = l+rfp_green
			if (window.matchMedia(q+d+")").matches) x = d+rfp_red
			if (window.matchMedia(q+n+")").matches) x = n+rfp_red
		} catch(e) {x = get_block(e.name)}
		dom.mmPCS.innerHTML = x
	}
	if (type == "reduced-motion") {
		try {
			if (window.matchMedia(q+r+")").matches) x = r+rfp_red
			if (window.matchMedia(q+n+")").matches) x = n+rfp_green
		} catch(e) {x = get_block(e.name)}
		dom.mmPRM.innerHTML = x
	}
	if (type == "contrast") {
		try {
			if (window.matchMedia(q+n+")").matches) x = n
			if (window.matchMedia(q+"forced)").matches) x = "forced"
			if (window.matchMedia(q+"high)").matches) x = "high"
			if (window.matchMedia(q+"low)").matches) x = "low"
		} catch(e) {x = get_block(e.name)}
		dom.mmPC.innerHTML = x
	}
}

function get_system_fonts() {
	let results = [],
		data = [],
		m = "-moz-"
	let fonts = ["caption","icon","menu","message-box","small-caption","status-bar",m+"window",m+"desktop",
		m+"document",m+"workspace",m+"info",m+"pull-down-menu",m+"dialog",m+"button",m+"list",m+"field"]
	let el = document.getElementById("sysFont")
	// build
	try {
		fonts.forEach(function(font){
			el.style.font = "99px sans-serif"		
			try {
				el.style.font = font
			} catch(err) {}
			let s = ""
			if (window.getComputedStyle) {s = getComputedStyle(el, null)} else {s = el.currentStyle}
			let f = undefined
			if (s.fontSize != "99px") {
				f = s.fontFamily + " " + s.fontSize;
				if (s.fontWeight != 400 && s.fontWeight != "normal") {
					f += ", " +	(s.fontWeight == 700 ? "bold" :
						typeof s.fontWeight == "number" ? "weight " + s.fontWeight :
						s.fontWeight)
				}
				if (s.fontStyle != "normal") {
					f += ", " + s.fontStyle
				}
			}
			data.push(font.padStart(20) + ": " + f)
			results.push(font+":"+f)
		})
	} catch(e) {
		// script blocked
		console.debug("systemFonts",e.name, e.message)

	}
	// output
	dom.sFontsHash.innerHTML = sha1(results.join()) + s14 + " [" + results.length + "]"
	dom.sFontsHashData.innerHTML = data.join("<br>")
	dom.sFontsHashData.style.color = zshow
}

function outputCSS() {
	let t0 = performance.now()
	// functions
	get_mm_prefers("color-scheme")
	get_mm_prefers("reduced-motion")
	get_mm_prefers("contrast")
	get_colors("s")
	get_colors("n")
	get_colors("m")
	get_system_fonts()
	// perf
	debug_page("perf","css",t0,gt0)
}

outputCSS()
