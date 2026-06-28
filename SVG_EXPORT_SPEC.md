# SVG Export Spec

Version: 1.2

## Scope

SVG export is an independent backend drawing-command route. It must not replace, wrap, or silently become the production Canvas, PNG, PDF, or direct-print route.

## Route Ownership

| Output | Approved route |
|---|---|
| Canvas preview | Production Canvas drawing |
| PNG export | Production Canvas drawing at export scale |
| Normal PDF export | Production Canvas bitmap embedded into PDF |
| Direct print | Canvas image print page |
| SVG export | Backend `DrawingModel` → `renderBackendSheetSvg()` |
| SVG print / browser save as PDF | Backend SVG pages from `svgPrintPagesForScope()` |

`renderSheetSvg()` is a Canvas-like shim and is not the approved SVG export route.

## Isolation Rules

- Do not fix SVG by switching it to Canvas, PNG, normal PDF, or direct print.
- Do not fix Canvas/PNG/PDF/print by switching them to backend SVG.
- Shared inputs are allowed: project parameters, pagination, paper size, layout metadata, and drawing models.
- Shared rendering implementation is allowed only through the drawing-command backend.

## Backend Requirements

SVG must be generated from drawing commands, not from ad hoc DOM or Canvas string reconstruction.

The current command backend supports:

- `line`
- `rect`
- `text`
- `arc`
- `path`
- `hatch`

Text commands must include role/class metadata when the text participates in typography or regression checks. Dimension text constrained by a segment should include:

```js
{
  className: 'front-door-width-dimension',
  maxWidth: 120,
  fitMode: 'shrink'
}
```

## Required Invariants

These calls must remain true unless the user explicitly approves a new SVG architecture:

- `exportNamedSvg()` uses `renderBackendSheetSvg()`.
- `svgPrintPagesForScope()` uses `renderBackendSheetSvg()`.
- `directSvgPrint()` consumes pages from `svgPrintPagesForScope()`.
- `exportSvgPdfViaPrint()` consumes pages from `svgPrintPagesForScope()`.
- Normal PNG/PDF/direct print must not call backend SVG as an intermediate format.

## Validation Gates

Before exposing or changing SVG behavior, run or document why unavailable:

- `node --check drawing-backend-v1.js`
- Inline script parse check for `toilet_partition_auto_generator_V2Pro.html`
- Scenario matrix such as `runSvgBackendScenarioMatrix()` when available
- Backend Canvas vs backend SVG parity check
- Production Canvas vs backend output spot check for walls, panels, doors, dimensions, labels, hatches, and page frame
- Normal PDF smoke test still produces `%PDF-` and preserves `PDF_RENDER_SCALE = 6`
- SVG export output starts with `<svg` and contains expected command-derived elements

## Regression History

A known regression occurred when SVG export/print was changed from `renderBackendSheetSvg()` to `renderSheetSvg()`. That replacement is forbidden. If SVG output is wrong, fix one of:

- `drawing-backend-v1.js`
- Backend model builders
- SVG paper sizing
- SVG typography
- SVG print wrapping

Do not reroute buttons to Canvas or shim SVG output.
