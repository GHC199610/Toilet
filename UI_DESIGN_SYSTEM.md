# UI Design System

Version: 1.1

## Design Goals

The UI should feel professional, compact, stable, and engineering-oriented. It should help users enter parameters, inspect drawings, edit key labels/dimensions, and export production output without decorative complexity.

## Visual Principles

- Follow existing layout, colors, spacing, and typography unless a requested feature requires a change.
- Avoid decorative animation, heavy gradients, and ornamental elements.
- Keep operational controls dense but readable.
- Use consistent component sizing inside the sidebar and tool panels.

## Typography

Use the existing font stack:

```css
font-family: 'Microsoft YaHei', Arial, sans-serif;
```

Current key variables:

- `--sidebar-content-font`: sidebar labels, inputs, button text, hints, card text.
- `--control-gap`: peer control spacing.
- `--field-gap`: field vertical spacing.
- `--compact-gap`: dense internal spacing.

Rules:

- Sidebar content text uses the shared variable unless there is a clear hierarchy reason.
- Section titles may use independent sizing but must not create empty reserved space when hidden/removed.
- Button text, input text, hints, and card text in the same functional area should not have visibly inconsistent sizes.

## Layout

Primary areas:

- Sidebar parameter/input area.
- View tabs and drawing canvas area.
- Cut-list area.
- Export/action area.
- Temporary panels for focused editing.

Layout rules:

- Keep drawing as the primary work surface.
- Do not add landing-page or marketing-style sections.
- Moving a UI entrance may move its container, but must preserve original binding, data field, and submit logic.
- Remove stale hints when removing or moving an entrance.

## Controls

- Numeric values use inputs/steppers where already established.
- Binary settings use checkbox/toggle patterns already present.
- View selection uses tabs.
- Tool actions use icon buttons where available and clear text buttons where the command is textual/export-related.
- Dangerous or destructive actions use the established danger color.

## Cut-List Display

- User-facing term: “开料清单”.
- Process prefix, size, height, and quantity should align as stable columns or column-like groups.
- Do not let process labels such as single/double rebate squeeze size columns.
- Show complete size information the first time a board/process group appears.
- Repeated height may be omitted only for consecutive items in the same board/process group.
- Use `1830 x 205` style spacing around the multiplication mark in display text where practical.

## Quick Layout Rules

- “Select all” is a selection-state change only.
- Selecting all must not rebuild layout, submit form state, redraw due to data mutation, or refresh cut list by itself.
- Batch editing uses a field whitelist.
- A batch operation may only update the field the user operated, or an explicitly grouped field set.
- If selected rows have different booth counts, total length must not batch-apply and must show a warning.

## Drawing Selection Rules

- Shift-click toggles multi-selection and preserves the clicked object's normal panel-opening behavior.
- Normal click exits multi-selection and activates the clicked object.
- Multi-select must not submit forms, rebuild layout, or recalculate materials by itself.

## Text Fit Rules

- UI text must not overflow buttons, cards, tabs, labels, or title blocks.
- Prefer wrapping in content areas and shrink/truncate only where layout is fixed.
- Drawing title and labels must stay inside their assigned drawing areas.

## Responsive Rules

- Mobile layout must keep active inputs/editors visible when the keyboard opens.
- Desktop behavior must not regress when mobile input behavior is fixed.
- Export actions should provide explicit feedback when browser popup/download restrictions apply.
