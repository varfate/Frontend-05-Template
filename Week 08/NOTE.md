# 浏览器工作原理

## 有限状态机

- 每个状态都是一个机器
  - 在每一个机器里,我们可以做计算、存储、输出......
  - 所有的这些机器接受的输入是一致的
  - 状态机的每一个机器本身没有状态,如果我们用函数来表示的话,它应该是纯函数(无副作用)
- 每个机器知道下一个状态
  - 每个机器都有确定的下一个状态(Moore)
  - 每个机器根据输入决定下一个状态(Mealy)

## HTTP

- ISO-OSI 七层网络模型
  - 应用
  - 表示
  - 会话
  - 传输
  - 网络
  - 数据链路
  - 物理层
- TCP & IP
  - 流
  - 端口
  - require('net')
  - 包
  - IP地址
  - libnet/libpcap
