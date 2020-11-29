const matchA = (str) => {
  for (let c of str) {
    if (c === 'a') return true;
  }
  return false;
};
console.log(matchA('abcde'));

const matchAB = (str) => {
  let findA = false;
  for (let c of str) {
    if (c === 'a') {
      findA = true;
    } else if (findA && c === 'b') {
      return true;
    } else {
      findA = false;
    }
  }
  return false;
};
console.log(matchAB('abcde'));
console.log(matchAB('acbde'));

const matchABCDE = (str) => {
  let findA = false;
  let findB = false;
  let findC = false;
  let findD = false;
  for (let c of str) {
    if (c === 'a') {
      findA = true;
    } else if (findA && c === 'b') {
      findB = true;
    } else if (findB && c === 'c') {
      findC = true;
    } else if (findC && c === 'd') {
      findD = true;
    } else if (findD && c === 'e') {
      return true;
    } else {
      findA = false;
      findB = false;
      findC = false;
      findD = false;
    }
  }
  return false;
};
console.log(matchAB('abcde'));
console.log(matchAB('acbde'));
