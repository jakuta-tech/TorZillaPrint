/* TABLE: HTTP Headers */

'use strict';

dom.nDoNotTrack = navigator.doNotTrack;
dom.nOnLine = navigator.onLine;

/* network information api: dom.netinfo.enabled */
if ("connection" in navigator) {
  dom.nNetwork = "enabled";
  dom.nConnection = navigator.connection.type;
} else {
  dom.nNetwork = "disabled";
  dom.nConnection = navigator.connection;
};
