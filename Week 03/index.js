// 匹配元素的正则
const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
// 元素对应名称
const dic = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

function* tokenizer(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    lastIndex = reg.lastIndex;
    result = reg.exec(source);
    if (!result) break;
    // 如果匹配出来的长度与前进的长度不一致, 表示有不认识的字符,实际应 throw error
    if (reg.lastIndex - lastIndex < result[0].length) break;
    const token = {
      type: '',
      value: result[0],
    };
    for (let i = 1; i <= dic.length; i++) {
      if (result[i]) {
        token.type = dic[i - 1];
      }
    }
    yield token;
  }
  yield {
    type: 'EOF',
    value: null,
  };
}

// array of token
const source = [];

for (let token of tokenizer('1 + 2 - 3 * 4 / 5')) {
  if (!['Whitespace', 'LineTerminator'].includes(token.type)) {
    source.push(token);
  }
}

function Expression(source) {
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
    const node = {
      type: 'AdditiveExpression',
      children: [source.shift(), source.shift()]
    }
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression(source) {
  if (source[0].type === 'MultipleExpression') {
    const node = {
      type: 'AdditiveExpression',
      children: [],
    };
    source[0] = node;
    return AdditiveExpression(source);
  }

  if (source[0].type === 'AdditiveExpression' && source[1]) {
    if (source[1].type === '+') {
      const node = {
        type: 'AdditiveExpression',
        operator: '+',
        children: [],
      };
      node.children.push(source.shift()); // node
      node.children.push(source.shift()); // operator
      MultipleExpression(source); // 数字是特殊的乘法表达式,node.children push 数字前, 先转换为乘法表达式
      node.children.push(source.shift()); // MultipleExpression
      source.unshift(node);
      return AdditiveExpression(source);
    }
    if (source[1].type === '-') {
      const node = {
        type: 'AdditiveExpression',
        operator: '-',
        children: [],
      };
      node.children.push(source.shift()); // node
      node.children.push(source.shift()); // operator
      MultipleExpression(source); // 数字是特殊的乘法表达式,node.children push 数字前, 先转换为乘法表达式
      node.children.push(source.shift()); // MultipleExpression
      source.unshift(node);
      return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression') {
      return source[0];
    }
  }
  // 四则运算的最后一个数字,处理为 MultipleExpression
  MultipleExpression(source);
  return AdditiveExpression(source);
}

function MultipleExpression(source) {
  if (source[0].type === 'Number') {
    const node = {
      type: 'MultipleExpression',
      children: [source[0]],
    };
    source[0] = node;
    return MultipleExpression(source);
  }

  if (source[0].type === 'MultipleExpression' && source[1]) {
    if (source[1].type === '*') {
      const node = {
        type: 'MultipleExpression',
        operator: '*',
        children: [],
      };
      node.children.push(source.shift()); // node
      node.children.push(source.shift()); // operator
      node.children.push(source.shift()); // number
      source.unshift(node);
      return MultipleExpression(source);
    }
    if (source[1].type === '/') {
      const node = {
        type: 'MultipleExpression',
        operator: '/',
        children: [],
      };
      node.children.push(source.shift());
      node.children.push(source.shift());
      node.children.push(source.shift());
      source.unshift(node);
      return MultipleExpression(source);
    }
  }
  if (source[0].type === 'MultipleExpression') {
    return source[0];
  }
  return MultipleExpression(source);
}

Expression(source);

console.log(source);
