---
name: "toilet-partition-generator"
description: "卫生间隔断自动生成器开发规范。开发此项目时必须遵循，包括代码风格、数据结构、函数设计等。"
---

# 卫生间隔断自动生成器 - 开发规范

本规范定义了卫生间隔断自动生成器项目的代码规范、架构模式和开发要求。

## 1. 项目概述

### 1.1 项目类型
- 单文件 HTML 应用
- Canvas 2D 绘图
- 参数驱动的图形生成器

### 1.2 核心功能
- 平面图绘制（多组多排支持）
- 正立面图绘制
- 侧立面图绘制
- 尺寸标注系统
- 材料清单（BOM）生成
- 图片导出功能

## 2. 文件结构规范

### 2.1 HTML 结构（严格按顺序）
```
1. <!DOCTYPE html>
2. <html lang="zh-CN">
3. <head>
   - meta charset
   - meta viewport
   - <title>
   - <style>  (CSS 变量定义 + 组件样式)
4. <body>
   - 语义化标签结构
   - <script>  (所有 JS 代码)
```

### 2.2 JavaScript 代码组织顺序
```javascript
// 1. 常量定义（全大写 + 下划线分隔）
const SHEET_W = 1180;
const SHEET_H = 820;

// 2. 数据结构定义
const swingDefs = { ... };
const defaultRow = { ... };

// 3. 状态变量（camelCase）
let wallMode = 'three';
let zoomScale = 1;

// 4. 工具函数
function fmtMm(value) { ... }
function parseWidths(text) { ... }

// 5. 计算函数
function compute(p) { ... }

// 6. 绘制函数
function drawView(p, tab) { ... }
function drawPlan(p) { ... }
function drawPlanRow(p, ox, oy, scale, ...) { ... }

// 7. 事件监听器
canvas.addEventListener('wheel', e => { ... });

// 8. 初始化
setTimeout(() => { ... }, 100);
```

## 3. 命名规范

### 3.1 变量命名
| 类型 | 规范 | 示例 |
|------|------|------|
| 常量 | UPPER_SNAKE_CASE | `SHEET_W`, `MIN_DOOR_W` |
| 状态变量 | camelCase | `wallMode`, `zoomScale` |
| 参数对象 | 小写下划线 | `p.count`, `p.total` |
| 计算结果 | camelCase | `boothWidths`, `sidePairs` |
| DOM 元素 | camelCase | `canvas`, `ctx` |

### 3.2 函数命名
| 类型 | 规范 | 示例 |
|------|------|------|
| 计算函数 | 动词/动词+名词 | `compute(p)`, `parseWidths(text)` |
| 绘制函数 | draw + 名词 | `drawPlan(p)`, `drawDim(...)` |
| 事件处理 | 名词/动词 | `resizeCanvas()`, `resetZoom()` |
| 渲染函数 | render + 名词 | `renderGroups()`, `renderBOM(p)` |
| 获取函数 | get + 名词 | `getParams()`, `getSheetLayout(p)` |

### 3.3 CSS 类命名
- 使用 kebab-case：`group-item`, `row-anim-wrap`
- BEM 风格：`group-actions-inline`, `booth-swing-panel`

## 4. Canvas 绘图规范

### 4.1 坐标系统
- 使用毫米（mm）作为逻辑单位
- 通过 `scale` 变量转换为像素
- 原点位于图纸区域左上角

### 4.2 视图变换
```javascript
function drawView(p, tab) {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#eef1f4';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.save();
  ctx.translate(panX, panY);        // 平移
  ctx.scale(zoomScale, zoomScale);   // 缩放
  // ... 绘制内容 ...
  ctx.restore();
  updateZoomInfo();
}
```

### 4.3 尺寸标注
```javascript
function drawDim(x1, y1, x2, y2, label, side) {
  ctx.save();
  ctx.strokeStyle = '#111';
  ctx.fillStyle = '#111';
  ctx.lineWidth = 1;
  ctx.font = `15px 'Microsoft YaHei', Arial, sans-serif`;
  // ... 绘制逻辑 ...
  ctx.restore();
}
```

### 4.4 绘图状态管理
- 使用 `ctx.save()` 和 `ctx.restore()` 配对
- 绘制前设置样式，绘制后恢复

## 5. 数据结构规范

### 5.1 参数对象 (p)
```javascript
{
  count: Number,        // 间数
  total: Number,       // 总长度(mm)
  depth: Number,       // 深度(mm)
  doorW: Number,       // 门宽(mm)
  doorGap: Number,     // 门缝(mm)
  rebate: Boolean,      // 是否子母口
  rebateDepth: Number,  // 启口深度(mm)
  swing: String,       // 开门方向
  boothSwings: Array,   // 各间隔间开门方向
  hUpright: Number,    // 立板高度
  hDoor: Number,       // 门板高度
  hMid: Number,        // 中隔板高度
  hVis: Number,        // 见光板高度
  tPanel: Number,      // 板厚
  wall: String,        // 墙体条件
  widthsText: String    // 自定义宽度文本
}
```

### 5.2 计算结果对象 (c)
```javascript
{
  hasLeft: Boolean,           // 左边靠墙
  hasRight: Boolean,          // 右边靠墙
  hasBack: Boolean,           // 背墙
  wallT: Number,              // 墙厚(120)
  boothW: Number,             // 单间宽度
  boothWidths: Array,         // 各间宽度
  doorWidths: Array,          // 各门宽度(大面)
  doorInstallWidths: Array,   // 各门安装宽度
  sidePairs: Array,           // [[左,右], [左,右], ...]
  gapPairs: Array,            // [[左缝,右缝], ...]
  totalRun: Number,           // 总运行长度
  adjustedLength: Boolean,    // 是否调整长度
  edge: Number,               // 边板宽度
  middle: Number,             // 中间隔板宽度
  insufficientDoors: Array,   // 门宽不足标记
  insufficientEdges: Array,   // 边板不足标记
  insufficientMiddles: Array  // 立板不足标记
}
```

