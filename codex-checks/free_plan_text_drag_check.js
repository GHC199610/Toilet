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
const mouseDown = sectionBetween("cv.addEventListener('mousedown'", "cv.addEventListener('dblclick'");
const mouseMove = sectionBetween("window.addEventListener('mousemove'", "window.addEventListener('mouseup'");
const mouseUp = sectionBetween("window.addEventListener('mouseup'", "cv.addEventListener('mouseleave'");
const mouseLeave = sectionBetween("cv.addEventListener('mouseleave'", "cv.addEventListener('contextmenu'");
assertIncludes(source, 'let freeTextDrag = null', 'free text drag state should be tracked.');
assertIncludes(source, 'function beginFreeTextDrag', 'free text dragging should have a start helper.');
assertIncludes(source, 'function updateFreeTextDrag', 'free text dragging should update item coordinates.');
assertIncludes(source, 'function finishFreeTextDrag', 'free text dragging should have a finish helper.');
assertIncludes(mouseDown, "hit?.type === 'free-text'", 'left mousedown should detect free text before sheet block dragging.');
assertIncludes(mouseDown, 'beginFreeTextDrag(hit, pt, e)', 'mousedown should start free text drag from the hit text.');
assertIncludes(mouseMove, 'if (freeTextDrag)', 'mousemove should update active free text drags before other dragging.');
assertIncludes(mouseMove, 'updateFreeTextDrag(canvasPlanPoint(e))', 'mousemove should move free text in plan coordinates.');
assertIncludes(mouseUp, 'finishFreeTextDrag()', 'mouseup should finish free text dragging.');
assertIncludes(mouseLeave, 'freeTextDrag = null', 'leaving canvas should cancel free text drag state.');
console.log('free plan text drag contract ok');
