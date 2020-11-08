/**
 * 优化版
 * 处理对象嵌套的情况
 */
const callbacksMap = new Map();
const reactivities = new Map();

let usedReactivities = [];

const obj = {
  a: { b: 'a.b' },
  b: { b: 'a.b' },
  c: 'c',
};

const effect = (callback) => {
  usedReactivities = [];
  // 1. effect 执行回调
  callback();
  // push callback 到 [target, [prop, [callback0, callback1...]]]
  for (let reactivity of usedReactivities) {
    const [target, prop] = reactivity;
    if (!callbacksMap.has(target)) {
      callbacksMap.set(target, new Map());
    }
    if (!callbacksMap.get(target).has(prop)) {
      callbacksMap.get(target).set(prop, []);
    }
    callbacksMap.get(target).get(prop).push(callback);
  }
};

const reactive = (target) => {
  if (reactivities.has(target)) {
    return reactivities.get(target)
  }
  const proxy = new Proxy(target, {
    set(target, prop, val) {
      target[prop] = val;
      // 4. po[prop] 赋值的时候, 执行 proxy set, 循环 [callback0, callback1...] 并执行
      const callbacks =
        callbacksMap.get(target) && callbacksMap.get(target).get(prop);
      if (callbacks) {
        for (let callback of callbacks) {
          callback();
        }
      }
    },
    get(target, prop) {
      // 2. proxy 执行 po[prop].get, push 对象和属性 到 usedReactivities
      usedReactivities.push([target, prop]);
      if (typeof target[prop] === 'object') {
        return reactive(target[prop]);
      }
      return target[prop];
    },
  });
  reactivities.set(target, proxy);
  return proxy;
};

const po = reactive(obj);

effect(() => {
  console.log('po.a.b');
  console.log(po.a.b);
});
effect(() => {
  console.log('po.b.b');
  console.log(po.b.b);
});

console.log(callbacksMap);

po.a.b = 'aa.bb';
po.b.b = 'aa.bb';

console.log(po);
