# Clockid
clockid以[meteor todos](https://github.com/meteor/todos)项目的react分支为蓝本
引入[material-ui](https://github.com/callemall/material-ui)组件库

Running the app
-----------------------------------
未改动meteor todos结构，只是应用

        meteor npm i xxx --save 
在package.json中增加了dependencies
因此将代码clone到本地之后，运行以下命令即可

        meteor npm install
        meteor

数据schema修改之后，需要运行以下命令进行Reset

        meteor reset


Debug 及 IDE
-----------------------------------
建议用visual code作为IDE

### 前端调试
用chrome 开发者工具就好

### 后端调试
参考这篇文章：
<https://forums.meteor.com/t/using-visual-studio-code-for-meteor-development/21058>

注意几个要点：
* 通过以下两行指示visual code 附加调试配置信息

        "sourceMaps": true,
        "outDir": "${workspaceRoot}/.meteor/local/build/programs/server",

* 设置断点须在build下的app.js中
* 先在终端下用命令 meteor debug 启动 5858调试端口，
* 然后在visual code下 "debug-> 附加"
