const kmp = (source, pattern) => {
  const table = Array(pattern.length).fill(0);
  {
    let i = 1, // pattern 索引
      j = 0; // 已重复的个数
    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++;
        j++;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          i++;
        }
      }
    }
  }

  {
    let i = 0,
      j = 0;
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        i++;
        j++;
      } else {
        // 回退
        if (j > 0) {
          j = table[i];
        } else {
          i++;
        }
      }
      // 模式串到头了
      if (j === pattern.length) {
        return true;
      }
    }
    return false;
  }
};

console.log(kmp('Hello', 'll'));
console.log(kmp('abcdabce', 'cda'));
console.log(kmp('abcedadad', 'ab'));
console.log(kmp('123987', '0'));
