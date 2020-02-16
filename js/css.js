/* TABLE: CSS */
'use strict';

function get_colors(type) {
	let results = [],
		list = [],
		element = dom.sColorElement
	if (type == "system") {
		list = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText']
	} else if (type == "moz") {
		list = ['-moz-ButtonDefault','-moz-ButtonHoverFace','-moz-CellHighlight','-moz-CellHighlightText',
		'-moz-Combobox','-moz-ComboboxText','-moz-Dialog','-moz-DialogText','-moz-DragTargetZone',
		'-moz-EvenTreeRow','-moz-Field','-moz-FieldText','-moz-MenuHover','-moz-MenuHoverText','-moz-MenubarText',
		'-moz-NativeHyperlinkText','-moz-OddTreeRow','-moz-html-CellHighlight','-moz-html-CellHighlightText',
		'-moz-mac-chrome-active','-moz-mac-chrome-inactive','-moz-mac-focusring','-moz-mac-menuselect',
		'-moz-mac-menushadow','-moz-mac-menutextdisable','-moz-mac-menutextselect','-moz-mac-menutextselect',
		'-moz-mac-DisabledToolbarText','-moz-mac-AlternatePrimaryHighlight','-moz-mac-SecondaryHighlight',
		'-moz-win-MediaText','-moz-win-CommunicationsText','-moz-ActiveHyperlinkText','-moz-HyperLinkText',
		'-moz-VisitedHyperlinkText','-moz-default-background-color','-moz-default-color']
	}
	list.forEach(function (item) {
		element.style.backgroundColor = item
		results.push(window.getComputedStyle(element, null).getPropertyValue("background-color"))
	})
	let hash = sha1(results.join())
	if (type == "system") {
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
	get_colors("system")
	get_colors("moz")
	// perf
	debug_page("perf","css",t0,gt0)
}

outputCSS()
