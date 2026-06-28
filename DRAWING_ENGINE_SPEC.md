# Drawing Engine Spec

Version: 1.1

## Responsibility

The drawing engine converts geometry and layout models into drawing commands or Canvas drawing operations. It must not calculate business dimensions or modify rules.

## Inputs

- `GeometryModel`
- `LayoutModel`
- `HardwareProfile` or hardware placement data when a view displays hardware
- Drawing configuration such as paper size, scale, title block, and page index

## Outputs

- `DrawingModel` command list for backend SVG/Canvas routes.
- Canvas drawing for production preview/export routes where still used.

Supported backend command types:

- `line`
- `rect`
- `text`
- `arc`
- `path`
- `hatch`

## Drawing Rules

- Draw from model dimensions in millimeters converted through a single scale per view/page.
- Keep view-specific code isolated: plan, front elevation, side elevation, and detail/node drawings may share utilities but not duplicate business calculations.
- Use class names/roles on text and important commands so export typography and regression checks can target them.
- Constrained text must carry a `maxWidth` and, where supported, `fitMode: 'shrink'`.
- Dimensions must avoid duplicate labels and avoid covering hardware, door tags, and primary geometry.

## Physical Baselines

- Plan depth dimensions stop at the depth panel outer end.
- Front-edge panels sit outside the depth dimension.
- Door panel thickness aligns with the front-edge panel outside baseline.
- Wall extents follow the depth panel plus front-edge panel outer edge.
- Rebate doors preserve both big-face body coordinates and small-face installation coordinates.

## Layers

Use consistent logical layers/classes across views:

- `Wall_Layer`
- `Panel_Layer`
- `Door_Layer`
- `Hardware_Layer`
- `Dimension_Layer`
- `Text_Layer`
- `Title_Layer`
- `Structure_Layer`

## Error Handling

If required geometry is missing, fail the drawing request and surface the missing field. Do not generate a production-looking wrong drawing.

## Prohibited

- Hardcoded business coordinates that should come from models.
- View-specific recalculation of booth widths, door widths, gaps, or wall conditions.
- Fixing export bugs by changing business geometry.
- Replacing one rendering route with another without following the relevant export spec.
