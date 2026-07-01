const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
function assertNotIncludes(haystack, needle, message) { if (haystack.includes(needle)) throw new Error(message); }
const selectedNoteTarget = sectionBetween('function selectedNoteTarget()', 'function syncPlanNoteInputFromSelection');
const normalizeTagTextStyle = sectionBetween('function normalizeTagTextStyle', 'function tagVisualFontSize');
const drawPlanRow = sectionBetween('function drawPlanRow', 'const drawDepthPanel');
const buildPlanPageDrawingModel = sectionBetween('function buildPlanPageDrawingModel', 'function renderPlanPageBackendSvg');
assertNotIncludes(selectedNoteTarget, 'row.noteStyle = {...defaultTextStyle}', 'red tag should not inherit free-text default size 22.');
assertIncludes(drawPlanRow, 'normalizeTagTextStyle', 'red tag should use tag-specific default style.');
assertIncludes(source, 'function normalizeTagTextStyle', 'tag style should normalize red label text style.');
assertIncludes(source, 'const DEFAULT_TAG_FONT_SIZE = 8', 'red tag default size should be 8.');
assertIncludes(normalizeTagTextStyle, 'Number(style.fontSize) || DEFAULT_TAG_FONT_SIZE', 'red tag default size should use its own default, not title/free-text defaults.');
assertNotIncludes(normalizeTagTextStyle, 'defaultTextStyle.fontSize', 'red tag default size should not follow the free-text default.');
assertNotIncludes(source, 'Number(style.fontSize) || (isSingleBoothTag ? 66 : 95)', 'red tag default size must not fall back to the old oversized preset.');
assertIncludes(source, 'function tagVisualFontSize', 'red tag should convert configured font size to title-like visual size.');
assertIncludes(drawPlanRow, 'const tagDrawFontSize = tagVisualFontSize(tagFontSize, options.renderFit)', 'red tag should compensate for sheet row scaling.');
assertIncludes(drawPlanRow, '${tagDrawFontSize}px', 'red tag should render using the compensated draw font size.');
assertIncludes(buildPlanPageDrawingModel, 'tagStyle:block.row.noteStyle || {}', 'backend/SVG red tags should use the same configured tag style as canvas rendering.');
assertIncludes(buildPlanPageDrawingModel, 'renderFit:placement.fit', 'backend/SVG red tags should compensate for final sheet scaling.');
console.log('red tag default style contract ok');
