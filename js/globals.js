'use strict';

var dom;

let fp_ua = [];

// android viewport
let avh = "",
	firstH = window.innerHeight,
	firstW = window.innerWidth,
// css
	sb = " <span class='bad'>",
	sg = " <span class='good'>",
	sn = " <span class='neutral'>",
	so = " <span class='orange'>",
	se = " <span class='bad'>[test error: ",
	s1 = " <span class='s1'>",
	s2 = " <span class='s2'>",
	s3 = " <span class='s3'>",
	sc = "</span>",
// show/hide text colors
	zhide = "#1a1a1a",
	zshow = "#b3b3b3",
// common results
	zD = "disabled",
	zE = "enabled",
	zNS = "not supported",
	zNA = "n/a",
	zS = "success",
	zF = "failed",
	zFF = "Firefox",
	zTB = "Tor Browser",
	zSIM = " [simulated]",
	zNEW = sb+"[NEW]"+sc,
// notation
	tb_green = sg+"[TB]"+sc,
	tb_red = sb+"[TB]"+sc,
	tb_standard = sg+"[TB Standard]"+sc,
	tb_safer = sg+"[TB Safer]"+sc,
	rfp_green = sg+"[RFP]"+sc,
	rfp_red = sb+"[RFP]"+sc,
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
	default_ff_green = sg+"[FF default]"+sc,
	default_red = sb+"[unusual]"+sc,
	note_random = so+"[random]"+sc,
	note_file = "",
	note_ttc = sn+"test to come"+sc,
	not_seen = sb+"I haven't seen this Firefox ",
	not_seen_tb = sb+"I haven't seen this Tor Browser ",
// error notation
	error_file_404 = se+"file not found]"+sc,
	error_file_cors = sn+"[file:] [Cross-Origin Request Blocked]"+sc,
	error_file_xhr = se+"xhr]"+sc,
	error_iframe = se+" iframe]"+sc,
	error_image = se+"image]"+sc,
	error_global_os = sb+"[test error: global variable not set]"+sc,
// toggle states
	stateDR = false,
	stateFNT = false,
// other
	isPage = "",
	isFF = false,
	isTB = false,
	isOS = "",
	isVer = "",
	isFile = false,
	isSecure = false,
// dev
	gt0,
	logExtra = false,
	logPerf = false,
	logStorage = false,
	runSim = false,
// rerun
	gRerun = false
