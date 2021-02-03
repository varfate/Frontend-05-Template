# 单元测试

- `mocha`
  - node 本身不支持一些新语法,需要 `babel` 提供翻译
  - `@babel/register` 在 `runtime` 时翻译
    - `@babel/core` babel 核心库
    - `@babel/preset-env` 配置 (`options config`)
- `nyc`
  - 检测单元测试覆盖率
  - `@istanbuljs/nyc-config-babel`
    - `babel` 编译后,会造成覆盖率检测不准确,使用此插件解决
