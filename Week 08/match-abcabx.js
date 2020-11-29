// abcabx

const match = (str) => {
  let state = start
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

const start = (c) => {
  if (c === 'a') {
    return findA1
  }
  return start;
}

const end = () => {
  return end;
};


const findA1 = (c) => {
  if (c==='b') {
    return findB1
  }
  return start(c);
}

const findB1 = (c) => {
  if (c === 'c') {
    return findC
  }
  return start(c);
}

const findC = (c) => {
  if (c === 'a') {
    return findA2
  }
  return start(c);
}

const findA2 = (c) => {
  if (c === 'b') {
    return findB2
  }
  return start(c);
}

const findB2 = (c) => {
  if (c === 'x') {
    return end
  }
  return findB1(c)
}

console.log(match('abcabcabx'));