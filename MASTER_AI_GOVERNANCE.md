# AI Governance And Change Discipline

Version: 1.1

## Priority

This file defines project-level behavior constraints for AI-assisted changes. If it conflicts with a quick implementation idea, this file wins unless the user explicitly approves the risk.

## Non-Negotiable Rules

- Do not freely refactor architecture.
- Do not replace engine boundaries or create parallel systems.
- Do not change unrelated UI, style, calculation, drawing, cut-list, or export behavior.
- Do not invent missing data. Return an explicit error or warning.
- Do not silently repair invalid production data.
- Do not guess about code behavior. Inspect the actual code and relevant specs before designing, changing, validating, or answering.
- Do not leave UI preview and backend/export paths inconsistent for the same user-requested behavior.
- Do not claim completion without verification evidence.

## Frozen Boundaries

Treat these as protected unless the user requests otherwise:

- Rule/domain logic.
- Calculation engine.
- Layout and pagination.
- Drawing dispatch and view-specific renderers.
- Cut-list generation.
- Export and print routes.
- State save/load and project persistence.

## Required Workflow

### 1. Freeze The Request

Identify:

- User's exact goal.
- Target behavior.
- What is out of scope.
- Target view/export/device if applicable.

### 2. Locate The Owner

Before editing, identify:

- Function(s) owning the behavior.
- Data source feeding those functions.
- Rendering/export path consuming the result.
- Shared helpers that would be risky to touch.
- Any paired UI/backend/export implementation paths that must remain identical for the requested behavior.

### 3. Impact Matrix

Check possible impact on:

- Input/state.
- Calculation.
- Layout/pagination.
- Drawing preview.
- PNG/PDF/SVG export.
- Direct print.
- Cut list.
- Mobile interaction.

### 4. Minimal Change

- Prefer targeted branch logic over broad rewrites.
- Add explicit conditions for special cases.
- Keep non-target branches on their original path.
- Do not “clean up” unrelated code while fixing a bug.

### 5. Verify

Run checks appropriate to the touched surface. Required for most code edits:

- Syntax check.
- Diff check.
- Target behavior check.
- UI/backend/export consistency check when the behavior appears in more than one path.
- Non-target regression check when shared code changed.

## Error Shape

When adding explicit errors, use a structure compatible with:

```js
{
  error_code: 'MISSING_GEOMETRY',
  error_message: 'Required geometry was not available.',
  affected_module: 'drawing',
  suggestion: 'Recalculate the row or fix the missing input.'
}
```

## UI Discipline

- Keep existing structure, interaction, and style unless the user asks to change them.
- Necessary UI changes must be limited to the behavior being implemented.
- Deleting a UI entrance requires checking whether its function is still used by initialization, drawing, cut list, export, save/load, or automation.

## Branch And Mode Isolation

When changing a mode-specific path, explicitly protect other modes:

- Landscape vs portrait.
- A4 vs A3.
- Plan vs front vs side vs detail view.
- Preview vs export vs print.
- Desktop vs mobile.
- Normal layout vs auto-packed layout.
- Single selection vs multi-selection.

## Delivery Format

Finish with:

- Modified files.
- Modified functions or modules.
- Scope intentionally not changed.
- Verification results.
- Residual risk or unverified paths.
