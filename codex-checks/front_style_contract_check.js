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

function assertNotIncludes(haystack, needle, message) {
  if (haystack.includes(needle)) throw new Error(message);
}

const drawElevationDim = sectionBetween('function drawElevationDim', 'function drawLeftOuterDepthDim');
const frontLayout = sectionBetween('function frontElevationLayout', 'function frontDoorSwingSegments');
const frontHelpers = sectionBetween('function frontTouchesMiddlePostEdge', 'function backendDrawFrontDatum');
const frontHeaderCanvas = sectionBetween('function drawFrontHeaderPanelsCanvas', 'function drawFrontDoorAnnotationsCanvas');
const drawFront = sectionBetween('function drawFront(p)', 'function drawDetailCallout');
const frontDoorLoop = sectionBetween("ctx.strokeRect(door.x, door.y, door.w, door.h);", 'const topDimY = L.oy - 46');
const backendFront = sectionBetween('function buildFrontPageDrawingModel', 'function buildSidePageDrawingModel');
const inputBindings = sectionBetween('function commitHeightFieldOnEnter', "document.getElementById('canvas-text-editor')");

assertIncludes(frontLayout, 'const hVisMm = Number(p.hVis) || 1830', 'front layout should keep a real visible-board height in mm.');
assertIncludes(frontLayout, 'const H = Math.max(hUMm, hMidMm, hDoorMm, hVisMm)', 'front overall height should include visible-board height.');
assertIncludes(frontLayout, 'post.y = floor - hMid', 'front middle partitions should use real middle-partition height.');
assertIncludes(frontLayout, 'post.h = hMid', 'front middle partitions should use real middle-partition height for drawing.');
assertIncludes(frontLayout, 'booths.push({index:i, x:boothX, y:floor - vis', 'front visible/fixed panels should start from their own visible-board height, not middle-partition height.');
assertIncludes(drawElevationDim, 'planFont', 'drawElevationDim should use planFont so elevation dimension text follows plan text scaling.');
assertIncludes(drawElevationDim, 'anno(', 'drawElevationDim should use anno() so dimension offsets/ticks follow plan annotation scaling.');
assertIncludes(frontHelpers, 'Math.max(0.25, anno(', 'front helper line widths should use fine plan-style scaled line widths.');
assertIncludes(drawFront, 'const prevAnnoScale = planAnnotationScale', 'drawFront should set planAnnotationScale from front scale and restore it.');
assertIncludes(drawFront, 'planAnnotationScale = 0.115', 'drawFront should use a restrained CAD-style annotation scale, not the raw front geometry scale.');
assertIncludes(drawFront, 'Math.max(0.25, anno(2.2))', 'front primary lines should be fine CAD-style strokes.');
assertIncludes(drawFront, 'post.index > 0 && post.index < L.count', 'front middle upright panels should be styled separately from edge uprights.');
assertIncludes(source, 'front-middle-upright-panel', 'front middle partition thickness should have a distinct class.');
assertIncludes(drawFront, "ctx.strokeStyle = '#000000'", 'front middle partition and non-door board strokes should be black.');
assertIncludes(drawFront, 'ctx.setLineDash([anno(12), anno(10)])', 'front middle partition thickness should be dashed.');
assertIncludes(source, "B.line(model, post.x, post.y, post.x, post.y + post.h, {stroke:'#000'", 'backend middle partition should draw the left real-height black thickness edge.');
assertIncludes(source, "B.line(model, post.x + post.w, post.y, post.x + post.w, post.y + post.h, {stroke:'#000'", 'backend middle partition should draw the right real-height black thickness edge.');
assertIncludes(frontHelpers, 'ctx.setLineDash([])', 'front fixed panel helper should not leave dashed state active.');
assertIncludes(source, 'frontMiddlePostRanges', 'front panel segment lines should avoid middle partition thickness ranges.');
assertIncludes(source, 'frontTouchesMiddlePostEdge', 'front fixed panel seams should omit vertical edges that duplicate middle partition thickness lines.');
assertIncludes(drawFront, 'ctx.moveTo(post.x, post.y)', 'front middle partition should draw only its two vertical thickness lines.');
assertNotIncludes(source, 'drawFrontVisiblePanelsCanvas', 'front elevation should not keep a full-booth visible-panel background frame helper.');
assertNotIncludes(source, 'backendDrawFrontVisiblePanels', 'backend front elevation should not keep a full-booth visible-panel background frame helper.');
assertNotIncludes(drawFront, 'ctx.strokeRect(booth.x, booth.y, booth.w, booth.h)', 'front visible panels must not use full strokeRect because it creates a center line inside middle partitions.');
assertNotIncludes(backendFront, "B.rect(model, booth.x, booth.y, booth.w, booth.h, {fill:'none', stroke:'#6a9bcc'", 'backend front visible panels must not use full rect because it creates a center line inside middle partitions.');
assertNotIncludes(frontHelpers, "ctx.strokeStyle = '#8fb2d6'", 'front fixed/front panel seams should be black, not blue.');
assertNotIncludes(backendFront, "stroke:'#8fb2d6'", 'backend front fixed/front panel seams should be black, not blue.');
assertNotIncludes(drawFront, "#378ADD", 'front middle partition board lines should be black, not blue.');
assertNotIncludes(backendFront, "#378ADD", 'backend front middle partition board lines should be black, not blue.');
assertIncludes(drawFront, "ctx.strokeStyle = '#185FA5'", 'front door panels should keep the current blue.');
assertIncludes(source, 'hHeader:0, hHeaderGap:0', 'door header height and header-door gap should default to 0.');
assertIncludes(source, "className:'front-door-header-panel'", 'front header panels should have a distinct class.');
assertIncludes(frontHeaderCanvas, "ctx.strokeStyle = '#185FA5'", 'canvas front header panels should use the same blue stroke as door panels.');
assertIncludes(source, "stroke:'#185FA5', strokeWidth:1, className:'front-door-header-panel'", 'front header panels should use the same blue stroke as door panels.');
assertIncludes(frontDoorLoop, "ctx.strokeStyle = '#185FA5'", 'front door swing direction should keep the current blue color.');
assertIncludes(frontDoorLoop, 'ctx.setLineDash([anno(84), anno(18)])', 'front door swing direction should use long segments with short breaks like the reference.');
assertIncludes(backendFront, "className:'front-door-swing-segment'", 'backend front door swing direction should be present.');
assertIncludes(backendFront, "{stroke:'#185FA5', strokeWidth:0.6, dash:[30,7], className:'front-door-swing-segment'}", 'backend front door swing direction should keep blue color with long segments and short breaks like the reference.');
assertNotIncludes(drawFront, 'ctx.strokeRect(L.ox, L.oy, L.sW, L.sH)', 'front elevation should not draw a black overall body frame over real component lines.');
assertNotIncludes(backendFront, "className:'front-outline'", 'backend front elevation should not draw a black overall body frame over real component lines.');
assertNotIncludes(frontHelpers, 'ctx.moveTo(L.ox, L.floor - L.hU)', 'front elevation should not draw a continuous top finish line across separate boards.');
assertNotIncludes(frontHelpers, "className:'front-top-finish-line'", 'backend front elevation should not draw a continuous top finish line across separate boards.');
assertNotIncludes(drawFront, 'ctx.strokeRect(x, L.floor - L.vis, w, L.vis)', 'front rebate panels should not draw an extra full rectangle over visible/front panel lines.');
assertNotIncludes(backendFront, "className:'front-rebate-panel'", 'backend front rebate panels should not draw an extra full rectangle over visible/front panel lines.');
assertIncludes(drawFront, 'frontDoorSwingSegments(door', 'front elevation should keep door opening direction indicators.');
assertIncludes(backendFront, 'frontDoorSwingSegments(door', 'backend front elevation should keep door opening direction indicators.');
assertIncludes(drawFront, 'drawElevationDim(', 'front elevation should keep outside dimension annotations.');
assertIncludes(backendFront, 'backendDrawDim(', 'backend front elevation should keep outside dimension annotations.');
assertNotIncludes(drawFront, 'drawFrontDoorAnnotationsCanvas(L)', 'front elevation should not draw door tag or swing text inside the body.');
assertNotIncludes(backendFront, 'backendDrawFrontDoorAnnotations(B, model, L)', 'backend front elevation should not draw door tag or swing text inside the body.');
assertNotIncludes(drawFront, "fillText('鏃犻棬'", 'front elevation should not draw no-door text.');
assertNotIncludes(backendFront, "className:'front-no-door-outline'", 'backend front elevation should not draw no-door outline frames.');
assertNotIncludes(drawFront, 'ctx.strokeRect(booth.x + 4, L.floor - L.hDoor', 'front elevation should not draw no-door outline frames.');
assertNotIncludes(backendFront, "className:'front-no-door-label'", 'backend front elevation should not draw no-door text.');
assertNotIncludes(frontHelpers, 'ctx.fillText(booth.label', 'front visible panels should not draw booth labels.');
assertNotIncludes(frontHelpers, 'B.text(model, booth.label', 'backend front visible panels should not draw booth labels.');
assertNotIncludes(drawFront, 'P${index + 1}', 'front elevation should not draw P labels.');
assertNotIncludes(backendFront, 'P${index + 1}', 'backend front elevation should not draw P labels.');
assertIncludes(inputBindings, 'function commitHeightFieldOnEnter', 'height inputs should commit through an Enter-only helper.');
assertIncludes(inputBindings, "if (['h-upright','h-door','h-mid','h-vis'].includes(el.id)) return", 'height inputs should not commit on blur/change through the generic field handler.');
assertIncludes(inputBindings, 'commitHeightFieldOnEnter(el.id)', 'height inputs should commit when Enter is pressed.');
assertNotIncludes(inputBindings, "heightInput?.addEventListener('input'", 'height inputs should not redraw on every input event.');
assertNotIncludes(inputBindings, "document.getElementById('h-upright').addEventListener('change'", 'upright height should not commit on blur/change.');

console.log('front style contract ok');
