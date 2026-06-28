# Project Rules

Version: 1.2

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
- Do not expand a targeted drawing/UI request into unrelated cleanup, encoding repair, syntax repair, formatting, or refactoring.
- If verification exposes an unrelated historical problem, report it as unrelated risk and stop before fixing it unless the user approves that extra scope.
- Before restoring an earlier state, first list the target-state features that must be true, such as which buttons exist, which modules were removed, and which drawing behavior was already fixed.

## AI Edit Guardrails

These rules are mandatory for AI-assisted edits:

- Treat the user's current request as the hard boundary. For example, an elevation drawing request does not authorize plan-view, BOM, export, hardware-library, text-encoding, or global syntax changes.
- Never perform broad file rewrites on `toilet_partition_auto_generator_V2Pro.html` for a small behavior change.
- Do not use PowerShell full-file read/write commands to modify large HTML/JS files. Use `apply_patch` or a Node UTF-8 script with explicit function/marker boundaries.
- Inspect `git diff --stat` after every meaningful edit. If the diff is larger than the expected scope, stop and correct the scope before continuing.
- Do not keep stacking fixes after an unexpected diff explosion. Revert the unintended part first, then re-apply only the intended change.
- When asked to return to a previous working point, preserve all features that were already intentionally changed at that point. Do not blindly reset to remote/main unless the user explicitly asks for that.

## Front Elevation Rules

- Plan view is the relationship source of truth. Do not alter plan logic to fix elevation drawing expression.
- Elevation drawing may have independent presentation code, but it must read the same `compute(p)` relationship chain used by the plan view.
- Board heights must use their own real fields: `hUpright` for upright panels, `hDoor` for doors, `hMid` for middle partitions, and `hVis` for visible/fixed panels.
- Panel thickness expression must use `tPanel` after scaling, not an arbitrary decorative line offset.
- Middle partitions are expressed by their real height and real thickness. Do not add an extra center line that makes the front board look split.
- Door panels and upright panels are solid-line objects. Middle partition thickness may be shown as light blue dashed lines when needed.
- Dimension lines and labels must sit outside the main body with fixed paper-space offsets so they do not overlap the partition body.
- Canvas drawing and SVG/backend export must use the same elevation geometry and expression rules.

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
