/**
 * 预处理style
 * @param {Element} element 元素
 */
const getStyle = (element) => {
  const style = element.style || {};
  for (let prop in element.computedStyle) {
    style[prop] = element.computedStyle[prop].value;

    if (style[prop].toString().match(/px$/)) {
      style[prop] = parseInt(style[prop]);
    } else if (style[prop].toString().match(/^[0-9\.]+$/)) {
      style[prop] = parseInt(style[prop]);
    }
  }
  element.style = style;
  return style;
};

const layout = (element) => {
  if (!element.computedStyle) return;
  let elementStyle = getStyle(element);
  // 只处理 flex
  if (elementStyle.display !== 'flex') return;

  // 过滤节点(去除文本节点)
  let items = element.children.filter((el) => el.type === 'element');

  // 支持 order 属性
  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  let style = elementStyle;

  ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  // 转化 auto -> default value
  const defaultValues = {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    alignContent: 'stretch',
  };
  for (let prop in defaultValues) {
    if (!style[prop] || style[prop] === 'auto') {
      style[prop] = defaultValues[prop];
    }
  }

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexWrap == 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let flexLine = [];
  let flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);

    let isAutoMainSize = false;
    if (!style[mainSize]) {
      elementStyle[mainSize] = 0;
    }
    if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
      elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      isAutoMainSize = true;
    }

    if (!itemStyle[mainSize]) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (mainSpace[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = mainSpace[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
    }
    if (item[crossSize] != null) {
      crossSpace = Math.max(crossSpace, item[crossSize]);
    }
    mainSpace -= itemStyle[mainSize];
  }

  flexLine.mainSpace = mainSpace;

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] != null ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainSpace;

    for (let i = 0; i < item.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((items) => {
      let mainSpace = items.mainSpace;
      let flexTotal = 0;

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        if (itemStyle.flex !== null) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      if (flexTotal > 0) {
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }

          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        let currentMain, step;
        switch (style.justifyContent) {
          case 'flex-start': {
            currentMain = mainBase;
            step = 0;
            break;
          }
          case 'flex-end': {
            currentMain = mainSpace * mainSign + mainBase;
            step = 0;
            break;
          }
          case 'center': {
            currentMain = (mainBase / 2) * mainSign + mainBase;
            step = 0;
            break;
          }
          case 'space-between': {
            step = (mainSpace / (item.length - 1)) * mainSign;
            currentMain = mainBase;
            break;
          }
          case 'space-around': {
            step = (mainSpace / item.length) * mainSign;
            currentMain = step / 2 + mainBase;
            break;
          }
        }

        for (let i = 0; i < item.length; i++) {
          let item = item[i];
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainENd] + step;
        }
      }
    });
  }

  // 计算交叉轴
  let crossSpace;
  if (!state[crossSpace]) {
    crossSpace = 0;
    elementStyle[crossSpace] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] =
        elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  let step;

  switch (style.alignContent) {
    case 'flex-start': {
      crossBase += 0;
      step = 0;
      break;
    }
    case 'flex-end': {
      crossBase += crossSign * crossSpace;
      step = 0;
      break;
    }
    case 'center': {
      crossBase += (crossSign * crossSpace) / 2;
      step = 0;
      break;
    }
    case 'space-between': {
      crossBase += 0;
      step = crossSpace / (flexLines.length - 1);
      break;
    }
    case 'space-around': {
      step = crossSpace / flexLines.length;
      crossBase += (crossSign * step) / 2;
      break;
    }
    case 'stretch': {
      crossBase = 0;
      step = 0;
      break;
    }
  }

  flexLines.forEach((items) => {
    let lineCrossSize =
      style.alignContent === 'stretch'
        ? items.crossSpace + crossSpace / flexLines.length
        : item.crossSpace;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      let align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] == null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }

      switch (align) {
        case 'flex-start': {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          break;
        }
        case 'flex-end': {
          itemStyle[crossStart] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossEnd] =
            itemStyle[crossStart] - crossSign * itemStyle[crossSize];
          break;
        }
        case 'center': {
          itemStyle[crossStart] =
            crossBase +
            (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          break;
        }
        case 'stretch': {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            crossBase +
            crossSign *
              (itemStyle[crossSize] != null
                ? itemStyle[crossSize]
                : lineCrossSize);
          itemStyle[crossSize] =
            crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
          break;
        }
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
};

module.exports = layout;
