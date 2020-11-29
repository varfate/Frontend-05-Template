const match = (str) => {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
};

const start = (c) => {
  if (c === 'a') {
    return findA;
  }
  return start;
};

const end = () => {
  return end;
};

const findA = (c) => {
  if (c === 'b') {
    return findB;
  }
  return start(c);
};

const findB = (c) => {
  if (c === 'c') {
    return findC;
  }
  return start(c);
};

const findC = (c) => {
  if (c === 'd') {
    return findD;
  }
  return start(c);
};

const findD = (c) => {
  if (c === 'e') {
    return findE;
  }
  return start(c);
};

const findE = (c) => {
  if (c === 'f') {
    return end;
  }
  return start(c);
};

console.log(match('I am abcdef'));
console.log(match('I am abcd'));
console.log(match('I am ababcdef'));
console.log(match('I am ababc'));
