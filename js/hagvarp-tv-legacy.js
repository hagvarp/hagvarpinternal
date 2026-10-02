(function () {
  'use strict';

  var DESIGN_W = 1240;
  var DESIGN_H = 700;
  var DEFAULT_MS = 50000;
  var RETRY_MS = 300;
  var MAX_WAIT_MS = 30000;
  var slides = [];
  var current = 0;
  var timer = null;
  var paused = false;
  var pending = {};
  var stage = null;

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    var list = (root || document).querySelectorAll(selector);
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) out.push(list[i]);
    return out;
  }

  function twoDigits(value) {
    value = String(value);
    return value.length < 2 ? '0' + value : value;
  }

  function addClass(el, name) {
    if (!el) return;
    if ((' ' + el.className + ' ').indexOf(' ' + name + ' ') < 0) {
      el.className += (el.className ? ' ' : '') + name;
    }
  }

  function removeClass(el, name) {
    if (!el) return;
    el.className = (' ' + el.className + ' ').replace(' ' + name + ' ', ' ').replace(/^\s+|\s+$/g, '');
  }

  function getStartIndex() {
    var m = String(window.location.hash || '').match(/#\/?(\d+)/);
    var n = m ? parseInt(m[1], 10) : 0;
    if (isNaN(n) || n < 0 || n >= slides.length) n = 0;
    return n;
  }

  function scaleStage() {
    var vw = window.innerWidth || document.documentElement.clientWidth || DESIGN_W;
    var vh = window.innerHeight || document.documentElement.clientHeight || DESIGN_H;
    var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    var left = Math.round((vw - DESIGN_W * scale) / 2);
    var top = Math.round((vh - DESIGN_H * scale) / 2);

    if (!stage) return;
    stage.style.width = DESIGN_W + 'px';
    stage.style.height = DESIGN_H + 'px';
    stage.style.left = left + 'px';
    stage.style.top = top + 'px';
    stage.style.webkitTransformOrigin = '0 0';
    stage.style.transformOrigin = '0 0';
    stage.style.webkitTransform = 'scale(' + scale + ')';
    stage.style.transform = 'scale(' + scale + ')';
  }

  function applyBackgrounds() {
    var i;
    var url;
    for (i = 0; i < slides.length; i++) {
      url = slides[i].getAttribute('data-background');
      if (url) {
        slides[i].style.backgroundImage = 'linear-gradient(rgba(0,20,34,.30),rgba(0,20,34,.30)), url("' + url.replace(/"/g, '%22') + '")';
        slides[i].style.backgroundSize = 'cover';
        slides[i].style.backgroundPosition = 'center center';
        slides[i].style.backgroundRepeat = 'no-repeat';
      }
    }
  }

  function dataVariableFor(fnName) {
    var match;
    if (!fnName) return null;
    match = fnName.match(/^startAnimatingChart(\d+b?)$/i);
    return match ? 'chart' + match[1] + 'Data' : null;
  }

  function chartContainerFor(fnName) {
    var match;
    if (!fnName) return null;
    match = fnName.match(/^startAnimatingChart(\d+b?)$/i);
    return match ? document.getElementById('chart' + match[1]) : null;
  }

  function clearStatus(container) {
    var shell;
    var status;
    if (!container || !container.parentNode) return;
    shell = container.parentNode;
    status = q('.hag-chart-status', shell);
    if (status && status.parentNode) status.parentNode.removeChild(status);
  }

  function showStatus(container, text) {
    var shell;
    var status;
    if (!container || !container.parentNode) return;
    shell = container.parentNode;
    status = q('.hag-chart-status', shell);
    if (!status) {
      status = document.createElement('div');
      status.className = 'hag-chart-status';
      shell.appendChild(status);
    }
    status.innerHTML = text;
  }

  function reflowSlide(slide) {
    var i;
    if (!slide || !window.Highcharts || !Highcharts.charts) return;
    window.setTimeout(function () {
      for (i = 0; i < Highcharts.charts.length; i++) {
        if (Highcharts.charts[i] && Highcharts.charts[i].renderTo && slide.contains(Highcharts.charts[i].renderTo)) {
          try { Highcharts.charts[i].reflow(); } catch (e) {}
        }
      }
    }, 80);
    window.setTimeout(function () {
      for (i = 0; i < Highcharts.charts.length; i++) {
        if (Highcharts.charts[i] && Highcharts.charts[i].renderTo && slide.contains(Highcharts.charts[i].renderTo)) {
          try { Highcharts.charts[i].reflow(); } catch (e2) {}
        }
      }
    }, 500);
  }

  function runChartWhenReady(slide) {
    var fnName = slide ? slide.getAttribute('data-chart') : null;
    var dataName;
    var container;
    var started;

    if (!fnName) {
      reflowSlide(slide);
      return;
    }

    dataName = dataVariableFor(fnName);
    container = chartContainerFor(fnName);
    started = new Date().getTime();

    if (pending[fnName]) {
      window.clearTimeout(pending[fnName]);
      pending[fnName] = null;
    }

    function attempt() {
      var fn;
      var ready;
      if (slides[current] !== slide) return;

      fn = window[fnName];
      ready = !dataName || (typeof window[dataName] !== 'undefined' && window[dataName] !== null);

      if (typeof fn === 'function' && ready) {
        clearStatus(container);
        try {
          fn();
          reflowSlide(slide);
        } catch (e) {
          if (window.console && console.error) console.error('Hagvarp chart failed', fnName, e);
          showStatus(container, 'Grafurin kundi ikki vísast.');
        }
        return;
      }

      if (new Date().getTime() - started >= MAX_WAIT_MS) {
        showStatus(container, 'Dáta kundu ikki lesast inn frá Hagstovuni.');
        return;
      }

      showStatus(container, 'Lesi dáta inn…');
      pending[fnName] = window.setTimeout(attempt, RETRY_MS);
    }

    attempt();
  }

  function updateChrome() {
    var bar = q('.hag-progress__bar');
    var meta = q('.hag-slide-meta');
    if (bar) bar.style.width = (((current + 1) / slides.length) * 100) + '%';
    if (meta) meta.innerHTML = twoDigits(current + 1) + ' / ' + twoDigits(slides.length);
  }

  function getDelay(slide) {
    var raw = slide ? slide.getAttribute('data-autoslide') : null;
    var value = raw ? parseInt(raw, 10) : DEFAULT_MS;
    return (!isNaN(value) && value > 0) ? value : DEFAULT_MS;
  }

  function schedule() {
    if (timer) window.clearTimeout(timer);
    timer = null;
    if (paused) return;
    timer = window.setTimeout(function () { next(); }, getDelay(slides[current]));
  }

  function show(index, userAction) {
    var i;
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    for (i = 0; i < slides.length; i++) {
      if (i === index) {
        addClass(slides[i], 'tv-present');
        removeClass(slides[i], 'tv-hidden');
        slides[i].style.visibility = 'visible';
        slides[i].style.opacity = '1';
        slides[i].style.zIndex = '2';
      } else {
        removeClass(slides[i], 'tv-present');
        addClass(slides[i], 'tv-hidden');
        slides[i].style.visibility = 'hidden';
        slides[i].style.opacity = '0';
        slides[i].style.zIndex = '1';
      }
    }

    current = index;
    updateChrome();
    try { window.location.hash = '#/' + current; } catch (e) {}
    runChartWhenReady(slides[current]);
    schedule();

    if (userAction && window.console && console.log) console.log('Hagvarp slide', current + 1, 'of', slides.length);
  }

  function next() { show(current + 1, true); }
  function prev() { show(current - 1, true); }

  function togglePause() {
    paused = !paused;
    var btn = document.getElementById('hag-tv-play');
    if (btn) btn.innerHTML = paused ? '&#9654;' : '&#10074;&#10074;';
    schedule();
  }

  function onKeyDown(e) {
    e = e || window.event;
    var code = e.keyCode || e.which;
    if (code === 37 || code === 427) { prev(); }
    else if (code === 39 || code === 428) { next(); }
    else if (code === 32 || code === 13) { togglePause(); }
    else return;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  function bindControls() {
    var prevBtn = document.getElementById('hag-tv-prev');
    var nextBtn = document.getElementById('hag-tv-next');
    var playBtn = document.getElementById('hag-tv-play');
    if (prevBtn) prevBtn.onclick = prev;
    if (nextBtn) nextBtn.onclick = next;
    if (playBtn) playBtn.onclick = togglePause;
    document.onkeydown = onKeyDown;
  }

  function showFatal(message) {
    var el = document.getElementById('hag-tv-diagnostic');
    if (!el) {
      el = document.createElement('div');
      el.id = 'hag-tv-diagnostic';
      document.body.appendChild(el);
    }
    el.innerHTML = '<strong>Hagvarp TV Legacy</strong><br>' + message;
    el.style.display = 'block';
  }

  function init() {
    stage = q('.slides');
    slides = qa('.slides > section');
    if (!stage || !slides.length) {
      showFatal('Eingin Hagvarp-síða varð funnin.');
      return;
    }
    if (!window.Highcharts) {
      showFatal('Highcharts kundi ikki lesast inn.');
      return;
    }

    addClass(document.documentElement, 'hag-tv-legacy');
    applyBackgrounds();
    scaleStage();
    bindControls();
    current = getStartIndex();
    show(current, false);
  }

  window.onerror = function (message, source, line) {
    if (window.console && console.error) console.error('Hagvarp TV Legacy error', message, source, line);
    return false;
  };

  if (window.addEventListener) {
    window.addEventListener('resize', function () { scaleStage(); reflowSlide(slides[current]); }, false);
    window.addEventListener('load', init, false);
  } else {
    window.attachEvent('onresize', function () { scaleStage(); reflowSlide(slides[current]); });
    window.attachEvent('onload', init);
  }
})();
