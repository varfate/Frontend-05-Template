import assert from 'assert';
import parseHtml from '../src/parser';

describe('parse html:', () => {
  it('<a></a>', () => {
    const tree = parseHtml('<a></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="#"></a>', () => {
    const tree = parseHtml('<a href="#"></a>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'href');
    assert.strictEqual(tree.attributes[0].value, '#');
  });

  it('<a href></a>', () => {
    const tree = parseHtml('<a href ></a>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'href');
    assert.strictEqual(tree.attributes[0].value, '');
  });

  it('<a href id></a>', () => {
    const tree = parseHtml('<a href id ></a>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'href');
    assert.strictEqual(tree.attributes[0].value, '');
  });

  it('<a href="#" id></a>', () => {
    const tree = parseHtml('<a href="#" id ></a>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'href');
    assert.strictEqual(tree.attributes[0].value, '#');
  });

  it('<a id=abc></a>', () => {
    const tree = parseHtml('<a id=abc></a>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'id');
    assert.strictEqual(tree.attributes[0].value, 'abc');
  });

  it('<a id=abc/>', () => {
    const tree = parseHtml('<a id=abc/>').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'id');
    assert.strictEqual(tree.attributes[0].value, 'abc');
  });

  it('<a id=abc />', () => {
    const tree = parseHtml('<a id=abc />').children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'id');
    assert.strictEqual(tree.attributes[0].value, 'abc');
  });

  it("<a id='abc' />", () => {
    const tree = parseHtml("<a id='abc' />").children[0];
    assert.strictEqual(tree.children.length, 0);
    assert.strictEqual(tree.attributes[0].name, 'id');
    assert.strictEqual(tree.attributes[0].value, 'abc');
  });

  it('<a/>', () => {
    const tree = parseHtml('<a/>').children[0];
    assert.strictEqual(tree.children.length, 0);
  });

  it('<abc>123</abc>', () => {
    const tree = parseHtml('<abc>123</abc>').children[0];
    assert.strictEqual(tree.children.length, 3);
  });

  it('<a>123</b>', () => {
    assert.throws(
      () => {
        parseHtml('<a>123</b>');
      },
      Error,
      'Tag start end does not match!'
    );
  });

  it('<A /> uppercase', () => {
    const tree = parseHtml('<A />').children[0];
    assert.strictEqual(tree.children.length, 0);
  });
});
