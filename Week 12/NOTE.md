# CSS

## 盒

- 标签/元素/盒

  - HTML 代码中可以书写开始`标签`，结束`标签` ，和自封闭`标签`
  - 一对起止`标签`，表示一个`元素`
  - DOM 树中存储的是`元素`和其它类型的节点（Node）
  - CSS 选择器选中的是`元素`
  - CSS 选择器选中的`元素`，在排版时可能产生多个`盒`
  - 排版和渲染的基本单位是`盒`

- 盒模型

  - width,height
  - border-width
  - padding
  - margin

## 正常流

- IFC:

  - 行级格式化上下文
  - inline-level-formatting-context

- BFC:

  - 块级格式化上下文
  - block-level-formatting-context

- 边距折叠

  - 只会发生在正常流的 BFC 中

- over-flow: hidden
  - 创建新的 BFC

## FLEX

- 收集`盒`进`行`
- 计算`盒`在主轴方向的排布
- 计算`盒`在交叉轴方向的排布

## 动画

- Animation

  - `@keyframes` 定义动画
  - animation 使用
    - animation-name 名称
    - animation-duration 时长
    - animation-timing-function 时间曲线
    - animation-delay 开始前的延迟
    - animation-iteration-count 播放次数
    - animation-direction 方向

- Transition
  - transition-property 要变换的属性
  - transition-duration 变换的时长
  - transition-timing-function 时间曲线
  - transion-delay 延迟
- 时间曲线
  - https://cubic-bezier.com/#.17,.67,.83,.67

## 颜色

- 两种标准
  - HSL: w3c 采用此标准
  - HSV

## 绘制

- 几何图形
  - border
  - box-shadow
  - border-radius
- 文字
  - font
  - text-decoration
- 位图
  - background-image
