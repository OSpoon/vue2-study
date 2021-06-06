import { Compile } from "./compile.js";
import { observe } from "./reactive.js";

// 通过app.xxx 来简化 app.$data.xxx
function Proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}

/**
 * 任务1. 对data响应化处理
 * 任务2. 编译模板
 */
export class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 任务1
    observe(this.$data);
    // 代理data到vm上
    Proxy(this);
    // 任务2
    new Compile(options.el, this);
  }
}
