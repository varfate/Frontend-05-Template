/**
 * 轮播图组件
 */

import React, { cloneElement, useMemo, useState, useEffect } from 'react';
import update from 'immutability-helper';
import classNames from 'classnames';

import styles from './carousel.less';

const copyKeyEnd = Symbol('copy-child-end');
const copyKeyStart = Symbol('copy-child-start');

const WIDTH = 500;

let startX = 0; // mouse down start x
let posX = -WIDTH; // 当前元素所处的位置
let isMouseDown = false; // 是否已点按
let moveX = 0; // 鼠标移动的距离

/**
 * 获取鼠标移动距离
 * @param {MouseEvent} e 鼠标事件
 */
const getMoveX = (e) => {
  let _moveX = e.clientX - startX;
  // 最大移动视口的宽度
  if (Math.abs(_moveX) >= WIDTH) {
    _moveX = (_moveX > 0 ? 1 : -1) * WIDTH;
  }
  return _moveX;
};

  /**
   * 处理鼠标点按开始时的事件
   * 改变鼠标状态
   * 获取开始坐标
   * @param {MouseEvent} e 鼠标事件
   */
  const handleMouseDown = (e) => {
    e.preventDefault();
    isMouseDown = true;
    startX = e.clientX;
  };

const Carousel = (props) => {
  const { time = 3000 } = props;
  // children 个数
  const count = props.children.length;
  // 当前展示的内容的 index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [style, setStyle] = useState({});

  // 定时
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCurrentIndex((i) => (i + 1) % count);
  //   }, time);
  //   return () => clearTimeout(timer);
  // }, [currentIndex]);

  // 监听 currentIndex, 使轮播图滑动到指定位置
  useEffect(() => {
    if (isMouseDown) return;

    // 右滑动到达边界元素(最后一个)
    if (moveX > 0 && currentIndex === count - 1) {
      posX = -(count + 1) * WIDTH + moveX;
      setStyle({
        transition: 'none',
        transform: `translateX(${posX}px)`,
      });
      // 左滑动到达边界元素(第一个)
    } else if (moveX < 0 && currentIndex === 0) {
      posX = moveX;
      setStyle({
        transition: 'none',
        transform: `translateX(${posX}px)`,
      });
    }
    // 延迟执行,防止两次 setStyle 只执行一次渲染
    setTimeout(() => {
      posX = -(1 + currentIndex) * WIDTH;
      setStyle({
        transition: '',
        transform: `translateX(${posX}px)`,
      });
    }, 16);
  }, [currentIndex]);

  // 手势
  useEffect(() => {
    /**
     * 轮播图随鼠标滑动
     * @param {MouseEvent} e 鼠标move事件
     */
    const handMouseMove = (e) => {
      if (!isMouseDown) return;
      setStyle({
        transition: 'none',
        transform: `translateX(${getMoveX(e) + posX}px)`,
      });
    };

    /**
     * 修改 currentIndex
     * 记录当前位置
     * @param {MouseEvent} e 鼠标up事件
     */
    const handleMouseUp = (e) => {
      if (!isMouseDown) return;
      moveX = getMoveX(e);
      posX += moveX;
      setCurrentIndex((i) => {
        if (moveX === 0) return i;
        return (moveX < 0 ? i + 1 : i - 1 + count) % count;
      });

      isMouseDown = false;
    };

    document.addEventListener('mousemove', handMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handMouseMove);
      document.removeEventListener('mousemove', handleMouseUp);
    };
  }, []);

  // 合并样式,复制首尾元素
  let children = useMemo(() => {
    const newChildren = props.children.map((slider, index) => {
      return update(slider, {
        props: {
          className: {
            $apply: (name = '') => classNames(name, styles.slider),
          },
        },
      });
    });
    return [
      cloneElement({ ...newChildren[count - 1], key: copyKeyEnd }),
      ...newChildren,
      cloneElement({ ...newChildren[0], key: copyKeyStart }),
    ];
  }, [currentIndex]);

  return (
    <div
      className={classNames(props.className)}
      style={{ ...props.style }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.container} style={style}>
        {children}
      </div>
    </div>
  );
};

export default Carousel;
