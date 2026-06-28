# Calculation Engine Spec

Version: 1.1

## Responsibility

The calculation engine converts validated row/project inputs into deterministic geometry. It owns numeric layout facts, not drawing or UI.

## Inputs

Minimum row inputs:

- Booth count.
- Total run length.
- Depth.
- Door width or per-booth door widths.
- Door gap.
- Panel thickness.
- Wall condition.
- Rebate state and rebate depth.
- Per-booth no-door and swing overrides.
- Locked dimensions when present.

Inputs must be normalized before calculation. Invalid or missing numeric values must become explicit validation failures or documented defaults.

## Outputs

The output geometry must include:

- Total run used for drawings.
- Booth widths in display/order sequence.
- Door install widths and finished door widths.
- Gap pairs per booth.
- Side/front panel dimensions.
- Wall thickness and wall presence flags.
- Rebate-derived big/small face dimensions when enabled.
- Validation status, error code, message, and actionable suggestion when invalid.

## Calculation Priorities

Resolve dimensions in this order:

1. Honor explicit valid locks and per-booth overrides.
2. Preserve minimum usable booth width.
3. Preserve requested or allowed door width.
4. Preserve required gaps and edge reserves.
5. Distribute remaining space deterministically.

Do not use simple equal distribution if it violates usability, installation, or explicit locks.

## Business Constraints

- Door gaps participate in both net-width and total-width closure.
- Minimum usable booth clear width is 700 mm unless a stricter project rule overrides it.
- Depth below 800 mm is a warning or invalid state according to the active rule mode.
- Door width must not consume the minimum usable clear width.
- Rebate small-face dimensions drive installation gaps; rebate big-face dimensions drive panel/door body representation and cut-list dimensions.

## Determinism

The same normalized input must always produce the same output. Do not use randomness, DOM measurement, current zoom, canvas size, or rendering side effects.

## Validation Errors

Use explicit failure objects with:

```js
{
  error_code: 'NET_WIDTH_TOO_SMALL',
  error_message: 'Booth clear width is below the minimum allowed value.',
  affected_module: 'calculation',
  suggestion: 'Reduce booth count or increase total length.'
}
```

Expected error categories:

- Net width too small.
- Door width impossible.
- Locked dimensions exceed available length.
- Depth below minimum.
- Door/wall/structure collision.
- Missing required input.

## Prohibited

- Drawing from calculation functions.
- Reading DOM, Canvas, SVG, or export output.
- Recomputing a separate geometry path for one view.
- Returning a visually plausible geometry when validation failed.
