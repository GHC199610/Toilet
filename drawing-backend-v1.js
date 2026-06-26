// Experimental unified drawing command backend for future stable SVG export.
// It is intentionally isolated from the production Canvas/PDF/print paths.
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function n(value) {
    const num = Number(value) || 0;
    return Number(num.toFixed(4));
  }

  function createDrawingModel(width, height) {
    return {width, height, commands: []};
  }

  function push(model, type, props) {
    model.commands.push({type, ...props});
    return model;
  }

  function line(model, x1, y1, x2, y2, style = {}) {
    return push(model, 'line', {x1, y1, x2, y2, style});
  }

  function rect(model, x, y, w, h, style = {}) {
    return push(model, 'rect', {x, y, w, h, style});
  }

  function text(model, value, x, y, style = {}) {
    return push(model, 'text', {value, x, y, style});
  }

  function textClass(style = {}) {
    return String(style.className || style.role || 'text');
  }

  function textAttrs(style = {}) {
    const attrs = [];
    const className = textClass(style);
    if (className) attrs.push(`data-text-class="${esc(className)}"`);
    if (style.maxWidth !== undefined) attrs.push(`data-max-width="${n(style.maxWidth)}"`);
    if (style.fitMode) attrs.push(`data-fit-mode="${esc(style.fitMode)}"`);
    return attrs.join(' ');
  }

  function arc(model, cx, cy, r, start, end, style = {}) {
    return push(model, 'arc', {cx, cy, r, start, end, style});
  }

  function path(model, points, style = {}) {
    return push(model, 'path', {points:Array.isArray(points) ? points : [], style});
  }

  function hatch(model, x, y, w, h, gap = 42, style = {}) {
    return push(model, 'hatch', {x, y, w, h, gap, style});
  }

  function scaleStyle(style = {}, scale = 1) {
    const out = {...style};
    if (out.strokeWidth !== undefined) out.strokeWidth = Number(out.strokeWidth) * scale;
    if (out.fontSize !== undefined) out.fontSize = Number(out.fontSize) * scale;
    if (Array.isArray(out.dash)) out.dash = out.dash.map(v => Number(v) * scale);
    return out;
  }

  function tx(value, dx, scale) {
    return Number(value || 0) * scale + dx;
  }

  function appendModel(target, source, dx = 0, dy = 0, scale = 1) {
    (source?.commands || []).forEach(cmd => {
      const style = scaleStyle(cmd.style || {}, scale);
      if (cmd.type === 'line') line(target, tx(cmd.x1, dx, scale), tx(cmd.y1, dy, scale), tx(cmd.x2, dx, scale), tx(cmd.y2, dy, scale), style);
      else if (cmd.type === 'rect') rect(target, tx(cmd.x, dx, scale), tx(cmd.y, dy, scale), Number(cmd.w || 0) * scale, Number(cmd.h || 0) * scale, style);
      else if (cmd.type === 'text') text(target, cmd.value, tx(cmd.x, dx, scale), tx(cmd.y, dy, scale), style);
      else if (cmd.type === 'arc') arc(target, tx(cmd.cx, dx, scale), tx(cmd.cy, dy, scale), Number(cmd.r || 0) * scale, cmd.start, cmd.end, style);
      else if (cmd.type === 'path') path(target, (cmd.points || []).map(pt => ({x:tx(pt.x, dx, scale), y:tx(pt.y, dy, scale)})), style);
      else if (cmd.type === 'hatch') hatch(target, tx(cmd.x, dx, scale), tx(cmd.y, dy, scale), Number(cmd.w || 0) * scale, Number(cmd.h || 0) * scale, Number(cmd.gap || 42) * scale, style);
    });
    return target;
  }

  function styleAttrs(style = {}, defaults = {}) {
    const s = {...defaults, ...style};
    const attrs = [];
    if (s.fill !== undefined) attrs.push(`fill="${esc(s.fill)}"`);
    if (s.stroke !== undefined) attrs.push(`stroke="${esc(s.stroke)}"`);
    if (s.strokeWidth !== undefined) attrs.push(`stroke-width="${n(s.strokeWidth)}"`);
    if (s.dash) attrs.push(`stroke-dasharray="${s.dash.map(n).join(' ')}"`);
    if (s.lineCap) attrs.push(`stroke-linecap="${esc(s.lineCap)}"`);
    if (s.lineJoin) attrs.push(`stroke-linejoin="${esc(s.lineJoin)}"`);
    if (s.opacity !== undefined) attrs.push(`opacity="${n(s.opacity)}"`);
    return attrs.join(' ');
  }

  function arcPath(cx, cy, r, start, end) {
    const x1 = cx + Math.cos(start) * r;
    const y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r;
    const y2 = cy + Math.sin(end) * r;
    const large = Math.abs(end - start) > Math.PI ? 1 : 0;
    const sweep = end >= start ? 1 : 0;
    return `M ${n(x1)} ${n(y1)} A ${n(r)} ${n(r)} 0 ${large} ${sweep} ${n(x2)} ${n(y2)}`;
  }

  function hatchLines(x, y, w, h, gap) {
    const lines = [];
    const lineIntersections = c => {
      const points = [];
      const add = (px, py) => {
        if (px >= x - 0.001 && px <= x + w + 0.001 && py >= y - 0.001 && py <= y + h + 0.001) points.push({x:px, y:py});
      };
      add(c, y + h);
      add(c + h, y);
      add(x, y + h - (x - c));
      add(x + w, y + h - (x + w - c));
      return points.filter((pt, idx, arr) => arr.findIndex(other => Math.abs(other.x - pt.x) < 0.001 && Math.abs(other.y - pt.y) < 0.001) === idx);
    };
    for (let i = -h; i < w + h; i += gap) {
      const pts = lineIntersections(x + i);
      if (pts.length >= 2) lines.push([pts[0], pts[1]]);
    }
    return lines;
  }

  function modelToSvg(model) {
    const body = [];
    const svgBaseline = value => ({central:'middle'}[value] || value || 'alphabetic');
    model.commands.forEach(cmd => {
      if (cmd.type === 'line') {
        body.push(`<line x1="${n(cmd.x1)}" y1="${n(cmd.y1)}" x2="${n(cmd.x2)}" y2="${n(cmd.y2)}" ${styleAttrs(cmd.style, {fill:'none', stroke:'#000', strokeWidth:1})}/>`);
      } else if (cmd.type === 'rect') {
        body.push(`<rect x="${n(cmd.x)}" y="${n(cmd.y)}" width="${n(cmd.w)}" height="${n(cmd.h)}" ${styleAttrs(cmd.style, {fill:'none', stroke:'#000', strokeWidth:1})}/>`);
      } else if (cmd.type === 'text') {
        const s = cmd.style || {};
        const transform = s.rotate ? ` transform="rotate(${n(s.rotate)} ${n(cmd.x)} ${n(cmd.y)})"` : '';
        const metadata = textAttrs(s);
        body.push(`<text x="${n(cmd.x)}" y="${n(cmd.y)}" font-family="${esc(s.fontFamily || 'Microsoft YaHei, Arial, sans-serif')}" font-size="${n(s.fontSize || 12)}" font-weight="${esc(s.fontWeight || '400')}" text-anchor="${esc(s.align || 'start')}" dominant-baseline="${esc(svgBaseline(s.baseline))}" fill="${esc(s.fill || '#000')}"${metadata ? ' ' + metadata : ''}${transform}>${esc(cmd.value)}</text>`);
      } else if (cmd.type === 'arc') {
        body.push(`<path d="${arcPath(cmd.cx, cmd.cy, cmd.r, cmd.start, cmd.end)}" ${styleAttrs(cmd.style, {fill:'none', stroke:'#000', strokeWidth:1})}/>`);
      } else if (cmd.type === 'path') {
        const points = cmd.points || [];
        if (points.length) {
          const d = points.map((pt, i) => `${i ? 'L' : 'M'} ${n(pt.x)} ${n(pt.y)}`).join(' ') + ((cmd.style || {}).closed ? ' Z' : '');
          body.push(`<path d="${d}" ${styleAttrs(cmd.style, {fill:'none', stroke:'#000', strokeWidth:1})}/>`);
        }
      } else if (cmd.type === 'hatch') {
        hatchLines(cmd.x, cmd.y, cmd.w, cmd.h, cmd.gap).forEach(([a, b]) => {
          body.push(`<line x1="${n(a.x)}" y1="${n(a.y)}" x2="${n(b.x)}" y2="${n(b.y)}" ${styleAttrs(cmd.style, {fill:'none', stroke:'rgba(0,0,0,.36)', strokeWidth:1})}/>`);
        });
      }
    });
    return `<svg xmlns="${NS}" width="${n(model.width)}" height="${n(model.height)}" viewBox="0 0 ${n(model.width)} ${n(model.height)}">${body.join('')}</svg>`;
  }


  function applyCanvasStyle(ctx, style = {}, defaults = {}) {
    const s = {...defaults, ...style};
    ctx.fillStyle = s.fill ?? 'transparent';
    ctx.strokeStyle = s.stroke ?? '#000';
    ctx.lineWidth = Number(s.strokeWidth ?? 1) || 1;
    ctx.lineCap = s.lineCap || 'butt';
    ctx.lineJoin = s.lineJoin || 'miter';
    ctx.globalAlpha = Number.isFinite(Number(s.opacity)) ? Number(s.opacity) : 1;
    ctx.setLineDash(Array.isArray(s.dash) ? s.dash : []);
  }

  function renderToCanvas(ctx, model) {
    ctx.save();
    model.commands.forEach(cmd => {
      if (cmd.type === 'line') {
        applyCanvasStyle(ctx, cmd.style, {stroke:'#000', strokeWidth:1});
        ctx.beginPath();
        ctx.moveTo(cmd.x1, cmd.y1);
        ctx.lineTo(cmd.x2, cmd.y2);
        ctx.stroke();
      } else if (cmd.type === 'rect') {
        applyCanvasStyle(ctx, cmd.style, {fill:'none', stroke:'#000', strokeWidth:1});
        if ((cmd.style || {}).fill && (cmd.style || {}).fill !== 'none') ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h);
        if ((cmd.style || {}).stroke !== 'none') ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h);
      } else if (cmd.type === 'text') {
        const s = cmd.style || {};
        ctx.save();
        ctx.fillStyle = s.fill || '#000';
        ctx.font = `${s.fontWeight || '400'} ${Number(s.fontSize || 12)}px ${s.fontFamily || 'Microsoft YaHei, Arial, sans-serif'}`;
        ctx.textAlign = ({middle:'center', start:'left', end:'right'}[s.align] || s.align || 'left');
        ctx.textBaseline = ({central:'middle', alphabetic:'alphabetic', top:'top', hanging:'top'}[s.baseline] || s.baseline || 'alphabetic');
        ctx.translate(cmd.x, cmd.y);
        if (s.rotate) ctx.rotate(Number(s.rotate) * Math.PI / 180);
        ctx.fillText(String(cmd.value ?? ''), 0, 0);
        ctx.restore();
      } else if (cmd.type === 'arc') {
        applyCanvasStyle(ctx, cmd.style, {stroke:'#000', strokeWidth:1});
        ctx.beginPath();
        ctx.arc(cmd.cx, cmd.cy, cmd.r, cmd.start, cmd.end);
        ctx.stroke();
      } else if (cmd.type === 'path') {
        const points = cmd.points || [];
        if (points.length) {
          applyCanvasStyle(ctx, cmd.style, {fill:'none', stroke:'#000', strokeWidth:1});
          ctx.beginPath();
          points.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y));
          if ((cmd.style || {}).closed) ctx.closePath();
          if ((cmd.style || {}).fill && (cmd.style || {}).fill !== 'none') ctx.fill();
          if ((cmd.style || {}).stroke !== 'none') ctx.stroke();
        }
      } else if (cmd.type === 'hatch') {
        applyCanvasStyle(ctx, cmd.style, {stroke:'rgba(0,0,0,.36)', strokeWidth:1});
        hatchLines(cmd.x, cmd.y, cmd.w, cmd.h, cmd.gap).forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      }
    });
    ctx.restore();
  }

  function textSummary(model) {
    return (model?.commands || []).filter(cmd => cmd.type === 'text').reduce((acc, cmd) => {
      const cls = textClass(cmd.style || {});
      const item = acc[cls] || {count:0, fontSizes:[], maxWidths:0};
      item.count += 1;
      if (cmd.style?.fontSize !== undefined) item.fontSizes.push(Number(cmd.style.fontSize));
      if (cmd.style?.maxWidth !== undefined) item.maxWidths += 1;
      acc[cls] = item;
      return acc;
    }, {});
  }

  window.DrawingBackendV1 = {createDrawingModel, line, rect, text, arc, path, hatch, appendModel, modelToSvg, renderToCanvas, textSummary};
})();
