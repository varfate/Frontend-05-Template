const numberToString = (number, radix) => {
  const digits = '0123456789ABCDEF';
  const prefixes = {
    8: '0',
    16: '0x',
  };
  if (!prefixes[radix]) {
    return '';
  }
  const arr = [];
  let num = number;
  let rem;
  while (num > 0) {
    rem = Math.floor(num % radix);
    arr.push(rem);
    num = Math.floor(num / radix);
  }
  let result = prefixes[radix];
  for (let i = arr.length - 1; i >= 0; i--) {
    result += digits[arr[i]];
  }
  return result;
};

// test
console.log(numberToString(1314, 2));
console.log(numberToString(1314, 8));
console.log(numberToString(1314, 16));
console.log(numberToString(1314, 20));
