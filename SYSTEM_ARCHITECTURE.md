# System Architecture

Version: 1.1

## System Role

The application is a client-side engineering design system for bathroom partitions. Its core job is to keep user inputs, calculated geometry, drawings, exports, and cut lists consistent.

## Layer Responsibilities

| Layer | Owns | Must Not Own |
|---|---|---|
| UI | Controls, selection, editing, user feedback | Business calculation, export-specific rendering |
| Application | Workflow orchestration, save/load, command routing | Geometry formulas, drawing primitives |
| Domain | Industry rules, constraints, defaults | DOM, Canvas, SVG, print code |
| Calculation | Numeric geometry and validation outputs | Drawing layout, UI styling, cut-list presentation |
| Drawing | Drawing models and view-specific representation | Recalculating business dimensions |
| Export | PNG/PDF/SVG/print packaging | Changing geometry or business rules |
| Cut List | Material/cut-list aggregation from models | Recomputing layout or dimensions |

## Approved Data Flow

```text
UI input
→ validation
→ domain rules
→ calculation
→ layout/pagination
→ drawing model
→ export / print / cut list
```

Rendering functions may read model data. They must not write back to calculation or rule state.

## Core Models

Use the smallest model needed, but keep ownership clear:

- `ProjectModel`: project metadata, global options, defaults.
- `GroupModel`: a partition group and its row list.
- `RowModel`: one row of partition input and per-booth overrides.
- `GeometryModel`: calculated widths, gaps, walls, depth panels, doors.
- `LayoutModel`: sheet/page placement decisions.
- `DrawingModel`: backend drawing commands for SVG/Canvas parity.
- `CutListModel`: production cut-list items and quantities.
- `HardwareProfile`: selected hardware by project/group/booth.

## Engine Boundaries

- Calculation engine outputs geometry; it does not draw.
- Drawing engine consumes geometry/layout; it does not fix invalid dimensions.
- Export engine packages an already-renderable drawing; it does not choose dimensions.
- Hardware library provides templates and placements; view code should not define hardware types inline.

## Shared Utility Risk

Treat these as high-risk public chains:

- State save/restore and `getParams()`-style collection.
- `compute()` or equivalent dimension calculation.
- Drawing dispatch and sheet layout.
- PNG/PDF/SVG export and direct print.
- Cut-list generation and formatting.
- Canvas hit areas and inline text/dimension editing.

Any change here needs explicit regression checks.

## Performance Targets

- Typical UI interaction: under 100 ms after input where practical.
- 100-booth calculation: under 1 second.
- 100-booth drawing/export preparation: under 3 seconds, excluding browser file saving.
- Export scaling must be bounded to avoid mobile memory crashes.
