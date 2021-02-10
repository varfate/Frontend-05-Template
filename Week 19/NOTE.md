# 发布系统

- 发布工具

- 发布服务

  - 把本地文件上传到远程服务器
  - node_modules 也上传上去,防止因版本同步导致不可预估的错误,也可使用 package-lock.json

- 授权
  - 跳转到授权页,得到授权码 `code`
  - `code` + `client_id` + `client_secret` 获取 `token`,发送到工具
  - 工具点击发布,携带 `token`
  - server 端验证 token
