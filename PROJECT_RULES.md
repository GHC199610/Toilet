# Project Rules

Version: 1.1

## Purpose

This project is a parameter-driven bathroom partition design and production drawing system. It turns user-entered dimensions and options into validated layouts, drawings, exports, and cut lists.

This file defines project-wide development rules. Domain, drawing, export, UI, and regression details live in their own specs.

## Source Of Truth

- Business dimensions come from the active project/group/row model, not from rendered DOM, Canvas pixels, SVG output, or temporary UI state.
- Computed geometry is produced once and reused by drawing, export, and cut-list code.
- A view may read shared models, but must not mutate the source data while rendering.

## Change Boundary Rules

- Start every change by identifying the exact user-visible behavior being changed.
- Prefer the smallest function or branch that owns that behavior.
- Do not modify public chains such as initialization, calculation, drawing dispatch, sheet layout, export, print, state restore, or cut-list generation unless the request requires it.
- If a public chain must change, document the reason, expected affected entrances, and regression checks.

## Cross-Module Impact Checklist

Before changing behavior, check whether the change can affect:

- Input/state collection
- Rule validation
- Dimension calculation
- Layout/pagination
- Drawing preview
- PNG/PDF/SVG export
- Direct print
- Cut list
- Mobile input behavior

If an item is unaffected, keep it untouched.

## Implementation Rules

- No hardcoded business dimensions when a project option, rule, or model field exists.
- No duplicate rule implementations across calculation, drawing, cut list, or export.
- No silent fallbacks that generate production-looking but incorrect output.
- Functions should stay focused. Split only when it reduces real coupling or matches an existing local pattern.
- Keep existing UI style and workflows unless the user explicitly requests a UI redesign.

## Verification Minimum

For any code change, run the most relevant available checks. At minimum:

- JavaScript syntax check for touched scripts or inline scripts.
- `git diff --check` for whitespace/conflict markers.
- One target-path verification matching the user's request.
- One non-target regression check when a shared function changed.

For export, print, drawing text editing, mobile input, pagination, or cut-list changes, follow `REGRESSION_PREVENTION_RULES.md`.

## Delivery Notes

Every completed change should state:

- Modified files and major functions.
- Behavior changed.
- Behavior intentionally left unchanged.
- Verification performed.
- Known unverified paths or residual risk.
