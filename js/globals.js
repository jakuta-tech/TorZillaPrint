'use strict';

var dom;
var jsZoom;
var TBy=" <span class='good'>[TB]</span>"; // u2713
var TBn=" <span class='bad'>[TB]</span>"; // u2715
var RFPy=" <span class='good'>[RFP]</span>";
var RFPn=" <span class='bad'>[RFP]</span>";
var FILEy=" <span class='ttc'>[file:]</span>"
var TTC=" <span class='ttc'>test to come</span>"
var amFF = false;
if (isNaN(window.mozPaintCount) === false) {amFF = true};

/* other Firefox detection methods
if (isNaN(window.mozInnerScreenX) === false) {"FF"};
if (isNaN(window.window.scrollMaxX) === false) {"FF"};
if (navigator.oscpu == undefined){} else {"FF"}; */
