# Hardware Library Spec

Version: 1.1

## Scope

This file defines hardware profiles, hardware templates, placement rules, node identifiers, drawing display, downgrade behavior, and cut-list linkage.

## Core Rule

Hardware and nodes are data-driven. Drawing code must call hardware-library interfaces or consume hardware placement data. It must not define hardware types, counts, or installation dimensions inline.

## Hardware Profile Precedence

Resolve hardware in this order:

1. Booth-level profile.
2. Row/group-level profile.
3. Project-level default profile.
4. System default profile.

A value of `none` is an explicit selection and must not fall through to a lower level.

## Default Profile

```js
hardwareProfile: {
  hinge: 'standard-hinge',
  lock: 'indicator-lock',
  handle: 'none',
  hook: 'standard-hook',
  leg: 'adjustable-leg',
  topRail: 'aluminum-tie-rod',
  bracket: 'angle-bracket',
  bumper: 'none'
}
```

## Profile Fields

| Field | Meaning |
|---|---|
| `hinge` | Hinge or pivot hardware |
| `lock` | Lock/latch hardware |
| `handle` | Pull/handle hardware |
| `hook` | Coat hook |
| `leg` | Floor support |
| `topRail` | Top rail/tie rod |
| `bracket` | Wall bracket/channel |
| `bumper` | Door stop/limiter/buffer |

## Supported Categories

| Category | Supported IDs |
|---|---|
| Hinge | `standard-hinge`, `long-hinge`, `concealed-hinge`, `pivot-hinge`, `none` |
| Lock | `indicator-lock`, `latch-lock`, `deadbolt-lock`, `magnetic-lock`, `slide-bolt`, `none` |
| Handle | `round-handle`, `bar-handle`, `recessed-pull`, `accessible-pull`, `none` |
| Hook | `standard-hook`, `double-hook`, `none` |
| Leg | `adjustable-leg`, `stainless-leg`, `concealed-leg`, `floor-channel`, `none` |
| Top rail | `aluminum-tie-rod`, `stainless-tie-rod`, `top-rail`, `none` |
| Bracket | `angle-bracket`, `wall-bracket`, `u-channel`, `none` |
| Bumper | `door-stop`, `soft-buffer`, `none` |

## Template Shape

Each hardware template must provide enough data for drawing, nodes, and cut-list aggregation:

```js
{
  id: 'indicator-lock',
  name: '指示锁',
  category: 'lock',
  material: '304 stainless steel',
  defaultColor: 'black',
  defaultQtyRule: 'per-door',
  elevationSymbol: 'lock-rect',
  detailNode: true,
  bom: true,
  install: {
    heightFromFFL: 1000,
    offsetFromDoorEdge: 150
  }
}
```

## Placement Baselines

Allowed placement references:

- F.F.L.
- Door bottom edge.
- Door top edge.
- Hinge edge.
- Lock edge.
- Wall baseline.
- Panel centerline.
- Top rail centerline.

Do not place hardware using fixed Canvas or SVG coordinates.

## Swing Linkage

- Left-opening door: hinges on the left; lock/handle on the right.
- Right-opening door: hinges on the right; lock/handle on the left.
- In/out swing must change the front-elevation swing mark and any node drawing direction that shows swing.
- Hinges and lock/handle may appear on the same side only if a template explicitly allows it.

## Node Numbering

Node identifiers are generated from the active profile. Default stable identifiers:

| Node | Category |
|---|---|
| D1 | Lock |
| D2 | Hook |
| D3 | Wall bracket/channel |
| D4 | Leg/floor support |
| D5 | Hinge |
| D6 | Top rail |
| D7 | Handle |
| D8 | Door stop/bumper |

If a category is `none`, omit that node. Standard numbering may skip missing nodes; if a project chooses renumbering, it must be consistent across all views and cut lists.

## Drawing Requirements

Front elevation shows:

- Door outline.
- Panel seams.
- Hinge symbol when configured.
- Lock or handle symbol when configured.
- Door swing mark.
- Door identifier.
- Required width/height dimensions.

Door panel detail shows:

- Door outline.
- Door identifier.
- Door width and height.
- Hinge positioning.
- Lock/handle positioning.
- F.F.L. baseline.

Node drawings show:

- Node circle and leader.
- Hardware name.
- Installation baseline.
- Required dimensions.

## Cut-List Linkage

Cut-list hardware quantities come from active profiles and templates:

- Hinges: per template rule, commonly 3 per door.
- Locks: commonly 1 set per door when configured.
- Hooks: per template rule.
- Legs: per upright/panel rule.
- Top rail: by length or set rule.

The cut list and drawings must agree: no hardware may appear in one and disappear from the other.

## Downgrade Rules

When a configured template is missing:

- Drawing must not crash.
- Draw a simplified placeholder only if the view supports placeholders.
- Mark the drawing or warning system with “五金模板缺失”.
- Cut list must mark the item as unrecognized.

When installation dimensions are missing:

- Use template defaults when available.
- Otherwise omit that dimension.
- Do not create fake installation dimensions.

## Recommended Interfaces

```js
getHardwareProfile(project, group, row, boothIndex)
getHardwareTemplate(category, id)
buildHardwarePlacement(template, geometry, swing)
drawHardwareSymbol(ctxOrModel, template, placement)
buildHardwareNodes(profile, geometry)
collectHardwareBom(profile, geometry)
```
