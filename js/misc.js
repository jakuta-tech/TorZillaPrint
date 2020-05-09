'use strict';

function reset_misc() {
	dom.nProto2.style.color = zhide
	dom.shimdata.style.color = zhide
	dom.mathmltest.style.color = zhide
}

function get_component_shims() {
	let shim = (typeof Components === "undefined") ? zU : Object.getOwnPropertyNames(Components.interfaces).join(", ")
	dom.shimdata = shim
	dom.shimdata.style.color = zshow
	if (shim !== zU) {shim = sha1(shim) + s18 +"["+ shim.split(", ").length +" items]"+ sc}
	dom.shim.innerHTML = shim
}

function get_int_observer() {
	let callback = function(entries, observer) {}
	try {
		let observer = new IntersectionObserver(callback)
		dom.intObserver = zE
	} catch(e) {
		dom.intObserver = zD
	}
}

function get_mathml(type) {
	// build
	let str = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo><mi>b</mi>"+
		"<mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"+
		"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"+
		"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>"
	dom.mathmltest.innerHTML = str
	dom.mathmltest.style.color = zshow
	// measure
	let test = dom.mathmltest.offsetHeight,
		control = dom.nOnLine.offsetHeight, // a row with plain text and info icon
		diff = Math.abs(test-control)
	// compare: use a range as zoom affects diff
	dom.mathml.innerHTML = (diff < 10 ?
		zD+" | offsetHeight difference: "+ diff+ tb_safer :
		zE+" | offsetHeight difference: "+ diff+ tb_standard
	)
}

function get_nav_prototype() {
	let nProto = Object.keys(Object.getPrototypeOf(navigator)).join(", ")
	dom.nProto.innerHTML = sha1(nProto) + s18 +"["+ nProto.split(', ').length +" items]"+ sc
	dom.nProto2 = nProto
	dom.nProto2.style.color = zshow
}

function get_reporting_api() {
	// FF65+
	try {
		let observer = new ReportingObserver(function() {})
		dom.reportingAPI = zE
	} catch(e) {
		if (isFF) {
			dom.reportingAPI = (isVer > 64 ? zD : zNS )
		} else {
			dom.reportingAPI = zD+" [or "+zNS+"]"
		}
	}
}

function get_rfptime() {
	let i = 0,
		result = true,
		times = [],
		p0 = performance.now()
	function run() {
		if (i < 10) {
			let p1 = performance.now()
			times.push((p1-p0) % 100)
			if ((p1-p0) % 100 > 0) {result = false}
			i++
		} else {
			clearInterval(check)
			dom.rfpperf.innerHTML = (result? "100 ms" + rfp_green : times.join(", ") + rfp_red)
		}
	}
	let check = setInterval(run, 13)
}

function get_rfptime2() {
	let result = zD
	if (window.PerformanceNavigationTiming) {result = zE}
	if (isFF && isVer > 77) {
		//78+: 1511941
		result = (result == zD ? result + rfp_green : result + rfp_red)
	}
	dom.rfpperf2.innerHTML = result
}

function get_svg() {
	// svg
	let s = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	s.setAttribute("width","100")
	s.setAttribute("height","100")
	// circle
	let c = document.createElementNS("http://www.w3.org/2000/svg", "circle")
	c.setAttributeNS(null,"cx",50)
	c.setAttributeNS(null,"cy",50)
	c.setAttributeNS(null,"r",40)
	// attach circle->svg->element
	s.appendChild(c)
	dom.svgDiv.appendChild(s)
	// output
	dom.svgBasicTest = (dom.svgDiv.offsetHeight > 0 ? zE : zD)
	// remove
	dom.svgDiv.removeChild(s)
}

function get_wasm() {
	let supported = (() => {
		try {
			if (typeof WebAssembly === "object"	&& typeof WebAssembly.instantiate === "function") {
				const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00))
				if (module instanceof WebAssembly.Module)
					return new WebAssembly.Instance(module) instanceof WebAssembly.Instance
			}
		} catch (e) {}
		return false
	})()
	// ToDo: dom.wasm.innerHTML = (supported ? zE+tb_standard : zD+tb_safer) // currently alpha
	dom.wasm = (supported ? zE : zD )
}

function get_windowcontent() {
	try {
		let test = window.content
		let test2 = content.name
		return zE
	} catch(e) {
		return zD
	}
}

function outputMisc(type) {
	let t0 = performance.now()
	// one-liners
	dom.nBeacon = (navigator.sendBeacon ? zE : zD)
	dom.nClipboard = ("clipboard" in navigator ? zE: zD) // FF63+
	dom.reqIdleCB = ("requestIdleCallback" in window ? zE: zD)
	dom.mediaSession = ("mediaSession" in navigator ? zE: zD) // FF71+
	dom.webauth = ("credentials" in navigator ? zE: zD) +" | "+ ("u2f" in window ? zE: zD)
	dom.webshare = (navigator.share ? zE : zD)
	dom.wincon = get_windowcontent()
	// other
	get_component_shims()
	get_int_observer()
	get_mathml(type)
	get_nav_prototype()
	get_reporting_api()
	get_svg()
	get_wasm()
	get_rfptime2()
	get_rfptime()
	// perf
	debug_page("perf","misc",t0,gt0)
}

outputMisc("load")
