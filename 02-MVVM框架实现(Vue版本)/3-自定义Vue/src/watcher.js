import { Dep } from "./dep.js";
/**
 * 监听器: 负责依赖更新
 */
export class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 触发依赖收集
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  // 更新视图
  update() {
    // 执行实际的更新操作
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
