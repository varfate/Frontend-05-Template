# LL算法构建AST 

## 定义

LL算法: 从左到右扫描,从左到右规约

## 四则运算

### 元素

1. TokenNumber: 1 2 3 4 5 6 7 8 9 0 组合
2. Operator: + - * /
3. Whitespace
4. LineTerminator
 
***EOF***: End Of File

### RegExp.exec

1. 没有匹配项，返回 null
2. 找到了匹配的文本，则返回一个结果数组。
  - 此数组的第 0 个元素是与正则表达式相匹配的文本
  - 第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推
  - 除了数组元素和 length 属性之外，exec() 方法还返回两个属性。index 属性声明的是匹配文本的第一个字符的位置。input 属性则存放的是被检索的字符串 string。我们可以看得出，在调用非全局的 RegExp 对象的 exec() 方法时，返回的数组与调用方法 String.match() 返回的数组是相同的。
  - 当 RegExpObject 是一个全局正则表达式时，exec() 的行为就稍微复杂一些。它会在 RegExpObject 的 lastIndex 属性指定的字符处开始检索字符串 string。当 exec() 找到了与表达式相匹配的文本时，在匹配后，它将把 RegExpObject 的 lastIndex 属性设置为匹配文本的最后一个字符的下一个位置。这就是说，您可以通过反复调用 exec() 方法来遍历字符串中的所有匹配文本。当 exec() 再也找不到匹配的文本时，它将返回 null，并把 lastIndex 属性重置为 0。

## 表达式

### Expression

  1. 处理 `EOF`
  2. 调用 `AdditiveExpression`

### AdditiveExpression

  1. 处理 `+` & `-`
  2. 调用 `MultipleExpression`

### MultipleExpression
  1. 处理 `*` & `/`
  2. 处理 `Number`
