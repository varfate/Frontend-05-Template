const css = require('css');

class CssParser {
  rules = [];

  clearRules() {
    this.rules = [];
  }

  addCssRules(text) {
    let ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, 2));
    this.rules.push(...ast.stylesheet.rules);
  }

  /**
   * 获取优先级数组
   * @param {String} selector 选择器
   */
  specificity(selector) {
    // ['inline', 'id', 'class', 'tag'] 四种选择器的权值
    let p = Array(4).fill(0);
    let selectorParts = selector.split(' ');
    for (let selectorPart of selectorParts) {
      if (selectorPart[0] === '#') {
        p[1] += 1;
      } else if (selectorPart[0] === '.') {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    }
    return p;
  }

  /**
   * 比较两个优先级列表的高低
   * @param {Array of Number} oldPeriodArr 旧优先级
   * @param {Array of Number} newPeriodArr 新的优先级
   */
  compare(oldPeriodArr, newPeriodArr) {
    for (let i = 0; i < 4; i++) {
      // 优先级高德选择器不相等,就说明可以比较出选择器的优先级了
      if (oldPeriodArr[i] !== newPeriodArr[i]) {
        return oldPeriodArr[i] - newPeriodArr[i];
      }
    }
    return 0;
  }

  /**
   * 元素是否能够匹配选择器
   * @param {Element}} element 元素
   * @param {String} selector 选择器
   */
  match(element, selector) {
    if (!selector || !element.attributes) {
      return false;
    }
    // ID 选择器
    if (selector[0] === '#') {
      const id = selector.replace('#', '');
      return element.attributes.find(
        ({ name, value }) => name === 'id' && value === id
      );
    }
    // class 选择器
    if (selector[0] === '.') {
      const className = selector.replace('.', '');
      return element.attributes.find(
        ({ name, value }) =>
          name === 'class' && value.split(' ').includes(className)
      );
    }
    // 标签选择器
    return element.tagName === selector;
  }

  computeCss(element, stack) {
    // 获取父元素
    let elements = [...stack].reverse();
    for (let rule of this.rules) {
      // rule.selectors[0] = body div #myId
      // selectorParts = ['#myId',  'div', 'body']
      let selectorParts = rule.selectors[0].split(' ').reverse();
      if (!this.match(element, selectorParts[0])) {
        continue;
      }
      let j = 1;
      let matched = false;
      for (let i = 0; i < elements.length; i++) {
        if (this.match(elements[i], selectorParts[j])) {
          j++;
          matched = j === selectorParts.length;
          if (matched) break;
        }
      }
      // 匹配上
      if (matched) {
        let sp = this.specificity(rule.selectors[0]);
        let computedStyle = element.computedStyle;
        for (let declaration of rule.declarations) {
          const { property } = declaration;
          if (!computedStyle[property]) {
            computedStyle[property] = {};
          }
          if (
            !computedStyle[property].specificity || // 属性第一次出现
            this.compare(computedStyle[property].specificity, sp) < 0 // 新属性比旧属性的优先级高
          ) {
            computedStyle[property].specificity = sp;
            computedStyle[property].value = declaration.value;
          }
        }
        // console.log('Element', element, 'matched rule', rule);
      }
    }
    console.log(JSON.stringify(element.computedStyle, null, 2));
  }
}

module.exports = new CssParser();
