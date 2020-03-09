'use strict';

function get_colors(type) {
	let results = [],
		list = [],
		m = "-moz-", mm = m+"mac-",
		element = dom.sColorElement
	if (type == "s") {
		list = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText']
	} else {
		list = [m+'ButtonDefault',m+'ButtonHoverFace',m+'CellHighlight',m+'CellHighlightText',
		m+'Combobox',m+'ComboboxText',m+'Dialog',m+'DialogText',m+'DragTargetZone',
		m+'EvenTreeRow',m+'Field',m+'FieldText',m+'MenuHover',m+'MenuHoverText',m+'MenubarText',
		m+'NativeHyperlinkText',m+'OddTreeRow',m+'html-CellHighlight',m+'html-CellHighlightText',
		mm+'chrome-active',mm+'chrome-inactive',mm+'focusring',mm+'menuselect',
		mm+'menushadow',mm+'menutextdisable',mm+'menutextselect',mm+'menutextselect',
		mm+'DisabledToolbarText',mm+'AlternatePrimaryHighlight',mm+'SecondaryHighlight',
		m+'win-MediaText',m+'win-CommunicationsText',m+'ActiveHyperlinkText',m+'HyperLinkText',
		m+'VisitedHyperlinkText',m+'default-background-color',m+'default-color']
	}
	list.forEach(function (item) {
		element.style.backgroundColor = item
		results.push(window.getComputedStyle(element, null).getPropertyValue("background-color"))
	})
	let hash = sha1(results.join())
	if (type == "s") {
		dom.sColorHash.innerHTML = hash += (hash == "c833ed5e44c6da5e9fc2964259bf34b280891b73" ? rfp_green : rfp_red)
	} else {
		dom.mColorHash = hash
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
