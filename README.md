# send-kindle
发送电子书到kindle上

## 使用教程

1.全局安装
npm i send-kindle -g

2.设置邮箱
send-kindle --to kindle邮箱地址, 如: xx@kindle.cn --from 发送者邮箱账号密码, 如: zh@qq.com:mm

3.在你本地书籍目录下执行

send-kindle [filePath, fileDir] 可以是一个目录也可以是一个文件, 可以传递多个, 空格隔开

## 使用示例

```
send-kindle --to xx@kindle.cn --from zh@qq.com:123456

send-kindle aa.mobi bb.mobi cc.txt dd
```

## 注意事项

往kindle上传递书籍需要在亚马逊网站上将发送人的邮箱添加到白名单, 否则无法传递成功