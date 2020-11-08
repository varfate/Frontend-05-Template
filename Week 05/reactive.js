/**
 * 1. effect 执行回调, 访问 po 的属性
 * 2. proxy 执行 po[prop].get, push 对象和属性 到 usedReactivities
 * 3. push callback 到 [target, [prop, [callback0, callback1...]]]
 * 4. po[prop] 赋值的时候, 执行 proxy set, 循环 [callback0, callback1...] 并执行
 */
const callbacksMap = new Map();
let usedReactivities = [];

const obj = {
  a: 'a',
  b: 'b',
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
  return new Proxy(target, {
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
      return target[prop];
    },
  });
};

const po = reactive(obj);

effect(() => {
  console.log('po.a: effect 1');
  console.log(po.a);
});

effect(() => {
  console.log('po.a: effect 2');
  console.log(po.a);
});

effect(() => {
  console.log('po.a & po.b');
  console.log(po.a, po.b);
});

po.a = 'aa';
po.b = 'bb';
po.c = 'cc';

console.log(po);
