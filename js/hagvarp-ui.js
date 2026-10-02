(function () {
  'use strict';

  var pendingTimers = {};
  var maxWaitMs = 30000;
  var retryMs = 300;

  function twoDigits(value) {
    value = String(value);
    return value.length < 2 ? '0' + value : value;
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

  function clearChartMessage(container) {
    var message;
    if (!container) return;
    message = container.parentNode && container.parentNode.querySelector('.hag-chart-status');
    if (message && message.parentNode) message.parentNode.removeChild(message);
  }

  function showChartMessage(container, message) {
    var shell;
    var status;
    if (!container || !container.parentNode) return;
    shell = container.parentNode;
    status = shell.querySelector('.hag-chart-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'hag-chart-status';
      shell.appendChild(status);
    }
    status.innerHTML = message;
  }

  function eachHighchart(callback) {
    var i;
    if (!window.Highcharts || !Highcharts.charts) return;
    for (i = 0; i < Highcharts.charts.length; i++) {
      if (Highcharts.charts[i]) callback(Highcharts.charts[i]);
    }
  }

  function reflowVisibleCharts(slide) {
    if (!slide || !window.Highcharts || !Highcharts.charts) return;

    window.setTimeout(function () {
      eachHighchart(function (chart) {
        if (!chart.renderTo || !slide.contains(chart.renderTo)) return;
        try { chart.reflow(); } catch (e) { console.warn('Hagvarp chart reflow failed', e); }
      });
    }, 100);

    window.setTimeout(function () {
      eachHighchart(function (chart) {
        if (!chart.renderTo || !slide.contains(chart.renderTo)) return;
        try { chart.reflow(); } catch (e) {}
      });
    }, 800);
  }

  function runChartWhenReady(slide) {
    var fnName;
    var fn;
    var dataName;
    var container;
    var started;

    if (!slide) return;
    fnName = slide.getAttribute('data-chart');
    if (!fnName) {
      reflowVisibleCharts(slide);
      return;
    }

    fn = window[fnName];
    dataName = dataVariableFor(fnName);
    container = chartContainerFor(fnName);
    started = Date.now();

    if (pendingTimers[fnName]) {
      window.clearTimeout(pendingTimers[fnName]);
      delete pendingTimers[fnName];
    }

    function attempt() {
      var dataReady;
      if (!window.Reveal || Reveal.getCurrentSlide() !== slide) return;

      fn = window[fnName];
      dataReady = !dataName || (typeof window[dataName] !== 'undefined' && window[dataName] !== null);

      if (typeof fn === 'function' && dataReady) {
        clearChartMessage(container);
        try {
          fn();
          reflowVisibleCharts(slide);
        } catch (error) {
          console.error('Hagvarp could not render ' + fnName, error);
          showChartMessage(container, 'Grafurin kundi ikki vísast.');
        }
        return;
      }

      if (Date.now() - started >= maxWaitMs) {
        console.error('Hagvarp timed out waiting for ' + fnName + (dataName ? ' / ' + dataName : ''));
        showChartMessage(container, 'Dáta kundu ikki lesast inn frá Hagstovuni.');
        return;
      }

      showChartMessage(container, 'Lesi dáta inn…');
      pendingTimers[fnName] = window.setTimeout(attempt, retryMs);
    }

    attempt();
  }

  function updateChrome(event) {
    var slide = event && event.currentSlide ? event.currentSlide : Reveal.getCurrentSlide();
    var indices = Reveal.getIndices(slide);
    var total = document.querySelectorAll('.reveal .slides > section:not([data-hidden])').length;
    var current = Math.min((indices.h || 0) + 1, total);
    var bar = document.querySelector('.hag-progress__bar');
    var meta = document.querySelector('.hag-slide-meta');
    if (bar) bar.style.width = ((current / total) * 100) + '%';
    if (meta) meta.innerHTML = twoDigits(current) + ' / ' + twoDigits(total);
  }

  function showFatal(message) {
    var el = document.getElementById('hag-tv-diagnostic');
    if (!el) {
      el = document.createElement('div');
      el.id = 'hag-tv-diagnostic';
      document.body.appendChild(el);
    }
    el.innerHTML = '<strong>Hagvarp</strong><br>' + message;
    el.style.display = 'block';
  }

  window.onerror = function (message, source, line) {
    console.error('Hagvarp startup error', message, source, line);
    if (!window.Reveal || !window.Highcharts) {
      showFatal('Ein tekniskur feilur kom fyri. ' + String(message || 'Ókendur feilur'));
    }
    return false;
  };

  if (!window.Highcharts) {
    showFatal('Highcharts kundi ikki lesast inn.');
    return;
  }
  if (!window.Reveal) {
    showFatal('Reveal kundi ikki lesast inn.');
    return;
  }

  try {
    Reveal.initialize({
      width: 1240,
      height: 700,
      margin: 0.04,
      minScale: 0.2,
      maxScale: 1.6,
      history: false,
      viewDistance: 1,
      transition: 'fade',
      transitionSpeed: 'default',
      backgroundTransition: 'fade',
      autoSlide: 50000,
      loop: true,
      controls: true,
      progress: false,
      keyboard: true,
      touch: true,
      dependencies: []
    });
  } catch (e) {
    showFatal('Framløgan kundi ikki starta: ' + String(e.message || e));
    return;
  }

  Reveal.addEventListener('ready', function (event) {
    updateChrome(event);
    runChartWhenReady(event.currentSlide);
  });

  Reveal.addEventListener('slidechanged', function (event) {
    updateChrome(event);
    runChartWhenReady(event.currentSlide);
  });

  window.addEventListener('resize', function () {
    reflowVisibleCharts(Reveal.getCurrentSlide());
  });
})();
