/* TABLE: HTTP Headers */

'use strict';

dom.nDoNotTrack = navigator.doNotTrack;
dom.nOnLine = navigator.onLine;

/* network information api: dom.netinfo.enabled */
if ("connection" in navigator) {
  dom.nNetwork = "enabled";
  
  // only type is returned in desktop
  document.getElementById("nConnection").innerHTML =
  "type: "+ navigator.connection.type + "<br>"+
  "downlink: "+ navigator.connection.downlink +`<br>`+
  "downlinkMax: "+ navigator.connection.downlinkMax +`<br>`+
  "effectiveType: "+ navigator.connection.effectiveType +`<br>`+
  "rtt: "+ navigator.connection.rtt;
} else {
  dom.nNetwork = "disabled";
  // desktop/android: with/without RFP = "undefined"
  dom.nConnection = navigator.connection;
};
