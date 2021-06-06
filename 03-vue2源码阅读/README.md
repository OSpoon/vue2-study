初始化流程图: https://www.edrawsoft.cn/viewer/public/s/max/b34c1306730272

# 阅读源码v2.6.11
## 准备

1. 安装项目依赖: `npm i`
1. 安装编译依赖: `npm i rollup -g`
1. 修改dev脚本,便于调试: `rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev`
1. 重新编译vue.js和映射文件
## 初始化流程
### entry:

1. 通过dev命令获悉
1. scripts/config.js, web-full-dev
1. 运行时编译, 开发模式, 浏览器环境
1. src\platforms\web\entry-runtime-with-compiler.js
### entry-runtime-with-compiler.js

1. 扩展`$mount`
1. 通过用户传入的Options选项查找render函数或template或el
   1. 获取Html字符串
   1. 编译(compileToFunctions)template=>render
3. 执行挂载: `mount.call(this, el, hydrating)`
3. 总结: 扩展$mount处理可能传入的template和el选项



### src\platforms\web\runtime\index.js

1. 通过上一步`import Vue from './runtime/index'`获悉
1. 在Vue原型挂载patch
1. 实现`$mount`: `mountComponent(this, el, hydrating)`



### src\core\index.js

1. 通过上一步`import Vue from 'core/index'`获悉
1. 初始化全局API:
   1. component
   1. filter
   1. directive
   1. use
   1. mixin
   1. util
   1. extend
   1. ...
3. 服务端渲染相关的其他配置



#### src\core\instance\index.js

1. 通过上一步`import Vue from './instance/index'`获悉
1. Vue构造函数声明
1. 对Vue进行扩展增加实例属性/方法: 
   1. initMixin => _init()
   1. stateMixin => $set/$delete/$watch/$data/$props
   1. eventsMixin => $on/$once/$off/$emit
   1. lifecycleMixin => _update/$forceUpdate/$destroy
   1. renderMixin => $nextTick/_render



#### initMixin()
##### 1. 实现`_init`函数,new Vue()执行

1. 合并选项: 用户传入和系统默认的(components/directives/flitters)
1. 初始化核心代码
   1. initLifecycle(vm)
      1. $parent
      1. $root
      1. $children
      1. $refs
   2. initEvents(vm): 自定义事件监听
   2. initRender(vm)   
      1. $slots
      1. $createElement
      1. $attrs
      1. $listeners
   4. callHook(vm, 'beforeCreate')
      1. 执行beforeCreate生命周期
   5. initInjections(vm) // resolve injections before data/props
   5. initState(vm)
      1. props
      1. methods
      1. data
      1. computed
      1. watch
   7. initProvide(vm) // resolve provide after data/props
   7. callHook(vm, 'created')
3. el选项存在的情况下自动执行vm.$mount(vm.$options.el)
### $mount

1. vm.$mount(vm.$options.el)
1. mount.call(this, el, hydrating)
1. mountComponent()
   1. callHook(vm, 'beforeMount')
   1. 定义updateComponent()
      1. lifecycleMixin()
         1. vm.__patch__
   3. 实例化Watcher=>执行updateComponent()
   3. callHook(vm, 'mounted')








