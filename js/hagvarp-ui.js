(function () {
  'use strict';

  var pendingTimers = {};
  var maxWaitMs = 30000;
  var retryMs = 300;

  function dataVariableFor(fnName) {
    if (!fnName) return null;
    var match = fnName.match(/^startAnimatingChart(\d+b?)$/i);
    return match ? 'chart' + match[1] + 'Data' : null;
  }

  function chartContainerFor(fnName) {
    if (!fnName) return null;
    var match = fnName.match(/^startAnimatingChart(\d+b?)$/i);
    return match ? document.getElementById('chart' + match[1]) : null;
  }

  function clearChartMessage(container) {
    if (!container) return;
    var message = container.parentNode && container.parentNode.querySelector('.hag-chart-status');
    if (message) message.remove();
  }

  function showChartMessage(container, message) {
    if (!container || !container.parentNode) return;
    var shell = container.parentNode;
    var status = shell.querySelector('.hag-chart-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'hag-chart-status';
      shell.appendChild(status);
    }
    status.textContent = message;
  }

  function reflowVisibleCharts(slide) {
    if (!slide || !window.Highcharts || !Highcharts.charts) return;
    window.setTimeout(function () {
      Highcharts.charts.forEach(function (chart) {
        if (!chart || !chart.renderTo || !slide.contains(chart.renderTo)) return;
        try { chart.reflow(); } catch (e) { console.warn('Hagvarp chart reflow failed', e); }
      });
    }, 80);
    window.setTimeout(function () {
      Highcharts.charts.forEach(function (chart) {
        if (!chart || !chart.renderTo || !slide.contains(chart.renderTo)) return;
        try { chart.reflow(); } catch (e) { /* already reported above */ }
      });
    }, 650);
  }

  function runChartWhenReady(slide) {
    if (!slide) return;

    var fnName = slide.getAttribute('data-chart');
    if (!fnName) return;

    var fn = window[fnName];
    var dataName = dataVariableFor(fnName);
    var container = chartContainerFor(fnName);
    var started = Date.now();

    if (pendingTimers[fnName]) {
      window.clearTimeout(pendingTimers[fnName]);
      delete pendingTimers[fnName];
    }

    function attempt() {
      if (Reveal.getCurrentSlide() !== slide) return;

      fn = window[fnName];
      var dataReady = !dataName || typeof window[dataName] !== 'undefined' && window[dataName] !== null;

      if (typeof fn === 'function' && dataReady) {
        clearChartMessage(container);
        try {
          fn();
          reflowVisibleCharts(slide);
        } catch (error) {
          console.error('Hagvarp could not render ' + fnName, error);
          showChartMessage(container, 'Grafurin kundi ikki vísast. Hygg í konsollina fyri fleiri upplýsingar.');
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
    if (meta) meta.textContent = String(current).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  }

  Reveal.initialize({
    width: 1240,
    height: 700,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 1.6,
    history: true,
    viewDistance: 2,
    transition: 'fade',
    transitionSpeed: 'slow',
    backgroundTransition: 'fade',
    autoSlide: 50000,
    loop: true,
    controls: true,
    progress: false,
    dependencies: [
      { src: 'plugin/notes/notes.js', async: true },
      { src: 'plugin/highlight/highlight.js', async: true, callback: function () { if (window.hljs) hljs.initHighlightingOnLoad(); } }
    ]
  });

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
