'use strict';

var dom;

let fp_ua = []

// android
let avh = "",
	firstH = window.innerHeight,
	firstW = window.innerWidth,
// css
	s0 = " <span class='",
	sb = s0+"bad'>",
	sg = s0+"good'>",
	sf = s0+"faint'>",
	sn = s0+"neutral'>",
	so = s0+"orange'>",
	s1 = s0+"s1'>",
	s2 = s0+"s2'>",
	s3 = s0+"s3'>",
	s4 = s0+"s4'>",
	s5 = s0+"s5'>",
	s6 = s0+"s6'>",
	s7 = s0+"s7'>",
	s8 = s0+"s8'>",
	s9 = s0+"s9'>",
	s10 = s0+"s10'>",
	s11 = s0+"s11'>",
	s12 = s0+"s12'>",
	s13 = s0+"s13'>",
	s14 = s0+"s14'>",
	s15 = s0+"s15'>",
	s16 = s0+"s16'>",
	s17 = s0+"s17'>",
	s18 = s0+"s18'>",
	sc = "</span>",
// show/hide text colors
	zhide = "#1a1a1a",
	zshow = "#b3b3b3",
// common results
	zB = sb+"[blocked]"+sc,
	zD = "disabled",
	zE = "enabled",
	zNS = "not supported",
	zNA = "n/a",
	zS = "success",
	zF = "failed",
	zU = "undefined",
	zFF = "Firefox",
	zTB = "Tor Browser",
	zSIM = " [simulated]",
	zNEW = sb+"[NEW]"+sc,
// notes
	tb_green = sg+"[TB]"+sc,
	tb_red = sb+"[TB]"+sc,
	tb_standard = sg+"[TB Standard]"+sc,
	tb_safer = sg+"[TB Safer]"+sc,
	rfp_green = sg+"[RFP]"+sc,
	rfp_red = sb+"[RFP]"+sc,
	rfp_random_green = sg+"[RFP random]"+sc,
	rfp_random_red = sb+"[RFP random]"+sc,
	lb_green = sg+"[LB]"+sc,
	lb_red = sb+"[LB]"+sc,
	lb_orange = so+"[LB and RFP New Window only work at 100% zoom]"+sc,
	nw_green = sg+"[RFP New Window]"+sc,
	nw_red = sb+"[RFP New Window]"+sc,
	enUS_green = sg+"[en-US]</span> ",
	enUS_red = sb+"[en-US]</span> ",
	spoof_both_green = sg+"[en-US + RFP]"+sc,
	spoof_both_red = sb+"[en-US +/or RFP]"+sc,
	default_tb_green = sg+"[TB default]"+sc,
	default_tb_red = sb+"[TB default]"+sc,
	default_ff_green = sg+"[FF default]"+sc,
	default_ff_red = sb+"[FF default]"+sc,
	note_random = "[random]"+sc,
	match_green = sg+"[match]"+sc,
	match_red = sb+"[match]"+sc,
	note_file = "",
	note_ttc = sf+"test to come"+sc,
	not_seen = sb+"I haven't seen this Firefox ",
// error notes
	se = sb+"[test error: ",
	error_file_404 = se+"file not found]"+sc,
	error_file_cors = sn+"[file:] [Cross-Origin Request Blocked]"+sc,
	error_file_xhr = se+"xhr]"+sc,
	error_iframe = se+"iframe]"+sc,
	error_image = se+"image]"+sc,
	error_global_os = se+"global variable not set]"+sc,
// toggle states
	stateDR = false,
	stateFNT = false,
// other
	isPage = "main",
	isFF = false,
	isTB = false,
	isTB2 = "",
	isOS = "",
	isErr = "",
	isVer = "",
	isBrand = "",
	isFile = false,
	isSecure = false,
// dev
	gt0,
	logExtra = false,
	logPerf = false,
	logStorage = true,
	runS = false,
	stateSIM = false,
// rerun
	gRerun = false
