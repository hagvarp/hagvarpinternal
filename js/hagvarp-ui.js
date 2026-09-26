(function () {
  'use strict';

  function runChartAnimation(slide) {
    if (!slide) return;
    var fnName = slide.getAttribute('data-chart');
    if (fnName && typeof window[fnName] === 'function') window[fnName]();
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
    runChartAnimation(event.currentSlide);
  });

  Reveal.addEventListener('slidechanged', function (event) {
    updateChrome(event);
    runChartAnimation(event.currentSlide);
  });
})();
