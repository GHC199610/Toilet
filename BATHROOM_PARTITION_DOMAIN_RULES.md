# Bathroom Partition Domain Rules

Version: 1.1

## Scope

This file defines bathroom partition business rules. It does not define UI, drawing implementation, export implementation, or storage.

## Design Priorities

Resolve design decisions in this order:

1. Usability: each booth must remain usable.
2. Installability: dimensions must be physically buildable with gaps, walls, and hardware.
3. Rule compliance: minimum widths/depths and collision rules must pass.
4. Material efficiency: reduce waste and nonstandard cuts after the layout is valid.
5. Visual consistency: align panels and seams when it does not violate higher priorities.

Do not choose equal distribution over usability or installation constraints.

## Default Parameters

| Item | Default / Rule |
|---|---|
| Door gap | 6 mm default, configurable |
| Floor clearance | 6-10 mm default range, configurable |
| Minimum usable booth clear width | 700 mm |
| Recommended clear width | 900 mm |
| Comfortable clear width | 1000 mm |
| Premium clear width | 1100 mm |
| Minimum depth warning threshold | 800 mm |
| Standard depth | 1220 mm |
| Comfortable depth | 1400 mm |
| Premium depth | 1500 mm |

When clear width is below 700 mm, the layout is invalid and the user should be told to reduce booth count or increase total length.

## Door Rules

- Door width participates in net-width calculation, collision detection, drawing, and cut-list generation.
- Door gaps participate in total length closure and door-opening clearance.
- Door header board height and the gap between the header board and door panel are independent row parameters.
- Door swing values must support at least: left-in, right-in, left-out, right-out.
- Door collision checks must consider door-to-door, door-to-wall, door-to-column, and door-to-equipment conflicts when those structures exist in the model.
- No-door booths must remain explicit in the model and must not be inferred from a zero door width.

## Depth Rules

- Booth depth means depth-panel body depth only.
- Front-edge panel thickness is outside the depth dimension.
- Door panel thickness follows the front-edge panel outside baseline.
- Depth below 800 mm must generate a warning or invalid state according to the active validation mode.
- Side elevation depth must match plan depth exactly.

## Height Rules

- Visible-board height may default-sync from upright height, but users can edit it independently.
- Door header board placement uses door height, door header board height, and the configured header-door gap.

## Rebate Rules

- Rebate doors keep two coordinate systems: big-face body dimensions and small-face installation dimensions.
- Door gaps and opening occupancy use small-face installation dimensions.
- Door body outline and cut-list body size use big-face dimensions.
- Big-face/small-face orientation follows the actual swing direction.
- Material cut-list may report big-face dimensions but must not feed them back into gap or installation calculations.

## Wall And Structure Rules

Supported wall conditions:

- Left wall
- Right wall
- Back wall
- Two-side wall
- Three-side wall
- L-shaped wall
- U-shaped wall
- Irregular wall

The model may later include columns, pipes, equipment, or irregular zones. If these are not present in the model, drawing and calculation code must not invent them.

## Batch Editing Rules

- Total length is structurally tied to booth count.
- If a batch selection contains rows with different booth counts, total length must not be batch-applied.
- Batch editing must use a field whitelist. One user action may only write the field being edited, or an explicitly grouped field set such as door gap plus rebate depth.
- Batch selection alone must not save form state, rebuild layout, or refresh cut lists.

## Width Distribution Rules

Dimension allocation must satisfy:

1. Minimum clear width.
2. Door width and door gap.
3. Edge and middle panel reserves.
4. Locked dimensions.
5. Deterministic distribution of remaining space.

## Standard Board Sizes

The board size library must be configurable. Initial supported sizes:

- 1220 x 1830
- 1220 x 2440
- 1220 x 3050
- 1525 x 3050
- 1830 x 2440
- 1830 x 3660

Material optimization should reduce:

- Waste rate.
- Irregular cuts.
- Nonstandard sizes.
- Unnecessary splices.

## Required Validation Categories

- Net width too small.
- Depth too small.
- Door collision.
- Wall/structure conflict.
- Locked dimension conflict.
- Missing required hardware where a drawing requires it.

Validation failures must be explicit and actionable.
