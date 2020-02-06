/* TABLE: CSS */

'use strict';

function get_colors(type) {
	let s = "",
		array = [],
		e = dom.sColorElement;
	if (type == "system") {
		array = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace','ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame','WindowText']
	} else if (type == "moz") {
		array = ['-moz-ButtonDefault','-moz-ButtonHoverFace','-moz-CellHighlight','-moz-CellHighlightText',
		'-moz-Combobox','-moz-ComboboxText','-moz-Dialog','-moz-DialogText','-moz-DragTargetZone',
		'-moz-EvenTreeRow','-moz-Field','-moz-FieldText','-moz-MenuHover','-moz-MenuHoverText','-moz-MenubarText',
		'-moz-NativeHyperlinkText','-moz-OddTreeRow','-moz-html-CellHighlight','-moz-html-CellHighlightText',
		'-moz-mac-chrome-active','-moz-mac-chrome-inactive','-moz-mac-focusring','-moz-mac-menuselect',
		'-moz-mac-menushadow','-moz-mac-menutextdisable','-moz-mac-menutextselect','-moz-mac-menutextselect',
		'-moz-mac-DisabledToolbarText','-moz-mac-AlternatePrimaryHighlight','-moz-mac-SecondaryHighlight',
		'-moz-win-MediaText','-moz-win-CommunicationsText','-moz-ActiveHyperlinkText','-moz-HyperLinkText',
		'-moz-VisitedHyperlinkText','-moz-default-background-color','-moz-default-color']
	}
	array.forEach(function (item) {
		e.style.backgroundColor = item
		s = s+window.getComputedStyle(e, null).getPropertyValue("background-color")
	});
	s = sha1(s)
	if (type == "system") {
		dom.sColorHash.innerHTML = (s == "b5e2344c265fc498d2fb8e0f84951e8d501ad481" ? s + rfp_green : s + rfp_red)
	} else {
		dom.mColorHash = s
	}
}

function get_mm_prefers(type){
	let x = "not supported", l="light", d="dark", n="no-preference", r="reduce", q = "(prefers-"+type+": ";
	if (type == "color-scheme") {
		if (window.matchMedia(q+l+")").matches) x = l + rfp_green
		if (window.matchMedia(q+d+")").matches) x = d + rfp_red
		if (window.matchMedia(q+n+")").matches) x = n + rfp_red
		dom.mmPCS.innerHTML = x
	}
	else if (type == "reduced-motion") {
		if (window.matchMedia(q+r+")").matches) x = r + rfp_red
		if (window.matchMedia(q+n+")").matches) x = n + rfp_green
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
	let t1 = performance.now()
	outputDebug("1","css",(t1-t0),(t1-gt0))
}

outputCSS()
