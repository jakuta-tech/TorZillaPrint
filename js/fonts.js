/* TABLE: Fonts */

'use strict';

function runFont(){

  /* ARTHUR'S TEST: ENUMERATE FONTS
     https://github.com/arthuredelstein/tordemos */
    var iframeFF = document.getElementById("iframeFF");
    iframeFF.src = "iframes/fontfallback.html";
    iframeFF.addEventListener("load", function(){
      dom.fontFB = "test is running... please wait";
      dom.fontFBFound = "";
      var fontFBTest = iframeFF.contentWindow.document.getElementById("fontFBTest");
      fontFBTest.style.fontSize = "256px";
      // return width of the element with a given fontFamily
      let measureWidthForFont = function (fontFamily) {
        fontFBTest.style.fontFamily = fontFamily;
        return fontFBTest.offsetWidth;
      };
      // standard width for the text string with fallback font
      let width0 = null;
      // determines whether a code point is available
      let isFontPresent = function (fontName) {
        // Measure the font width twice: once with serif as fallback and once with sans-serif
        // as fallback. Under the assumption that serif and sans-serif have different widths,
        // only if the font is present will the resulting widths be equal.
        width0 = width0 || measureWidthForFont("fontFallback");
        let width1 = measureWidthForFont("'" + fontName + "', fontFallback");
        return width0 !== width1;
      };
      // Takes a list of possible fonts, and returns fonts present
      var fontfbYes = 0; var fontfbAll = 0;
      let enumerateFonts = function (possibleFonts) {
        let fontsPresent = [];
        for (let font of possibleFonts) {
          if (isFontPresent(font)) {fontsPresent.push(font); fontfbYes++;}
          fontfbAll++;
        }
        return [fontsPresent];
      };
      // return a list
      let htmlFontList = function (fonts) {
        let list = "";
        for (let font of fonts) {list += font + ", ";}
        return list;
      };
      // read a text file and returns a promise resolving to the contents.
      let readTextFile = function (filename) {
        return new Promise(function (resolve) {
          let xhr = new XMLHttpRequest();
          xhr.overrideMimeType("text/plain; charset=utf-8");
          xhr.open("GET", filename);
          xhr.addEventListener("load", function () {
            resolve(xhr.responseText);
          });
          xhr.send();
        });
      };
      // retrieves a set of code points that are representative
      // of the various unicode blocks.xf
      let retrieveCodePoints = function* () {
        let text = yield readTextFile("txt/fontFallbackUnicodeBlocks.txt");
        let codePoints = text
          .split("\n")
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .map(x => parseInt(x))
          .map(x => x + 1);
        codePoints[0] = 77;
        return codePoints;
      };
      // return promise resolving to an array of fonts from a predefined list
      let retrieveFontList = function* () {
        let text = yield readTextFile("txt/fontFallbackList.txt");
        return text.split("\n").filter(s => s.length > 0);
      };
      // run the test
      spawn(function* () {
        let codePoints = yield retrieveCodePoints();
        let testString = codePoints.map(x => String.fromCodePoint(x)).join("</span>\n<span>");
        fontFBTest.innerHTML = testString;
        let fontList = yield retrieveFontList();
        // we need to make sure the list/fallback font is fully loaded etc
        setTimeout(function(){
          var [fontsPresent] = enumerateFonts(fontList);
          var strFontFB = htmlFontList(fontsPresent);
          // if we have detected at least one font, remove trailing comma and space
          if (fontfbYes > 0) {
            strFontFB = strFontFB.slice(0, -2);
            dom.fontFBFound.innerHTML = strFontFB; }
          else { dom.fontFBFound.innerHTML = "no fonts detected"};
          dom.fontFB = sha1(strFontFB) + " ["+fontfbYes+"/"+fontfbAll+"]";
        }, 1000);
      });
    });

  /* FINGERPRINTJS2 based
     https://valve.github.io/fingerprintjs2/ */

  /* FONT GLYPHS
     Fifield and Egelman (2015) */

};
