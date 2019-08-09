/* TABLE: webgl */

'use strict';

function outputWebGL() {
	let t0 = performance.now();

	function getWebglContext(canvas){
		try { 
			return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");    
		} catch(e) {}
		return null;
	}

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
	if (sPerf) {console.debug("webgl section: " + (t1-t0) + " ms" + " | " + (t1 - gt0) + " ms")};
};

outputWebGL();
