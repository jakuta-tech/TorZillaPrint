/* TABLE: CSS */

'use strict';

function get_prefers_color_scheme(){
	let e = dom.pColorElement;
	let k = window.getComputedStyle(e, null).getPropertyValue("background-color");
	if (k == "rgb(255, 255, 255)") {k = "light" + rfp_green}
	else if (k == "rgb(255, 0, 0)") {k = "not supported"}
	else if (k == "rgb(0, 0, 0)") {k = "dark" + rfp_red}
	else if (k == "rgb(0, 0, 255)") {k = "no-preference" + rfp_red};
	dom.pColorScheme.innerHTML = k;
};

function get_prefers_reduced_motion() {
	let e = dom.pMotionElement;
	let k = window.getComputedStyle(e, null).getPropertyValue("background-color");
	if (k == "rgb(255, 255, 255)") {k = "no-preference" + rfp_green}
	else if (k == "rgb(255, 0, 0)") {k = "not supported"}
	else if (k == "rgb(0, 0, 0)") {k = "reduce" + rfp_red};
	dom.pReducedMotion.innerHTML = k;
};

function get_system_colors(type) {
	let s = "",
		array = [],
		e = dom.sColorElement;
	if (type == "system") {
		array = ['ActiveBorder','ActiveCaption','AppWorkspace','Background','ButtonFace',
		'ButtonHighlight','ButtonShadow','ButtonText','CaptionText','GrayText','Highlight',
		'HighlightText','InactiveBorder','InactiveCaption', 'InactiveCaptionText','InfoBackground',
		'InfoText','Menu','MenuText','Scrollbar','ThreeDDarkShadow','ThreeDFace', 'ThreeDHighlight',
		'ThreeDLightShadow','ThreeDShadow','Window','WindowFrame', 'WindowText'];
	} else if (type == "moz") {
		array = ['-moz-ButtonDefault','-moz-ButtonHoverFace','-moz-CellHighlight','-moz-CellHighlightText',
		'-moz-Combobox','-moz-ComboboxText','-moz-Dialog','-moz-DialogText','-moz-DragTargetZone',
		'-moz-EvenTreeRow','-moz-Field','-moz-FieldText','-moz-MenuHover','-moz-MenuHoverText','-moz-MenubarText',
		'-moz-NativeHyperlinkText','-moz-OddTreeRow','-moz-html-CellHighlight','-moz-html-CellHighlightText',
		'-moz-mac-chrome-active','-moz-mac-chrome-inactive','-moz-mac-focusring','-moz-mac-menuselect',
		'-moz-mac-menushadow','-moz-mac-menutextdisable','-moz-mac-menutextselect','-moz-mac-menutextselect',
		'-moz-mac-DisabledToolbarText','-moz-mac-AlternatePrimaryHighlight','-moz-mac-SecondaryHighlight',
		'-moz-win-MediaText','-moz-win-CommunicationsText','-moz-ActiveHyperlinkText','-moz-HyperLinkText',
		'-moz-VisitedHyperlinkText','-moz-default-background-color','-moz-default-color'];
	}
	array.forEach(function (item) {
		e.style.backgroundColor = item;
		s = s + window.getComputedStyle(e, null).getPropertyValue("background-color")
		// console.log(window.getComputedStyle(e, null).getPropertyValue("background-color"), item)
	});
	s = sha1(s);
	if (type == "system") {
		dom.sColorHash.innerHTML = (s == "b5e2344c265fc498d2fb8e0f84951e8d501ad481" ? s + rfp_green : s + rfp_red);
	} else if (type == "moz") {
		// ad55ec68f093cb2869190bc1cd18b206424db02b = all rgb(0, 0, 0)
		dom.mColorHash.innerHTML = s
	}
};


function outputCSS() {
	let t0 = performance.now();
	// functions
	get_prefers_color_scheme();
	get_prefers_reduced_motion();
	get_system_colors("system");
	get_system_colors("moz");
	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "css", (t1-t0), (t1 - gt0))};
};

outputCSS();