## 6. 计算逻辑规范

### 6.1 核心计算 (compute 函数)
```javascript
function compute(p) {
  // 1. 墙体条件判断
  const hasLeft = p.wall === 'three' || p.wall === 'left';
  const hasRight = p.wall === 'three' || p.wall === 'right';
  const hasBack = ['three', 'left', 'right', 'back'].includes(p.wall);

  // 2. 尺寸约束常量
  const minEdgePanel = 100;    // 最小边板
  const minMiddlePanel = 200;   // 最小中立板
  const minDoorW = 500;         // 最小门宽

  // 3. 计算标准门安装宽度
  const standardDoorInstallW = rebateSmallSize(p.doorW, p, 'double');
  const doorZoneW = standardDoorInstallW + p.doorGap;

  // 4. 计算间宽
  const remainingForMargins = p.total - p.count * doorZoneW;
  const autoBoothW = remainingForMargins < 0 
    ? doorZoneW 
    : doorZoneW + Math.round(remainingForMargins / p.count);

  // 5. 计算边板对
  const sidePairs = boothWidths.map((width, i) => {
    const available = Math.max(0, width - doorInstallWidths[i] - p.doorGap);
    // ... 分配逻辑 ...
  });

  // 6. 中间隔板调整
  for (let i = 0; i < p.count - 1; i++) {
    // ... 确保中间宽度 >= minMiddlePanel ...
  }

  return { /* 结果对象 */ };
}
```

### 6.2 尺寸分配原则
- 门宽优先确保
- 边板最小 100mm
- 中间隔板最小 200mm
- 总长度不足时自动调整

## 7. UI 组件规范

### 7.1 样式变量
```css
:root {
  --color-text-primary: #1f2328;
  --color-text-secondary: #656d76;
  --color-text-tertiary: #8c959f;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f6f8fa;
  --color-border-primary: #d0d7de;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
}
```

### 7.2 深色主题支持
```css
body.theme-dark {
  --color-text-primary: #e6edf3;
  --color-text-secondary: #9da7b3;
  --color-background-primary: #141a22;
  /* ... */
}
```

### 7.3 按钮状态
- `active`: 选中状态 - 背景 `#E6F1FB`，边框 `#378ADD`
- `hover`: 悬停状态 - 边框变为主色调

## 8. 事件处理规范

### 8.1 防抖/节流
- 使用 `setTimeout` 延迟处理快速输入
- `refreshDrawing(false)` 用于非生成性更新
- `refreshDrawing(true)` 用于需要重新计算的场景

### 8.2 Canvas 交互
```javascript
// 缩放
cv.addEventListener('wheel', e => {
  e.preventDefault();
  const oldScale = zoomScale;
  zoomScale *= Math.exp(-e.deltaY * 0.001);
  zoomScale = Math.max(0.1, Math.min(zoomScale, 5));
  // ... 更新平移量 ...
}, { passive: false });

// 点击选择
cv.addEventListener('click', e => {
  if (currentTab !== 'plan' || isDragging) return;
  // ... 坐标转换 ...
  // ... 命中检测 ...
});
```

## 9. 国际化规范

### 9.1 文本语言
- 所有用户可见文本使用中文
- 代码中的标签和说明使用中文
- 尺寸单位使用 mm（毫米）

### 9.2 尺寸显示
```javascript
function fmtMm(value) {
  const n = Number(value) || 0;
  return String(Math.round(n));
}

// 使用示例
`门宽 ${p.doorW}mm`
`净间宽 ${fmtMm(c.boothW)}mm`
```

## 10. 性能规范

### 10.1 Canvas 重绘
- 仅在参数变化时重绘
- 使用 `requestAnimationFrame` 处理动画
- 避免不必要的 `clearRect`

### 10.2 内存管理
- 避免在渲染函数中创建大量临时对象
- 使用对象池复用复杂数据结构

## 11. 错误处理规范

### 11.1 参数校验
```javascript
function getParams() {
  return {
    count: Math.max(1, parseInt(document.getElementById('p-count').value) || 3),
    doorW: Math.max(400, parseInt(document.getElementById('p-door').value) || 600),
    // ... 其他参数 ...
  };
}
```

### 11.2 尺寸冲突警告
```javascript
function collectGuardWarnings(c) {
  const warnings = [];
  c.insufficientDoors.forEach((bad, i) => {
    if (bad) warnings.push(`${i + 1}间门<${c.minDoorW}`);
  });
  // ...
  return warnings;
}
```

## 12. 代码风格检查清单

在提交代码前，请确认：

- [ ] 函数命名符合规范（draw* / render* / compute*）
- [ ] 变量命名符合规范（常量 UPPER_SNAKE_CASE，变量 camelCase）
- [ ] Canvas 绘图使用 `ctx.save()` / `ctx.restore()` 配对
- [ ] 样式设置在 `ctx.save()` 之后
- [ ] 中文文本无拼写错误
- [ ] 尺寸单位使用 mm（中文显示）
- [ ] 参数对象使用小写下划线属性名
- [ ] 计算结果对象使用 camelCase 属性名
- [ ] 箭头函数体简洁时不使用花括号
- [ ] 字符串使用单引号或模板字符串
