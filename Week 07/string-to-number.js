const digits = '0123456789ABCDEF';
const digitsMap = new Map();
const stringToNumber = (string) => {
  digits.split('').forEach((char, i) => {
    digitsMap.set(char, i);
  });
  const prefixes = {
    8: '0',
    16: '0x',
  };

  let radix = 10; // 默认10进制
  let str = string.toString().trim().toUpperCase();
  if (str.substring(0, 2) === prefixes[16].toUpperCase()) {
    radix = 16;
    str = str.substring(2);
  } else if (str[0] === prefixes[8]) {
    radix = 8;
    str = str.substring(1);
  }
  const len = str.length;
  let result = 0;

  for (let i = 0; i < len; i++) {
    const num = digitsMap.get(str[i]);
    result += num * radix ** (len - i - 1);
  }
  return result;
};

// test
console.log(stringToNumber(' 0x1314abF'));
console.log(stringToNumber('01314'));
console.log(stringToNumber('123'));
