/* TABLE: HTTP Headers */

'use strict';

dom.nDoNotTrack = navigator.doNotTrack;
dom.nOnLine = navigator.onLine;

/* network information api: dom.netinfo.enabled */
if ("connection" in navigator) {
  dom.nNetwork = "enabled";
  // desktop: with/without RFP = "[object NetworkInformation]"
  dom.nConnection = navigator.connection;
} else {
  dom.nNetwork = "disabled";
  // desktop: with/without RFP = "undefined"
  dom.nConnection = navigator.connection;
};
