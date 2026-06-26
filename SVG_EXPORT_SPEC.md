# SVG Export Specification

Version: v1.1

This document defines the safe route for SVG export. SVG is a separate export feature. It must not become the renderer, fallback, or intermediate format for PNG, PDF, or direct print until it has passed parity validation.

## Production Export Rules

- PNG export stays on production Canvas rendering.
- PDF export stays on production Canvas rendering with `PDF_RENDER_SCALE = 6`, then embeds the bitmap into PDF.
- Direct print stays on the Canvas image print page.
- SVG export, SVG print, and SVG-to-PDF print are separate SVG products and must stay on the backend SVG route.
- `exportNamedSvg()`, `svgPrintPagesForScope()`, `directSvgPrint()`, and `exportSvgPdfViaPrint()` must not call production Canvas rendering, bitmap export, or `renderSheetSvg()` as a replacement route.
- The normal Canvas PDF and direct print routes must not call backend SVG as an intermediate format.

## SVG Route Isolation Rules

- SVG has its own route. Do not “fix” SVG by switching it to Canvas, bitmap, PDF, or normal print rendering.
- Canvas/PNG/PDF/direct print have their own route. Do not “fix” them by switching them to backend SVG.
- Shared data is allowed: parameters, pagination decisions, paper size, sheet layout, and drawing metadata.
- Shared rendering implementation is not allowed unless it is the drawing command backend itself.
- If SVG output is wrong, fix `drawing-backend-v1.js`, backend model builders, SVG paper sizing, SVG typography, or SVG print wrapping. Do not reroute SVG buttons to production Canvas/SVG shims.
- `renderSheetSvg()` is a production Canvas-like shim and is not the approved SVG export route.
- `renderBackendSheetSvg()` is the approved SVG export/print route.

## Architecture

- The stable SVG path must be generated from drawing commands, not from ad hoc DOM/string reconstruction.
- `drawing-backend-v1.js` owns the experimental command renderer.
- The command model must render to both Canvas and SVG from the same geometry.
- Production Canvas/PDF/print code must not be changed to accommodate SVG experiments.

## Drawing Command Requirements

Supported command types for the current plan backend:

- `line`
- `rect`
- `text`
- `arc`
- `path`
- `hatch`

Text commands must carry a `className` so typography can be tuned by role instead of with a global font-size change. Current required text classes:

- `note-tag`
- `booth-label`
- `no-door-label`
- `total-dimension`
- `booth-width-dimension`
- `depth-dimension`
- `front-chain-dimension`
- `sheet-page-number`

Where text is constrained by a measured dimension segment, include `maxWidth` and `fitMode: 'shrink'` metadata. Rendering may ignore this metadata until the fitting implementation is validated, but the metadata must exist for future parity work.

## Validation Gates

Before exposing SVG export, all of these checks must pass:

- `node --check drawing-backend-v1.js`
- Inline script parse check for `toilet_partition_auto_generator_V2Pro.html`
- `runSvgBackendScenarioMatrix()` returns stable results across the plan scenarios.
- Backend Canvas vs backend SVG mismatch remains very low.
- Backend output visually matches production Canvas for walls, doors, rebate boards, dimensions, labels, and page framing.
- PDF export still produces a real PDF and still uses `PDF_RENDER_SCALE = 6`.
- SVG export button is still hidden until the acceptance threshold is met.

## Current Status

SVG export is routed through the unified drawing backend for plan, front, and side sheets. Production PNG, PDF, and direct print still use Canvas and must remain independent from SVG.

Additional SVG print routes are allowed as separate commands:

- `SVG打印` opens a browser print page using inline SVG sheets.
- `SVG导出PDF` opens the same SVG print route so the browser can save/print to PDF.
- These routes must not replace Canvas `导出PDF` or Canvas `直接打印`.

The SVG button may be shown only while these conditions stay true:

- `runSvgBackendScenarioMatrix()` remains stable.
- PDF smoke tests still produce `%PDF-` with `PDF_RENDER_SCALE = 6`.
- Direct print still uses Canvas PNG pages.
- SVG print routes generate inline backend `<svg>` print pages.
- SVG output for current and all scopes starts with `<svg>` and includes the expected drawing commands.

## Regression Rule From 2026-06-26

A prior regression occurred when SVG export/print was changed from `renderBackendSheetSvg()` to `renderSheetSvg()`. That is forbidden. Future agents must preserve this invariant:

- `exportNamedSvg()` uses `renderBackendSheetSvg()`.
- `svgPrintPagesForScope()` uses `renderBackendSheetSvg()`.
- `directSvgPrint()` and `exportSvgPdfViaPrint()` consume pages produced by `svgPrintPagesForScope()`.
- Any change that replaces these calls with Canvas, PNG, `renderSheetCanvas()`, or `renderSheetSvg()` is a regression unless the user explicitly approves a new SVG architecture.
