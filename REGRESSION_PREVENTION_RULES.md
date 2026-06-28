# Regression Prevention Rules

Version: 1.1

## Scope

Use this checklist for changes touching export, print, cut list, drawing rendering, drawing text editing, mobile keyboard behavior, hit testing, pagination, SVG, or sheet layout.

## Core Principles

- One source of truth: preview, export, print, and cut list must use the same business data.
- Entrance matrix: a feature usually has multiple buttons and device paths; list them before changing shared code.
- Route isolation: PNG/PDF/print/SVG have approved routes. Do not swap routes to make one output look correct.
- User-path verification: verify the same path a user clicks, not only a low-level helper.
- Explicit failure: unsupported export, blocked print, or failed download must surface a clear message or fallback.
- No unverified claims: do not say mobile/desktop/export is fixed unless that path was run.

## Export And Print Matrix

When changing export, print, rendering, sheet layout, or cut-list output, check the relevant paths:

| Area | Desktop | Mobile |
|---|---|---|
| PNG current view | Required if PNG touched | Required if mobile/export touched |
| PNG all views | Required if PNG/all touched | Required if mobile/export touched |
| PDF current view | Required if PDF touched | Required if mobile/export touched |
| PDF all views | Required if PDF/all touched | Required if mobile/export touched |
| Cut-list PNG | Required if cut list touched | Required if mobile/export touched |
| Cut-list PDF/print | Required if cut list touched | Required if mobile/export touched |
| SVG current/all | Required if SVG touched | Required if SVG is visible on mobile |
| SVG print / SVG PDF | Required if SVG print touched | Required if SVG is visible on mobile |

SVG must also follow `SVG_EXPORT_SPEC.md`.

## Cut-List Rules

- Use the same cut-list data for screen, PNG, PDF, print, and drawings that include the cut list.
- Use the term “开料清单”; do not reintroduce “材料清单” in user-facing output unless the user asks.
- Export fallbacks must use the current cut-list structure, not an old text layout.
- Item type, process prefix, size, height, and quantity must match screen output.

## Drawing Text And Editing Rules

- Title text must stay inside the title box and drawing boundary.
- Title supports at most two lines unless the UI explicitly changes this rule.
- If text cannot fit, shrink to the defined minimum, then truncate with ellipsis.
- Red tags, title, dimensions, and editable labels must be editable on both desktop and mobile where those features are exposed.
- Hit areas used to position editors must come from the latest redraw.
- Event interception must target only the intended object and not swallow unrelated clicks/double-clicks.

## Mobile Input Rules

- The active editor must remain visible when the soft keyboard opens.
- Blank-area tap may close the keyboard but must not discard valid edits.
- A mobile fix must not break desktop click, double-click, enter, blur, or selection behavior.

## Pagination And Scale Rules

- Plan pagination is owned by sheet pagination logic; export must not invent a different page count.
- Current-view plan export includes all current plan pages according to product behavior.
- Front/side/detail current-view export includes only that view unless the user requests all views.
- Normal PDF should output one drawing page per PDF page.
- Export scale must be bounded for mobile memory.
- Do not leave a blank final print page due to unconditional page breaks.

## Required Pre-Read For Related Changes

Before touching these areas, search/read equivalent functions:

- PNG export: `exportNamedImage`, `exportNamedAllImages`, `downloadCanvasPng`.
- PDF export: `exportNamedPdf`, PDF canvas generation, iframe/window print helpers.
- SVG: `exportNamedSvg`, `renderBackendSheetSvg`, `svgPrintPagesForScope`, `directSvgPrint`, `exportSvgPdfViaPrint`, `drawing-backend-v1.js`.
- Cut list: render, format, Canvas, PNG, PDF, and print functions for the cut list.
- Drawing render: `renderSheetCanvas`, sheet layout, plan pagination, backend model builders.
- Text/dimension editing: editor focus, editor position, hit area generation, commit/blur handlers.

## Minimum Verification

For a relevant change, run:

- Syntax check for touched JS.
- `git diff --check`.
- Target user path.
- One adjacent non-target path when shared code changed.
- Desktop and mobile checks when mobile behavior or responsive output changed.

If browser/device verification was not possible, say exactly which paths were not verified.

## Delivery Statement

Report:

- Entrances affected.
- Entrances intentionally untouched.
- Checks run.
- Checks not run.
- Any needed real-device verification.
