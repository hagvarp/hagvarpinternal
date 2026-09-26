# Hagvarp internal 2026 — layout fix

This build fixes the missing-chart layout issue seen with Reveal.js 3.3.0.

## Root cause
Reveal.js 3.x does not give horizontal `<section>` elements a full stage height.
The 2026 Hagvarp design uses absolutely positioned chapter and data panels, so the
section collapsed and the chart shell had effectively no usable height.

## Fix
- Every top-level Reveal slide now explicitly uses `height: 100%`.
- Data panels explicitly use `height: 100%`.
- The main Hagvarp CSS/JS references include a deployment version query to avoid stale browser/proxy caches.
- Existing Statbank lifecycle/error handling remains enabled.

After deployment, hard-refresh once with Ctrl+F5.
