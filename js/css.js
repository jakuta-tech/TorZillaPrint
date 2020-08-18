'use strict';

var t0css

function reset_css() {
	dom.sColorHashData.style.color = zhide
	dom.sFontsHashData.style.color = zhide
}

function get_css_block(name) {
	if (isFF) {
		if (name == undefined) {return zB4
		} else if (name == "") {return zB5
		} else if (name == "ReferenceError") {return zB1
		} else if (name == "TypeError") {return zB2
		} else {return zB3}
	} else {
		return "error"
	}
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
			error = get_css_block(e.name)
		}
	})
	let hash = sha1(results.join()),
		notation = s14 + "["+list.length+"] " + sc 
	if (runtype == "s") {
		let control = "1580959336948bb37120a893e8b1cb99c620129e"
		dom.sColorHash.innerHTML = error + (error == "" ? hash + notation + (hash == control ? rfp_green : rfp_red) : "")
	} else if (runtype == "n") {
		dom.sColorHashNew.innerHTML = error + (error == "" ? hash + notation : "")
		dom.sColorHashData.innerHTML = error + (error == "" ? data.join("<br>") : "")
		dom.sColorHashData.style.color = zshow
	} else {
		dom.mColorHash.innerHTML = error + (error == "" ? hash + notation : "")
	}
}

function get_computed_styles() {
	/* https://github.com/abrahamjuliot/creepjs */
	let t0 = performance.now()

	let styleVersion = type => {
		return new Promise(resolve =>  {
			// get CSSStyleDeclaration
			try {
				let cssStyleDeclaration = (
					type == 0 ? getComputedStyle(document.body) :
					type == 1 ? document.body.style :
					type == 2 ? document.styleSheets[0].cssRules[0].style :
					undefined
				)
				if (!cssStyleDeclaration) {
					throw new TypeError("invalid argument string")
				}
				// get properties
				let prototype = Object.getPrototypeOf(cssStyleDeclaration),
					prototypeProperties = Object.getOwnPropertyNames(prototype),
					ownEnumerablePropertyNames = [],
					cssVar = /^--.*$/
				Object.keys(cssStyleDeclaration).forEach(key => {
					let numericKey = !isNaN(key),
						value = cssStyleDeclaration[key],
						customPropKey = cssVar.test(key),
						customPropValue = cssVar.test(value)
					if (numericKey && !customPropValue) {
						return ownEnumerablePropertyNames.push(value)
					} else if (!numericKey && !customPropKey) {
						return ownEnumerablePropertyNames.push(key)
					}
					return
				})
				// get properties in prototype chain (required only in chrome)
				let propertiesInPrototypeChain = {}
				let capitalize = str => str.charAt(0).toUpperCase() + str.slice(1),
					uncapitalize = str => str.charAt(0).toLowerCase() + str.slice(1),
					removeFirstChar = str => str.slice(1),
					caps = /[A-Z]/g
				ownEnumerablePropertyNames.forEach(key => {
					if (propertiesInPrototypeChain[key]) {
						return
					}
					// determine attribute type
					let isNamedAttribute = key.indexOf('-') > -1,
						isAliasAttribute = caps.test(key)
					// reduce key for computation
					let firstChar = key.charAt(0),
						isPrefixedName = isNamedAttribute && firstChar == '-',
						isCapitalizedAlias = isAliasAttribute && firstChar == firstChar.toUpperCase()
					key = (
						isPrefixedName ? removeFirstChar(key) :
						isCapitalizedAlias ? uncapitalize(key) :
						key
					)
					// find counterpart in CSSStyleDeclaration object or its prototype chain
					if (isNamedAttribute) {
						let aliasAttribute = key.split('-').map((word, index) => index == 0 ? word : capitalize(word)).join('')
						if (aliasAttribute in cssStyleDeclaration) {
							propertiesInPrototypeChain[aliasAttribute] = true
						} else if (capitalize(aliasAttribute) in cssStyleDeclaration) {
							propertiesInPrototypeChain[capitalize(aliasAttribute)] = true
						}
					} else if (isAliasAttribute) {
						let namedAttribute = key.replace(caps, char => '-' + char.toLowerCase())
						if (namedAttribute in cssStyleDeclaration) {
							propertiesInPrototypeChain[namedAttribute] = true
						} else if (`-${namedAttribute}` in cssStyleDeclaration) {
							propertiesInPrototypeChain[`-${namedAttribute}`] = true
						}
					}
					return
				})
				// compile keys
				let keys = [
					...new Set([
						...prototypeProperties,
						...ownEnumerablePropertyNames,
						...Object.keys(propertiesInPrototypeChain)
					])
				]
				// checks
				let moz = keys.filter(key => (/moz/i).test(key)).length,
					webkit = keys.filter(key => (/webkit/i).test(key)).length,
					prototypeName = ('' + prototype).match(/\[object (.+)\]/)[1]
				// output
				return resolve({
					keys,
					moz,
					webkit,
					prototypeName
				})
			} catch(e) {
				return resolve(undefined)
			}
		})
	}
	Promise.all([
		styleVersion(0),
		styleVersion(1),
		styleVersion(2)
	]).then(res => {
		// loop
		for (let i=0; i < 3; i=i+1) {
			let el = document.getElementById("cStyles"+i)
			try {
				let results = res[i],
					array = res[i].keys
				if (!isFF) {array.sort()}
				el.innerHTML = sha1(array.join()) + s14+"["+ array.length +"|"+ res[i].moz +"|"+ res[i].webkit +"]"+sc
			} catch(e) {
				el.innerHTML = "error"
			}
		}
		if (logPerf) {debug_log("computed styles [css]",t0)}
		// perf
		debug_page("perf","css",t0css,gt0)
	}).catch(error => {
		console.error(error)
	})
}

