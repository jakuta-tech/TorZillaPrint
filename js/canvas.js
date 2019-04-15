/* TABLE: canvas */

/* code courtesy of kkapsner and canvasblocker
   https://canvasblocker.kkapsner.de/test/
   https://github.com/kkapsner/CanvasBlocker
   tiny modifications by newbie Thorin-Oakenpants
*/

"use strict";

var canvas = {
  createHashes: function(window){
    var outputs = [
      {
        name: "getContext",
          value: function(){
          return ["2d", "webgl", "webgl2"].map(function(type){
            var canvas = getCanvas()
            try {
              var context = canvas.getContext(type);
              if (!context){
                throw new Error();
              }
              return type + ": supported";
            }
            catch (e){
              return type + ": not supported";
            }
          }).join(", ");
        }
      },
      {
        name: "toDataURL",
        value: function(){
          return hashDataURL(getFilledContext().canvas.toDataURL());
        }
      },
      {
        name: "toBlob",
        value: function(){
          return new Promise(function(resolve, reject){
            getFilledContext().canvas.toBlob(function(blob){
              var reader = new FileReader();
              reader.onload = function(){
                resolve(hashDataURL(reader.result));
              };
              reader.readAsDataURL(blob);
            });
          });
        }
      },
      {
        name: "mozGetAsFile",
        value: function(){
          return new Promise(function(resolve, reject){
            var file = getFilledContext().canvas.mozGetAsFile("canvas.png");
            var reader = new FileReader();
            reader.onload = function(){
              resolve(hashDataURL(reader.result));
            };
            reader.readAsDataURL(file);
          });
        }
      },
      {
        class: window.CanvasRenderingContext2D,
        name: "getImageData",
        value: function(){
          var context = getFilledContext();
          var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
          return window.crypto.subtle.digest("SHA-256", imageData.data).then(hashToString);
        }
      },
      {
        supported: function(){
          // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
          var context = getContext();
          
          context.rect(0, 0, 10, 10);
          context.rect(2, 2, 6, 6);
          return context.isPointInPath(5, 5, 'evenodd') === false;
        },
        name: "winding",
        value: function(){
          return "supported";
        }
      },
      {
        class: window.CanvasRenderingContext2D,
        name: "isPointInPath",
        value: function(){
          var context = getPathContext();
          
          var data = new Uint8Array(30 * 30);
          for (var x = 0; x < 30; x += 1){
            for (var y = 0; y < 30; y += 1){
              data[y * 30 + x] = context.isPointInPath(x, y);
            }
          }
          return window.crypto.subtle.digest("SHA-256", data).then(hashToString);
        }
      },
      {
        class: window.CanvasRenderingContext2D,
        name: "isPointInStroke",
        value: function(){
          var context = getPathContext();
          
          var data = new Uint8Array(30 * 30);
          for (var x = 0; x < 30; x += 1){
            for (var y = 0; y < 30; y += 1){
              data[y * 30 + x] = context.isPointInStroke(x, y);
            }
          }
          return window.crypto.subtle.digest("SHA-256", data).then(hashToString);
        }
      },
      {
        class: window.CanvasRenderingContext2D,
        name: "fillText",
        value: function(){
          getContext().fillText("test", 0, 0)
          return "supported";
        }
      },
      {
        class: window.CanvasRenderingContext2D,
        name: "strokeText",
        value: function(){
          getContext().strokeText("test", 0, 0);
          return "supported";
        }
      },
      {
        class: window.WebGLRenderingContext,
        name: "readPixels",
        value: function(){
          var context = getFilledWebGlContext();
          if (!context){
            return "webgl not supported";
          }
          
          var pixels = new Uint8Array(context.drawingBufferWidth * context.drawingBufferHeight * 4);
          context.readPixels(0, 0, context.drawingBufferWidth, context.drawingBufferHeight, context.RGBA, context.UNSIGNED_BYTE, pixels);
          
          return window.crypto.subtle.digest("SHA-256", pixels).then(hashToString);
        }
      },
    ];
    function isSupported(output){
      return !!(output.class? output.class: window.HTMLCanvasElement).prototype[output.name];
    }
    function getCanvas(){
      return window.document.createElement("canvas");
    }
    function getContext(type){
      return getCanvas().getContext(type || "2d");
    }
    function getFilledContext(){
      // taken from https://panopticlick.eff.org/static/fp2.js
      var context = getContext();
      var canvas = context.canvas;
      canvas.width = 2000;
      canvas.height = 200;
      canvas.style.display = "inline";
      // detect browser support of canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
      context.rect(0, 0, 10, 10);
      context.rect(2, 2, 6, 6);

      context.textBaseline = "alphabetic";
      context.fillStyle = "#f60";
      context.fillRect(125, 1, 62, 20);
      context.fillStyle = "#069";
      context.font = "11pt no-real-font-123";
      context.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
      context.fillStyle = "rgba(102, 204, 0, 0.7)";
      context.font = "18pt Arial";
      context.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

      // canvas blending
      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
      // http://jsfiddle.net/NDYV8/16/
      context.globalCompositeOperation = "multiply";
      context.fillStyle = "rgb(255,0,255)";
      context.beginPath();
      context.arc(50, 50, 50, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
      context.fillStyle = "rgb(0,255,255)";
      context.beginPath();
      context.arc(100, 50, 50, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
      context.fillStyle = "rgb(255,255,0)";
      context.beginPath();
      context.arc(75, 100, 50, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
      context.fillStyle = "rgb(255,0,255)";
      // canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // http://jsfiddle.net/NDYV8/19/
      context.arc(75, 75, 75, 0, Math.PI * 2, true);
      context.arc(75, 75, 25, 0, Math.PI * 2, true);
      context.fill("evenodd");
      return context;
    }
    function getPathContext(){
      var context = getContext();
      context.canvas.width = 30;
      context.canvas.height = 30;
      
      context.fillStyle = "#000";
      context.beginPath();
      context.arc(15.49, 15.51, 10.314, 0, Math.PI * 2);
      context.closePath();
      context.fill();
      return context;
    }
    function getFilledWebGlContext(){
      // taken from https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
      var context = getContext("webgl") || getContext("webgl2");
      if (!context){
        return null;
      }
      var vertexShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
      var fragmentShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
      var vertexPosBuffer = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
      var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
      context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
      vertexPosBuffer.itemSize = 3;
      vertexPosBuffer.numItems = 3;
      var program = context.createProgram();
      var vertexShader = context.createShader(context.VERTEX_SHADER);
      context.shaderSource(vertexShader, vertexShaderTemplate);
      context.compileShader(vertexShader);
      var fragmentShader = context.createShader(context.FRAGMENT_SHADER);
      context.shaderSource(fragmentShader, fragmentShaderTemplate);
      context.compileShader(fragmentShader);
      context.attachShader(program, vertexShader);
      context.attachShader(program, fragmentShader);
      context.linkProgram(program);
      context.useProgram(program);
      program.vertexPosAttrib = context.getAttribLocation(program, "attrVertex");
      program.offsetUniform = context.getUniformLocation(program, "uniformOffset");
      context.enableVertexAttribArray(program.vertexPosArray);
      context.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, context.FLOAT, !1, 0, 0);
      context.uniform2f(program.offsetUniform, 1, 1);
      context.drawArrays(context.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
      return context;
    }
    function hashToString(hash){
      var chunks = [];
      (new Uint32Array(hash)).forEach(function(num){
        chunks.push(num.toString(16));
      });
      return chunks.map(function(chunk){
        return "0".repeat(8 - chunk.length) + chunk;
      }).join("");
    }
    function hashDataURL(url){
      return crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(url)).then(hashToString);
    }
    var finished = Promise.all(outputs.map(function(output){
      return new Promise(function(resolve, reject){
        var displayValue;
        var supported = output.supported? output.supported(): isSupported(output);
        if (supported){
          try {
            displayValue = output.value();
          }
          catch (e){
            console.error(e);
            // displayValue = "error while testing";
            displayValue = e.name +": "+e.message;
          }
        }
        else {
          displayValue = "not supported";
        }
        
        Promise.resolve(displayValue).then(function(displayValue){
          output.displayValue = displayValue;
          resolve(output);
        }, function(e){
          console.error(e);
          output.displayValue = "error while testing";
          resolve(output);
        });
      });
    }));
    return finished;
  },
  output: function(dataPromise, table){
    if (table){
      dataPromise.then(function(outputs){
        outputs.forEach(function(output){
          var display = table.querySelector("." + output.name);
            if (display){display.textContent = output.displayValue;}
        });
      });
    }
  }
};

function runCanvas(runType) {
  // clear display
  if (runType == "rerun") {
    var cvArray = [`getContext`, `toDataURL`, `toBlob`, `mozGetAsFile`, `getImageData`,
      `winding`, `isPointInPath`, `isPointInStroke`, `fillText`, `strokeText`, `readPixels`];
    cvArray.forEach(function (arrayItem) {
      document.getElementsByClassName(arrayItem)[0].innerHTML="&nbsp"; // &nbsp stops line height jitter
    });
    setTimeout(function(){
      canvas.output(canvas.createHashes(window), document.getElementById("tb8"));
    }, 170); // 170 is same as domrect rerun delay
  } else {
    canvas.output(canvas.createHashes(window), document.getElementById("tb8"));
  };
};

runCanvas("onload");
