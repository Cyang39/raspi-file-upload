吃灰的树莓派2B跑 nextcloud 卡得不行，反正就在移动硬盘上存存文件，没太大需求，就自己写一个上传文件的 web 程序。

没有数据库，没有用户验证，在局域网内用。

## 用法
```bash
git clone <这个仓库>
cd <这个仓库>
npm i # 或者用yarn
node index.js # 建议用 pm2 后台运行
# 默认的路径是运行路径，可以用 --path=<路径> 指定
# 默认的端口是 8080，可以用 --port=<端口> 指定
```

## Todo
### 功能
 - [ ] 上传重名文件提示
 - [ ] 路径不存在提示
 - [x] 静态资源服务/下载文件
 - [x] 取消`config.js`，从命令行参数获取配置
   - [x] 默认配置参数
 - [x] 删除文件
 - [x] 创建文件夹
 - [ ] 显示已用空间
 - [x] 显示文件大小
   - [ ] 显示文件夹大小（可能需要遍历，为减少响应时间，不在获取列表时计算）
   - [x] 格式化文件大小
 - [ ] 显示修改日期
 - [ ] 返回上层
 - [ ] 回收站
#### 预览
 - [ ] jpg 文件预览
 - [ ] mp4 文件预览
### 优化
  - [ ] 文件夹下文件太多的时候，进行分页
  - [ ] 文件名太长的时候用 ... 省略
  - [ ] 在页面内显示上传进度
  - [ ] 使用 vue-router，减少页面重新加载次数
  - [ ] 上传时关闭页面提示用户离开
