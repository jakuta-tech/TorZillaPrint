'use strict';

var dom;

let avh="", // android viewport height
	firstH=window.innerHeight,
	firstW=window.innerWidth;

let sb=" <span class='bad'>",
	sg=" <span class='good'>",
	sn=" <span class='neutral'>",
	so=" <span class='orange'>",
	se=" <span class='bad'>[test error: ",
	s1=" <span class='s1'>",
	sc="</span>";

let zhide="#1a1a1a", // color to hide text
	zshow="#b3b3b3"; // color to show text

// notation
let tb_green=sg+"[TB]"+sc,
	tb_red= sb+"[TB]"+sc,
	tb_standard=sg+"[TB Standard]"+sc,
	tb_safer=sg+"[TB Safer]"+sc,
	rfp_green=sg+"[RFP]"+sc,
	rfp_red=sb+"[RFP]"+sc,
	lb_green=sg+"[LB]"+sc,
	lb_red=sb+"[LB]"+sc,
	lb_orange=so+"[LB and RFP New Window only work at 100% zoom]"+sc,
	nw_green=sg+"[RFP New Window]"+sc,
	nw_red=sb+"[RFP New Window]"+sc,
	enUS_green=sg+"[en-US]</span> ",
	enUS_red=sb+"[en-US]</span> ",
	spoof_green=sg+"[Spoof English]"+sc,
	spoof_red=sb+"[Spoof English]"+sc,
	spoof_both_green=sg+"[Spoof English + RFP]"+sc,
	spoof_both_red=sb+"[Spoof English +/or RFP]"+sc,
	default_tb_green=sg+"[TB default]"+sc,
	default_ff_green=sg+"[FF default]"+sc,
	default_red=sb+"[unusual]"+sc,
	note_random=sg+"[random]"+sc,
	note_file="",
	note_ttc=sn + "test to come"+sc,
	not_seen=sb+"I haven't seen this Firefox ";

// error notation
let error_file_404=se+"file not found]"+sc,
	error_file_cors=sn+"[file:] [Cross-Origin Request Blocked]"+sc,
	error_file_xhr=se+"xhr]"+sc,
	error_iframe=se+" iframe]"+sc,
	error_image=se+"image]"+sc,
	error_global_os=sb+"[test error: global variable not set]"+sc;

// other
let isPage="",
	isFF=false,
	isTB=false,
	isOS="",
	isVer="",
	isFile=false,
	isSecure=false;

// perf/debug
let	gt0,
	mPerf=true, // minor
	sRerun=false,
	sDebug=false; // storage debug
