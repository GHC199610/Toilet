# Drawing View Spec

Version: 1.1

## Scope

This file defines what each drawing view must show and how views stay consistent. It does not define UI, calculation formulas, cut-list aggregation, or export route internals.

## Shared View Rules

- All views read from shared model data.
- No view may recalculate booth widths, door widths, gaps, or wall conditions independently.
- Plan, front elevation, side elevation, and detail/node drawings must keep view-specific code isolated.
- If a common helper must change, list affected views and verify each one.
- Units are millimeters unless explicitly stated otherwise.

Every production sheet must include:

- Drawing title.
- Project/group identifier when available.
- View name.
- Scale or fit note.
- Unit.
- Page number when paginated.

## Dimension Priority

Draw dimensions in this priority order:

1. Overall size.
2. Critical installation dimensions.
3. Booth widths/depth.
4. Door opening or door panel size.
5. Panel/body dimensions.
6. Special structure dimensions.

Avoid duplicate labels, overlapping text, and dimensions crossing primary geometry.

## Plan View

### Purpose

The plan view shows horizontal layout from above.

### Must Show

- Wall positions and wall connection state.
- Depth panels, front-edge panels, partitions, and door panels.
- Door swing arcs and swing direction.
- Booth labels.
- No-door booths when present.
- Special structures only when present in the model.

### Must Dimension

- Overall length.
- Overall depth to the depth panel outer end.
- Booth clear widths or booth sequence widths according to the active model.
- Door widths and door gaps.
- Edge/middle panel sizes when relevant.
- Special structure positions.

### Plan Prohibitions

- Do not draw elevation-only heights in the plan body.
- Do not include front-edge panel thickness inside depth dimension.
- Do not draw door arcs that cross walls/panels or contradict swing direction.
- Do not replace calculated geometry with visual equal spacing.

## Front Elevation

### Purpose

The front elevation shows the partition unfolded from the door operating side. It expresses width and height, not depth.

### Data Source

- Total front width equals plan total run.
- Booth widths come from calculated booth/model widths.
- Door panel width comes from calculated door body width.
- Door swing comes from the same field used by plan swing arcs.

### Must Show

- F.F.L. baseline as height zero.
- Top finish line or top rail line.
- Door panel outlines for every door booth.
- Fixed/front panels, visible panel seams, door gaps, and booth boundaries.
- Left/right wall or end closure when present in the model.
- Door tags such as `A1门`, `A2门`, `B1门`.
- Door swing indication inside each door panel.
- Hardware required by the active hardware profile: hinges, lock/handle, top rail, legs, etc.
- No-door indication for no-door booths.

### Must Dimension

- Overall front width at the top.
- Door panel widths or booth chain dimensions at the bottom.
- Upright/visible panel height.
- Door height when shown.
- Floor clearance when the drawing is used for installation.

### Front Elevation Prohibitions

- Do not write raw width/height numbers inside the door body.
- Do not use temporary labels such as `门1` or `门2`.
- Do not infer swing direction independently from plan data.
- Do not hardcode hardware type, count, or position in the view drawing function.
- Do not draw wall hatching unless wall data exists.
- Do not stretch or compress a booth for visual alignment.

## Side Elevation

### Purpose

The side elevation shows depth, height, panel thickness relationships, wall connection, floor clearance, and side installation conditions.

### Must Show

- Depth panel side outline.
- Front-edge panel side position.
- Door panel thickness relative to front-edge panel.
- Wall connection or bracket/channel relationship when present.
- F.F.L. and floor clearance.
- Top height/top rail when present.
- Special side structures only when present in the model.

### Must Dimension

- Depth-panel body depth.
- Panel/upright height.
- Door height if door is visible.
- Floor clearance.
- Wall connection or special structure offsets when present.

### Side Elevation Prohibitions

- Do not include front-edge panel thickness inside depth dimension.
- Do not reuse left side for right side if wall/structure data differs.
- Do not omit wall connection when the model contains it.

## Detail / Node Drawings

Detail drawings must be generated from hardware templates and model placements. They may show enlarged hardware, section, and installation dimensions, but must not invent unconfigured hardware.

Must show when applicable:

- Node circle/identifier.
- Leader line.
- Hardware name.
- Installation baseline such as F.F.L., hinge edge, lock edge, or wall baseline.
- Necessary dimensions only.

## View Consistency Gates

Before export, check:

- Plan total length equals front elevation total width.
- Plan booth labels equal front elevation labels.
- Plan door widths equal front elevation door widths.
- Plan depth equals side elevation depth.
- Front elevation height equals side elevation height where both show the same component.
- Door swing direction is consistent across plan, front elevation, and detail/node drawing.
- Panel and hardware identifiers match the cut list.

On failure, block export and show the specific mismatch.

## Output Order

Default output order:

1. Plan view pages.
2. Front elevation.
3. Side elevation.
4. Detail/node drawings when enabled.
5. Cut list.
