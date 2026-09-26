# Hagvarp 2026 – internal/test version

This version keeps the original Hagvarp concept (full-screen photography + live Hagstova statistics) but modernises the presentation and separates the code into maintainable pieces.

## Visual direction
- Hagstova blue remains the dominant identity colour.
- Full-bleed photography remains the visual anchor.
- Chapter slides use a flat Hagstova-blue broadcast ribbon rather than business-style cards.
- Data slides use one strong editorial data field anchored to the edge of the screen.
- Charts use low-noise axes/gridlines, restrained animation and stronger latest-value emphasis.
- The design deliberately avoids KPI tiles, dashboard cards and PowerPoint-style layouts.

## Structure
- `index.html` – presentation markup only.
- `index.legacy.html` – untouched original internal Hagvarp.
- `css/hagvarp-modern.css` – 2026 visual system.
- `js/hagvarp-charts.js` – Statbank/Highcharts chart code.
- `js/hagvarp-chart-theme.js` – shared chart styling.
- `js/hagvarp-ui.js` – Reveal navigation, slide counter and chart triggers.
- `js/hagvarp-calendar.js` – internal publication calendar integration.
- `utm.regions.geo.json` – map data loaded with a relative URL.

## Important fixes retained
- The unemployment map is triggered independently from the normal unemployment chart.
- CPI supports the newer `period`-based Statbank structure (`YYYYMmm`/quarter periods) instead of assuming a separate `year` dimension.
- The project uses relative asset paths and works when hosted from a subdirectory.

## Hosting
The application is static. It does not require Python, Node, PHP or a build step on the server.

Serve the folder over HTTP/HTTPS on the internal test site or production site. Opening `index.html` directly with `file://` is not a supported deployment method because browsers restrict local AJAX/JSON requests.
