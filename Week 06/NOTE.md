# 语言组成

原子
表达式
语句
结构化
组织

## Grammar

- Literal
- Variable
- Keywords
- Whitespace
- Line Terminator

## Runtime

- [Types](#types)
- Execution Context

# Types

- **Number**
- **String**
- **Boolean**
- **Object**
- **Null**
- Undefined
- Symbol
- Bigint

## Number

- IEEE 754 Double Float

  - Sign (1) 符号
  - Exponent (11) 指数
  - Fraction (52) 精度

- Grammar
  - 十进制
    - 0
    - 0.
    - .2
    - 1e3
  - 八进制
    - `0` 开头
  - 十六进制
    - `0x` 开头
- 点运算陷阱
  - `0.toString()` => `SyntaxError`
  - 原因: `0.`被解析为 Number
  - 正确写法,加空格: `0. toString()`

## String

- 字符
- 码点
- 编码方式

- 字符集

  - ASCII
  - Unicode
  - UCS
  - GB
    - GB2312
    - GBK(GB13000)
    - GB18030
  - ISO-8859
  - BIG5

- Grammar
  - 双引号 `""`
  - 单引号 `''`
  - 反引号 ``

## Boolean

- true
- false

## Null & Undefined

- Null

  - 已定义,值为空
  - 关键字

- Undefined
  - 未定义
  - 不是关键字
  - 使用 void 0 代替

## Object

- 三要素

  - identifier 标识唯一性
  - state 状态描述对象
  - behavior 状态的改变既是行为

- 类

  - 描述对象的方式

- 原型

  - 更接近人类原始认知
  - 任何对象仅仅需要描述它自己与原型的区别即可

- 原型链

  - Object -> Property ->Property [[Property]] -> null
  - 保证了 `对象仅仅需要描述它自己与原型的区别即可`

- Key-Value

  - Key
    - string
    - Symbol
  - Value
    - Data Property
    - [[value]]
    - writable
    - enumerable
    - configurable
  - Accessor Property
    - get
    - set
    - enumerable
    - configurable

- Function
  - 带 [[call]] 的对象
  - 双方括号,私有方法

## 宿主对象和原生对象

- 区别：

  - 宿主对象：所有非本地对象都是宿主对象（host object），由 ECMAScript 实现的宿主环境提供的对象，可以理解为：在浏览器中 window 对象以及其下边所有的子对象(如 bom、dom 等等)，在 node 中是 globla 及其子对象，也包含自定义的类对象，
  - 原生对象：
    独立于宿主环境的 ECMAScript 实现提供的对象。与宿主无关，在 javascript（远景浏览器）、nodejs（node 平台）、jscript（ie 浏览器）、typescript（微软平台）等等中均有这些对象。简单来说，本地对象就是 ECMA-262 定义的类（引用类型）。在运行过程中动态创建的对象，需要 new

- 联系：
  - 本地对象与内置对象：原生包含内置，内置是原生的一个子集。
  - 宿主对象：内置对象的 Global 和宿主提供的一个全局对象，
  - 本地对象为 array obj regexp 等可以 new 实例化
  - 内置对象为 Global Math 等不可以实例化的
  - 宿主为宿主注入到全局的对象，如浏览器的 window 等
  - 宿主为浏览器自带的 document,window 等

## Symbol

- Object 的属性名
