# 第七周: 重学 JS (二)

## 表达式

语法树(tree) vs 优先级(Priority)

**_优先级会影响语法树的构成_**

### 运算符和表达式

> 以下优先级由高到低

- Member(成员)
  - a.b
  - a[b] // 运行时
  - foo`string`
  - super.b
  - super[b]
  - new.target
  - new Foo()
- New

  - new Foo

  ```js
  new a()(); // (new a())()
  new new a()(); // new (new a())
  ```

- Reference(引用类型)

  - Object
  - Key
  - delete
  - assign

  JS 运行时通过引用类型进行删除/赋值等写相关的操作

- Call

  - foo()
  - super()
  - foo().b
  - foo()[b]

  ```js
  // new (a()[b]) ? or (new a())[b] ?
  new a()[b]; // (new a())[b]
  // new a() 是 Member 类型高于 a()[b]的 Call 类型
  ```

- Left HandSide & Right HandSide

```js
a.b = c;
a + b = c; // error
```

- Update

  - a ++
  - a --
  - -- a
  - ++ a

- Unary(单目)
  - delete a.b
  - void foo()
  - typeof
  - - a
  - - a
  - ~ a
  - !a
  - await a
- Exponential
  - \*\* 右结合

```js
3 ** (2 ** 3);
// 等价于
3 ** (2 ** 3);
```

- Multiplication
  - \*
  - /
  - %
- Additive
  - \+
  - \-
- Shift
  - <<
  - \>>
  - \>>>
- Relationship
  - <
  - \>
  - <=
  - \>=
  - instanceof
  - in
- Equality
  - ==
  - !=
  - ===
  - !==
- Bitwise
  - & 与
  - ^ 异或
  - | 或
- Logical
  - &&
  - ||
- Conditional
  - ? :

### 类型转换

| -         | Number             | String              | Boolean   | Undefined | Null | Object | Symbol |
| --------- | ------------------ | ------------------- | --------- | --------- | ---- | ------ | ------ |
| Number    | -                  |                     | 0 false   | x         | x    | Boxing | x      |
| String    |                    | -                   | " " false | x         | x    | Boxing | x      |
| Boolean   | true 1 <br>false 0 | 'true'<br>'false'   | -         | x         | x    | Boxing | x      |
| Undefined | NaN                | 'Undefined'         | false     | -         | x    | x      | x      |
| Null      | 0                  | 'null'              | false     | -         | x    | x      | x      |
| Object    | valueOf            | valueOf<br>toString | true      | x         | x    | -      | x      |
| Symbol    | x                  | x                   | x         | x         | x    | Boxing | -      |

- Unboxing(拆箱)

  - ToPrimitive
  - toSting / valueOf
  - Symbol.toPrimitive

- Boxing

| 类型    | 对象                    | 值          |
| ------- | ----------------------- | ----------- |
| Number  | new Number(1)           | 1           |
| String  | new String('a')         | 'a'         |
| Boolean | new Boolean(true)       | true        |
| Symbol  | new Object(Symbol('a')) | Symbol('a') |

> 使用 `typeof` 区分是值还是对象

### 运行时相关概念

- [[type]]: normal, break, continue, return, throw
- [[value]]: 基本类型
- [[target]]: label

## JS 语句

### 简单&复合语句

- 简单语句
  - ExpressionStatement
  - EmptyStatement
  - DebuggerStatement
  - ThrowStatement
  - ContinueStatement
  - BreakStatement
  - ReturnStatement

- 复合语句
  - BlockStatement
  - IfStatement
  - SwitchStatement
  - IterationStatement
    - while()
    - do while()
    - for ( ; ; )
    - for ( in )
    - for ( of )
    - for await( of )
    - var
    - const / let
    - in
  - WithStatement
  - LabelledStatement
  - TryCatchStatement
    - try 里面`return`,`finally`还是会执行

### 声明

- FunctionDeclaration
  - function
- GeneratorDeclaration
  - function \*
- AsyncDeclaration
  - async function
- AsyncGeneratorDeclaration
  - async function \*
- VariableStatement
  - var
- ClassDeclaration
  - class
- LexicalDeclaration
  - const
  - let

### 预处理 (pre-process)

> 一段代码执行前,js 引擎对代码本身做一次处理

```js
var a = 2;
void (function () {
  //  var a; 相当于在这里定义
  a = 1;
  return;
  var a; // 变量提升
})();
console.log(a);
```
```js
var a = 2;
void (function () {
  a = 1;
  return;
  const a; // 也会预处理
})();
console.log(a);

// Uncaught SyntaxError: Missing initializer in const declaration
```

### 作用域

`var` 当前函数
`let`/`const`: `BlockStatement`

## 结构化

- 宏任务
- 微任务
- 函数调用
- 语句/声明
- 表达式
- 直接量/变量/this...

### 函数调用

执行上下文

- code evaluation state
- Function
- Script or Module
- Generator
- Realm
- LexicalEnvironment
- VariableEnvironment
