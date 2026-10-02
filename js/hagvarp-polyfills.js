/* Hagvarp Samsung/Tizen compatibility helpers.
 * Intentionally ES5 syntax for older Smart TV browser engines.
 */
(function () {
  'use strict';

  if (!window.console) {
    window.console = { log: function(){}, warn: function(){}, error: function(){} };
  } else {
    if (!window.console.log) window.console.log = function(){};
    if (!window.console.warn) window.console.warn = function(){};
    if (!window.console.error) window.console.error = function(){};
  }

  if (!Date.now) {
    Date.now = function () { return new Date().getTime(); };
  }

  if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
      var value = String(this);
      var target = targetLength >> 0;
      var pad = String(padString !== undefined ? padString : ' ');
      if (value.length >= target) return value;
      target = target - value.length;
      while (pad.length < target) pad += pad;
      return pad.slice(0, target) + value;
    };
  }

  if (window.Element && !Element.prototype.remove) {
    Element.prototype.remove = function () {
      if (this.parentNode) this.parentNode.removeChild(this);
    };
  }

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      var i;
      for (i = 0; i < this.length; i++) callback.call(thisArg, this[i], i, this);
    };
  }

  var ua = navigator.userAgent || '';
  var isSamsung = /SMART-TV|Tizen|SamsungBrowser/i.test(ua);
  if (isSamsung) {
    document.documentElement.className += ' samsung-tv';
  }
})();
