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

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) throw new Error(message);
}

const drawElevationDim = sectionBetween('function drawElevationDim', 'function drawLeftOuterDepthDim');
const frontLayout = sectionBetween('function frontElevationLayout', 'function frontDoorSwingSegments');
const frontHelpers = sectionBetween('function drawFrontDatumCanvas', 'function backendDrawFrontDatum');
const drawFront = sectionBetween('function drawFront', 'function drawDetailCallout');

assertIncludes(frontLayout, 'const hVisMm = Number(p.hVis) || 1830', 'front layout should keep a real visible-board height in mm.');
assertIncludes(frontLayout, 'const H = Math.max(hUMm, hMidMm, hDoorMm, hVisMm)', 'front overall height should include visible-board height.');
assertIncludes(frontLayout, 'post.y = floor - hMid', 'front middle partitions should use real middle-partition height.');
assertIncludes(frontLayout, 'post.h = hMid', 'front middle partitions should use real middle-partition height for drawing.');
assertIncludes(frontLayout, 'booths.push({index:i, x:boothX, y:floor - vis', 'front visible/fixed panels should start from their own visible-board height, not middle-partition height.');
assertIncludes(drawElevationDim, 'planFont', 'drawElevationDim should use planFont so elevation dimension text follows plan text scaling.');
assertIncludes(drawElevationDim, 'anno(', 'drawElevationDim should use anno() so dimension offsets/ticks follow plan annotation scaling.');
assertIncludes(frontHelpers, 'planFont', 'front datum/door/chain labels should use planFont.');
assertIncludes(frontHelpers, 'Math.max(0.25, anno(', 'front helper line widths should use fine plan-style scaled line widths.');
assertIncludes(drawFront, 'const prevAnnoScale = planAnnotationScale', 'drawFront should set planAnnotationScale from front scale and restore it.');
assertIncludes(drawFront, 'planAnnotationScale = 0.115', 'drawFront should use a restrained CAD-style annotation scale, not the raw front geometry scale.');
assertIncludes(drawFront, 'Math.max(0.25, anno(2.2))', 'front primary lines should be fine CAD-style strokes.');
assertIncludes(drawFront, 'const topDimY = L.oy - 46', 'front total dimension should use a fixed paper-space offset above the body.');
assertIncludes(drawFront, 'const doorWidthDimY = L.floor + 32', 'front door-width dimensions should use a fixed lower layer away from the body.');
assertIncludes(frontHelpers, 'const y = L.floor + 58', 'front booth chain dimension should sit below door-width dimensions with fixed spacing.');
assertIncludes(drawFront, 'const doorHeightDimX = L.ox + L.sW + 44', 'front height dimensions should use separated fixed right-side columns.');
assertIncludes(drawFront, 'post.index > 0 && post.index < L.count', 'front middle upright panels should be styled separately from edge uprights.');
assertIncludes(source, 'front-middle-upright-panel', 'front middle partition thickness should have a distinct class.');
assertIncludes(drawFront, "ctx.strokeStyle = isMiddlePost ? '#378ADD' : '#000000'", 'front middle partition thickness should use blue dashed stroke.');
assertIncludes(drawFront, 'ctx.setLineDash([anno(12), anno(10)])', 'front middle partition thickness should be dashed.');
assertIncludes(source, "B.line(model, post.x, post.y, post.x, post.y + post.h", 'backend middle partition should draw the left real-height thickness edge.');
assertIncludes(source, "B.line(model, post.x + post.w, post.y, post.x + post.w, post.y + post.h", 'backend middle partition should draw the right real-height thickness edge.');
assertIncludes(frontHelpers, 'ctx.setLineDash([])', 'front fixed panel helper should not leave dashed state active.');
assertIncludes(source, 'frontMiddlePostRanges', 'front panel segment lines should avoid middle partition thickness ranges.');
assertIncludes(source, 'frontTouchesMiddlePostEdge', 'front fixed panel seams should omit vertical edges that duplicate middle partition thickness lines.');
assertIncludes(drawFront, 'ctx.moveTo(post.x, post.y)', 'front middle partition should draw only its two vertical thickness lines.');

console.log('front style contract ok');
