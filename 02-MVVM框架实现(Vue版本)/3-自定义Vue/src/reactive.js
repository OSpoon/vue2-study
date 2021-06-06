import { Dep } from "./dep.js";

// 数据响应式
function defineReactive(obj, key, val) {
  // 通过递归对嵌套属性处理
  observe(val);
  // 创建dep实例: 每个key对应一个dep实例
  const dep = new Dep();
  // 拦截属性
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (newVal != val) {
        // 处理赋的值为对象的情况
        observe(newVal);
        val = newVal;
        // 通知更新
        dep.notify();
      }
    },
  });
}

/**
 * 对象/数组响应化
 */
class ObServer {
  constructor(value) {
    this.value = value;
    if (Array.isArray(value)) {
      // todo
    } else {
      this.walk(value);
    }
  }

  // 对象响应化
  walk(obj) {
    // 遍历属性实现每个属性的get/set进行劫持
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
  }
}

// 统一处理对象的属性
export function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  new ObServer(obj);
}
