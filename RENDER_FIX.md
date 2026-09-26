# Hagvarp render fix

The previous layout used percentage heights for Reveal.js sections. Reveal 3.x also writes inline `top` offsets to vertically centre slides. Together those caused `.chart-shell` to resolve to 0px height even though Highcharts successfully rendered an SVG inside it.

This build:
- pins every top-level Reveal slide to `top: 0 !important`
- uses the native Hagvarp/Reveal design stage size of 960x700
- gives data panels an explicit 700px height
- gives chart shells an explicit 513px height
- bumps CSS/JS cache keys

Expected DevTools dimensions on a data slide:
- section: 960 x 700
- data-panel: about 605-760 x 700 depending on viewport scaling
- chart-shell: non-zero height, approximately 513px before Reveal scaling
