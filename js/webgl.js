/* TABLE: webgl */

'use strict';

function get_webgl_basics() {
	let t0 = performance.now();
	function getWebglContext(canvas){
		try { 
			return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");    
		} catch(e) {}
		return null;
	};
	let canvas = document.createElement('canvas');
	let gl = getWebglContext(canvas);
	if (gl) {
		let ext = gl.getExtension('WEBGL_debug_renderer_info');
		if(ext) {
			//console.log ( "WebGL Version: " + gl.getParameter(gl.VERSION) ); 
			//console.log ( "Shading Language Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) );
			//console.log ( "WebGL Vendor: " + gl.getParameter(gl.VENDOR) );
			//console.log ( "WebGL Renderer: " + gl.getParameter(gl.RENDERER) );
			//console.log ( "WebGL Unmasked Vendor: " + gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) );
			//console.log ( "WebGL Unmasked Renderer: " + gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) );
		}
	}
	// perf
	let t1 = performance.now();
	if (mPerf) {console.debug("  ** webgl basics: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};


function outputWebGL() {
	let t0 = performance.now();
	// functions

	// perf
	let t1 = performance.now();
	if (sPerf) {outputDebug("1", "webgl", (t1-t0), (t1 - gt0))};
};

//outputWebGL();
