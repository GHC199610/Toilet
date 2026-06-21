# 卫生间隔断自动设计系统技术架构规范

版本：V1.0

---

# 系统定位

本系统不是CAD软件。

不是画图工具。

而是：

参数驱动的工程设计系统

包含：

规则引擎

计算引擎

布局引擎

绘图引擎

材料引擎

导出引擎

---

# 核心架构原则

## 原则1

禁止模块之间直接依赖实现细节。

必须通过统一数据模型通信。

---

## 原则2

禁止跨层调用。

UI不能直接调用计算引擎内部函数。

绘图不能直接修改规则。

材料统计不能重新计算尺寸。

---

## 原则3

所有数据必须唯一来源（Single Source of Truth）

---

# 系统分层结构

UI层

↓

应用层

↓

领域层

↓

引擎层

↓

输出层

↓

存储层

---

# UI层

职责：

仅负责展示与交互

---

禁止：

计算

规则判断

绘图逻辑

材料统计

---

# 应用层

职责：

流程编排层

---

负责：

创建项目

加载项目

保存项目

导出流程调用

---

禁止：

业务计算

规则判断

---

# 领域层（Domain Layer）

核心业务定义层

---

来源：

BATHROOM_PARTITION_DOMAIN_RULES.md

---

包含：

隔断规则

门规则

墙规则

结构规则

材料规则

---

禁止：

UI逻辑

绘图逻辑

数据库逻辑

---

# 引擎层（Engine Layer）

系统核心计算层

---

包含：

Rule Engine

Calculation Engine

Layout Engine

Validation Engine

Drawing Engine

PDF Engine

---

# Rule Engine

作用：

解析行业规则

输出设计约束

---

输入：

用户数据 + 规则库(看用户是否需要)

---

输出：

约束条件

---

# Calculation Engine

作用：

尺寸计算

---

输入：

结构参数

总长

门缝

门宽

边距

---

输出：

精确尺寸模型

---

禁止：

绘图

布局优化

---

# Layout Engine

作用：

真实A4纸张空间布局优化

---

输入：

规则 + 尺寸模型

---

输出：

布局方案（多个可选）

---

# Validation Engine

作用：

全局校验

---

检查：

净宽

门冲突

结构冲突

规范冲突

---

# Drawing Engine

作用：

生成工程图数据

---

输入：

布局结果

---

输出：

图形数据（非图片）

---

禁止：

参与计算

---

# Material Engine

作用：

材料统计

---

输入：

布局结果

---

输出：

BOM清单

---

禁止重新计算结构

---

# PDF Engine

作用：

工程文件输出

---

输入：

图形数据

材料数据

---

输出：

PDF / 图纸文件

---

# 数据流规范（强制）

唯一允许流程：

UI输入

↓

Validation Engine

↓

Rule Engine

↓

Calculation Engine

↓

Layout Engine

↓

Validation Engine

↓

Drawing Engine

↓

PDF Engine

---

禁止跳层调用

---

# 数据模型（核心统一结构）

Project

├── Space（空间）
├── Wall（墙体）
├── Partition（隔断）
├── Door（门）
├── Column（柱）(暂时不添加该项)
├── Pipe（管道）(暂时不添加该项)
├── Layout（布局）
├── Drawing（图纸）
└── MaterialList（材料）(暂时不添加该项)

---

所有模块必须共享该模型

禁止各模块自建结构

---

# 状态管理规范

必须统一状态中心

例如：

Zustand / Redux / Pinia

只能选一个

---

禁止：

多个状态源

重复存储数据

---

# 绘图规范

必须采用：

参数化绘图（Parametric Drawing）

---

禁止：

绝对坐标硬编码绘图

---

错误示例：

drawLine(0,0,100,0)

---

正确示例：

drawLine(wall.start, wall.end)

---

# 图层系统

必须分层：

Wall_Layer

Partition_Layer

Door_Layer

Dimension_Layer

Text_Layer

Material_Layer(暂时不添加该项)

间数组层

---

每层独立渲染

---

# PDF系统

支持：

A4 / A3

横版 / 竖版

---

自动处理：

缩放

分页

标题栏

编号

图例

---

# 插件扩展机制(暂时不添加该项)

必须支持：

新板材

新五金

新规则

新导出格式

---

禁止修改核心结构

---

# 测试规范

必须覆盖：

Rule Engine

Calculation Engine

Layout Engine

Validation Engine

---

测试类型：

Unit Test

Integration Test

E2E Test

---

覆盖率：

≥80%

核心模块：

≥95%

---

# 性能要求

100隔间方案

生成时间：

≤3秒

---

# AI开发约束

任何修改必须评估：

计算影响

绘图影响

材料影响(暂时不添加该项)

导出影响

---

禁止：

局部优化导致系统崩溃

---

# 最终目标

系统达到：

专业卫生间隔断设计师水平

自动完成：

输入参数

↓

自动设计

↓

自动优化

↓

自动计算

↓

自动绘图

↓

自动出图

↓

自动材料清单

↓

直接生产级输出
