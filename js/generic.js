'use strict';

function getUniqueElements() {
  // live interface for snazzy access to DOM elements with an ID
  // more efficient and clean than calling getElementById a gazillion times
  const dom = document.getElementsByTagName('*');
  return new Proxy(dom, {
    get: function(obj, prop) {
      return obj[prop];
    },
    set: function(obj, prop, val) {
        obj[prop].textContent = `${val}`;
        return true;
    }
  });
};

function showhide(toggleType, toggleID, togWord) {
  var xyz = document.getElementsByClassName("tog"+toggleID); var abc;
  for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = toggleType;}
  document.getElementById("label"+toggleID).innerHTML = togWord+" details";
  // domrect show/hide extra sections & change drFirstHeader text
  if (toggleID == "D") {
    var drArray = [dom.dr1.innerHTML, dom.dr2.innerHTML, dom.dr3.innerHTML, dom.dr4.innerHTML];
    var xyz = document.getElementsByClassName("togD1"); var abc;
    if (drArray.every( (val, i, arr) => val === arr[0] )) {
      // hide last three
      dom.drFirstHeader.innerHTML = "Element.getClientRects"+`<br>`+"[note: the other three methods have the same hash and values]";
      for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = "none";};
    } else {
      // display last three
      dom.drFirstHeader.innerHTML = "Element.getClientRects";
      for (abc = 0; abc < xyz.length; abc++) { xyz[abc].style.display = toggleType;};
    };
  };
};

var drState = false; // track domrect details state
function toggleitems(chkbxState, chkbxID) {
  if (chkbxState.checked) {
    if (chkbxID == "D") {drState = false};
    showhide("none", chkbxID, "&#9660; show");
  }
  else {
    if (chkbxID == "D") {drState = true};
    showhide("table-row", chkbxID, "&#9650; hide");
  }
};

function copyclip(element) {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(element));
    range.select().createTextRange();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(element));
    window.getSelection().addRange(range);
    document.execCommand("copy");
  }
};

function base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
    return base64js.fromByteArray(bytes);
};

function base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
};

function byteArrayToHex(arrayBuffer){
  var chunks = [];
  (new Uint32Array(arrayBuffer)).forEach(function(num){
    chunks.push(num.toString(16));
  });
  return chunks.map(function(chunk){
    return "0".repeat(8 - chunk.length) + chunk;
  }).join("");
};

function sha1(str1){
  for (var blockstart=0,
    i = 0,
    W = [],
    H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
    A, B, C, D, F, G,
    word_array = [],
    temp2,
    s = unescape(encodeURI(str1)),
    str_len = s.length;
    i<=str_len;){
    word_array[i>>2] |= (s.charCodeAt(i)||128)<<(8*(3-i++%4));
  }
  word_array[temp2 = ((str_len+8)>>6<<4)+15] = str_len<<3;
  for (; blockstart <= temp2; blockstart += 16) {
    A = H,i=0;
    for (; i < 80;
      A = [[
        (G = ((s=A[0])<<5|s>>>27) + A[4] + (W[i] = (i<16) ? ~~word_array[blockstart + i] : G<<1|G>>>31) + 1518500249) + ((B=A[1]) & (C=A[2]) | ~B & (D=A[3])),
        F = G + (B ^ C ^ D) + 341275144,
        G + (B & C | B & D | C & D) + 882459459,
        F + 1535694389
      ][0|i++/20] | 0, s, B<<30|B>>>2, C, D]
    ) {
      G = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    }
    for(i=5;i;) H[--i] = H[i] + A[i] | 0;
  }
  for(str1='';i<40;)str1 += (H[i>>3] >> (7-i++%8)*4 & 15).toString(16);
  return str1;
};

let spawn = (function () {
  // Declare ahead
  let promiseFromGenerator;
  // Returns true if aValue is a generator object.
  let isGenerator = aValue => {
    return Object.prototype.toString.call(aValue) === "[object Generator]";
  };
  // Converts the right-hand argument of yield or return values to a Promise,
  // according to Task.jsm semantics.
  let asPromise = yieldArgument => {
    if (yieldArgument instanceof Promise) {
      return yieldArgument;
    } else if (isGenerator(yieldArgument)) {
      return promiseFromGenerator(yieldArgument);
    } else if (yieldArgument instanceof Function) {
      return asPromise(yieldArgument());
    } else if (yieldArgument instanceof Error) {
      return Promise.reject(yieldArgument);
    } else if (yieldArgument instanceof Array) {
      return Promise.all(yieldArgument.map(asPromise));
    } else {
      return Promise.resolve(yieldArgument);
    }
  };
  // Takes a generator object and runs it as an asynchronous task,
  // returning a Promise with the result of that task.
  promiseFromGenerator = generator => {
    return new Promise((resolve, reject) => {
      let processPromise;
      let processPromiseResult = (success, result) => {
        try {
          let {value, done} = success ? generator.next(result)
                                    : generator.throw(result);
          if (done) {
            asPromise(value).then(resolve, reject);
          } else {
            processPromise(asPromise(value));
          }
        } catch (error) {
          reject(error);
        }
      };
      processPromise = promise => {
        promise.then(result => processPromiseResult(true, result),
                   error => processPromiseResult(false, error));
      };
      processPromise(asPromise(undefined));
    });
  };
  // __spawn(generatorFunction)__.
  return generatorFunction => promiseFromGenerator(generatorFunction());
})();