function get_computed_styles_old() {
	/* https://github.com/abrahamjuliot/creepjs */
	try {
		if ('getComputedStyle' in window) {
			let body = document.querySelector('body'),
				computedStyle = getComputedStyle(body),
				keys = []
			Object.keys(computedStyle).forEach(key => {
				let numericKey = !isNaN(key),
					value = computedStyle[key],
					cssVar = /^--.*$/,
					customPropKey = cssVar.test(key),
					customPropValue = cssVar.test(value)
				if (numericKey && !customPropValue) {
					keys.push(value)
				} else if (!numericKey && !customPropKey) {
					keys.push(key)
				}
			})
			let moz = keys.filter(key => (/-moz-/).test(key)).length,
				webkit = keys.filter(key => (/-webkit-/).test(key)).length
			dom.cStyles4.innerHTML = sha1(keys.join()) + s14 +"["+ keys.length +"|" + moz +"|"+ webkit +"]"+sc
		}
	} catch(e) {
		let msg = ""
		if (e.name == "ReferenceError") {msg = zB1
		} else if (e.name == "TypeError") {msg = zB2
		} else {msg = zB3}
		dom.sCStyles.innerHTML = msg
	}
}

function get_mm_prefers() {
	// FF63+: reduced-motion
	let x=zNS, q="(prefers-reduced-motion: ", n="no-preference", r="reduce"
	try {
		if (window.matchMedia(q+r+")").matches) x = r+rfp_red
		if (window.matchMedia(q+n+")").matches) x = n+rfp_green
	} catch(e) {x = get_css_block(e.name)}
	if (isFF) {
		if (x == zNS && isVer > 62) {x = zB6}
	}
	dom.mmPRM.innerHTML = x + (x.substring(0,6) == "script" ? rfp_red : "")
	// FF67+: color-scheme
	x=zNS, q="(prefers-color-scheme: "
	let l="light", d="dark"
	try {
		if (window.matchMedia(q+l+")").matches) x = l+rfp_green
		if (window.matchMedia(q+d+")").matches) x = d+rfp_red
		if (window.matchMedia(q+n+")").matches) x = n+rfp_red
	} catch(e) {x = get_css_block(e.name)}
	if (isFF) {
		if (x == zNS && isVer > 66) {x = zB6}
	}
	dom.mmPCS.innerHTML = x + (x.substring(0,6) == "script" ? rfp_red : "")
	// contrast
		// ToDo: notation: 1506364: layout.css.prefers-contrast.enabled
		// browser.display.prefers_low_contrast boolean [hidden]
	x=zNS, q="(prefers-contrast: "
	try {
		if (window.matchMedia(q+n+")").matches) x = n
		if (window.matchMedia(q+"forced)").matches) x = "forced"
		if (window.matchMedia(q+"high)").matches) x = "high"
		if (window.matchMedia(q+"low)").matches) x = "low"
	} catch(e) {x = get_css_block(e.name)}
	dom.mmPC.innerHTML = x
	// forced-colors
		// ToDo: notation: 1659511: layout.css.forced-colors.enabled
	x=zNS, q="(prefers-forced-colors: "
	try {
		if (window.matchMedia(q+n+")").matches) x = n
		if (window.matchMedia(q+"active)").matches) x = "active"
		if (window.matchMedia(q+"none)").matches) x = "none"
	} catch(e) {x = get_css_block(e.name)}
	dom.mmFC.innerHTML = x
}

function get_system_fonts() {
	let results = [],
		data = [],
		error = "",
		m = "-moz-"
	let fonts = ["caption","icon","menu","message-box","small-caption","status-bar",m+"window",m+"desktop",
		m+"document",m+"workspace",m+"info",m+"pull-down-menu",m+"dialog",m+"button",m+"list",m+"field"]
	let el = document.getElementById("sysFont")
	try {
		// script blocking
		let test = getComputedStyle(el).getPropertyValue("font-family")
		// compute
		fonts.forEach(function(font){
			el.style.font = "99px sans-serif"		
			try {el.style.font = font} catch(err) {}
			let s = ""
			if (window.getComputedStyle) {
				try {
					s = getComputedStyle(el, null)
				} catch(e) {}
			} else {
				s = el.currentStyle
			}
			if (s !== "") {
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
			}
		})
	} catch(e) {
		error = get_css_block(e.name)
	}
	// output
	let hash = sha1(results.join()),
		notation = s14 + " [" + fonts.length + "]" + sc
	dom.sFontsHash.innerHTML = error + (error == "" ? hash + notation : "")
	dom.sFontsHashData.innerHTML = error + (error == "" ? data.join("<br>") : "")
	dom.sFontsHashData.style.color = zshow
}

function outputCSS() {
	t0css = performance.now()
	// functions
	get_mm_prefers()
	get_colors("s")
	get_colors("n")
	get_colors("m")
	get_system_fonts()
	get_computed_styles_old()
	get_computed_styles()
}

outputCSS()
