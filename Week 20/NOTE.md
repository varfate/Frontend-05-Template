# 持续集成

commit -> pre commit hook -> eslint / check dom ... -> success or error

- git hook
  - .git/hooks/
  - 使用 `husky`
- eslint + prettier
  - 检查代码错误,统一代码风格
- 无头浏览器
  - 检查 `dom`
  - 使用 `puppeteer`
