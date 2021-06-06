import { Watcher } from "./watcher.js";
/**
 * 编译模板(template: html)
 */
export class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      this.compile(this.$el);
    }
  }

  compile(el) {
    //遍历子节点,判断类型做对应处理
    const childNodes = el.childNodes;
    childNodes.forEach((node) => {
      // 元素类型: 获取元素上的属性进行解析处理
      if (this.isElement(node)) {
        const attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
          const attrName = attr.name; // 属性名
          const exp = attr.value; // 属性值
          // 指令处理: v-xxx="xxx"
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2);
            this[dir] && this[dir](node, exp);
          }
          // 事件处理: @click
          if (this.isEvent(attrName)) {
            const dir = attrName.substring(1);
            this.eventHandler(node, exp, dir);
          }
        });
      }
      // 本文类型: 判断是否为文本且符合插值表达式
      else if (this.isInter(node)) {
        // 编译文本
        this.compilText(node);
      }
      // 递归对子节点进行处理
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 是否为元素
  isElement(node) {
    return node.nodeType == 1;
  }

  // 是否为插值表达式
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  // 是否为指令
  isDirective(attr) {
    return attr.indexOf("v-") == 0;
  }

  // 是否为指令
  isEvent(dir) {
    return dir.indexOf("@") == 0;
  }

  eventHandler(node, exp, dir) {
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
    node.addEventListener(dir, fn.bind(this.$vm));
  }

  update(node, exp, dir) {
    // 初始化
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);
    // 更新
    new Watcher(this.$vm, exp, (val) => {
      fn && fn(node, val);
    });
  }

  // v-model="xxx"
  model(node, exp) {
    // 1. update方法只完成赋值和更新
    this.update(node, exp, "model");
    // 事件监听
    node.addEventListener("input", (e) => {
      // 将新的值赋值给数据
      this.$vm[exp] = e.target.value;
    });
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  // v-html="xxx"
  html(node, exp) {
    this.update(node, exp, "html");
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  // v-text="xxx"
  text(node, exp) {
    // node.textContent = this.$vm[exp];
    this.update(node, exp, "text");
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  // {{xxx}}
  compilText(node) {
    this.update(node, RegExp.$1, "text");
  }
}
