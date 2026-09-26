# Hagvarp 2026 widescreen update

This version changes the Reveal design canvas from the legacy 960 x 700 ratio to 1240 x 700, which is effectively 16:9.

## Visual changes

- Reveal canvas: 1240 x 700
- Reveal margin reduced to 4% so Hagvarp uses modern widescreen displays more naturally
- Data panel widened to 1060 logical pixels
- Chart plotting area widened accordingly
- Chapter ribbons widened to match the new composition
- Existing 700px vertical rhythm retained so the working chart-height fix is preserved
- CSS/UI asset versions bumped to avoid stale IIS/browser cache

No Statbank queries or chart data transformations were changed.
