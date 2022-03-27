# discourse-runout
Remove all of your posts without deleting your account. 润喽!

## Using a browser

在浏览器运行，只需要在Discourse界面将browser-side.js中的内容复制进去执行即可。


## Using NodeJS(Suggested)
### Using NodeJS means discourse-runout can fetch your posts for one time and remove your posts day by day if you have a limit on removing posts.
在NodeJS运行，请使用node-side.js，在main函数中的config里面提前配置好CSRF Token和Cookie，并请安装needle模块
