const EOF = Symbol('end of file');

const TAG_NAME_REG = /^[a-zA-Z]$/;
const BLANK_REG = /^[ \t\n\f]$/;

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [];

function init() {
  currentToken = null;
  currentAttribute = null;
  currentTextNode = null;

  stack = [{ type: 'document', children: [] }];
}

// 构造token内容
function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
      computedStyle: {},
    };
    element.tagName = token.tagName;
    for (let [name, value] of Object.entries(token.props)) {
      element.attributes.push({
        name,
        value,
      });
    }

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end does not match!');
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
    }
    top.children.push(currentTextNode);
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  }
  if (c === EOF) {
    emit({
      type: 'EOF',
    });
    return;
  }
  emit({
    type: 'text',
    content: c,
  });
  return data;
}

// 起始标签
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  }
  if (c.match(TAG_NAME_REG)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
      props: {},
    };
    return tagName(c);
  }
}

// 结束标签
function endTagOpen(c) {
  if (c.match(TAG_NAME_REG)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
      props: {},
    };
    return tagName(c);
  }
}

// 标签名称
function tagName(c) {
  if (c.match(BLANK_REG)) {
    return beforeAttributeName;
  }
  if (c === '/') {
    return selfClosingStartTag;
  }
  if (c.match(TAG_NAME_REG)) {
    currentToken.tagName += c.toLowerCase();
    return tagName;
  }
  // 当前标签结束
  if (c === '>') {
    emit(currentToken);
    // 解析下一个标签
    return data;
  }
}

// 属性名
function beforeAttributeName(c) {
  if (c.match(BLANK_REG)) {
    return beforeAttributeName;
  }
  if (['/', '>', EOF].includes(c)) {
    return afterAttributeName(c);
  }
  if (c === '=') {
    return;
  }
  currentAttribute = {
    name: '',
    value: '',
  };
  return attributeName(c);
}

function afterAttributeName(c) {
  if (c.match(BLANK_REG)) {
    return afterAttributeName;
  }
  if (c === '/') {
    return selfClosingStartTag;
  }
  if (c === '=') {
    return beforeAttributeValue;
  }
  if (c === '>') {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  currentToken.props[currentAttribute.name] = currentAttribute.value;
  currentAttribute = {
    name: '',
    value: '',
  };
  return attributeName(c);
}

function attributeName(c) {
  if (c.match(BLANK_REG)) {
    return afterAttributeName;
  }
  if (c === '=') {
    return beforeAttributeValue;
  }
  if (c === '\u0000') {
    return;
  }
  if (['"', "'", '<'].includes(c)) {
    return;
  }
  currentAttribute.name += c;
  return attributeName;
}

function beforeAttributeValue(c) {
  if (c.match(BLANK_REG) || ['/', '>', EOF].includes(c)) {
    return beforeAttributeValue(c);
  }
  if (c === '"') {
    return doubleQuotedAttributeValue;
  }
  if (c == "'") {
    return singleQuotedAttributeValue;
  }
  if (c === '>') {
    return;
  }
  return unquotedAttributeValue(c);
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }
  if (c === '\u0000') {
    return;
  }
  currentAttribute.value += c;
  return doubleQuotedAttributeValue;
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }
  if (c === '\u0000') {
    return;
  }
  currentAttribute.value += c;
  return singleQuotedAttributeValue;
}

function afterQuotedAttributeValue(c) {
  if (c.match(BLANK_REG)) {
    return beforeAttributeName;
  }
  if (c === '/') {
    return selfClosingStartTag;
  }
  if (c === '>') {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  throw new Error(`unexpected character "${c}"`);
}

function unquotedAttributeValue(c) {
  if (c.match(BLANK_REG)) {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  }
  if (c === '/') {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  }
  if (c === '>') {
    currentToken.props[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
  if (c === '\u0000') {
    return;
  }
  if (['"', "'", '<', '=', '`'].includes(c)) {
    return;
  }
  currentAttribute.value += c;
  return unquotedAttributeValue;
}

// 自封闭标签
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  }
}

function parseHtml(html) {
  init();
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}

export default parseHtml;
