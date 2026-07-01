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
const handleTap = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
const boardBranch = sectionBetween("} else if (hit.type === 'board-panel')", "} else if (hit.type === 'tag')");
assertIncludes(source, 'function selectPlanRowForHit', 'plan selection should have a helper that avoids recording selection-only actions.');
assertIncludes(handleTap, 'selectPlanRowForHit(group, row)', 'plan tap should use selection helper instead of always saving active group.');
assertNotIncludes(boardBranch, 'pushHistory()', 'selecting a board panel should not create a history entry.');
assertNotIncludes(boardBranch, 'saveActiveGroup()', 'selecting a board panel should not save form state as a variable edit.');
console.log('selection history contract ok');
