// 数组响应式
const orginalPropo = Array.prototype;
// 备份
const arrayPropo = Object.create(orginalPropo);
// 扩展
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
  (method) => {
    arrayPropo[method] = function () {
      orginalPropo[method].apply(this, arguments);
      // 通知更新
      console.log("数组执行" + method + " 操作");
    };
  }
);

// 对象数据响应式
function defineReactive(obj, key, val) {
  // 如果val还是对象则递归处理
  observe(val);
  // 拦截属性
  Object.defineProperty(obj, key, {
    get() {
      console.log("get: ", key);
      return val;
    },
    set(newVal) {
      console.log("set: ", key);
      if (newVal != val) {
        // 新赋值为ob,则进行处理
        observe(newVal);
        val = newVal;
      }
    },
  });
}

// 统一处理对象的属性
function observe(obj) {
  // 只允许对象处理
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  if (Array.isArray(obj)) {
    // 覆盖原型
    obj.__proto__ = arrayPropo;
    // 对数组中的元素进行响应化
    const keys = Object.keys(obj);
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i]);
    }
  } else {
    // 遍历属性实现每个属性的get/set进行劫持
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 提供设置新属性的函数
function $set(obj, key, val) {
  defineReactive(obj, key, val);
}

// 案例1: 单个属性处理
// const data = {};
// defineReactive(data, "foo", "foo");
// data.foo; // 触发get
// data.foo = "foooo"; // 触发set

// 案例2: 多个属性处理
// const data = {
//   name: "小鑫同学",
//   age: 27,
//   address: {
//     city: "昔阳县",
//   },
// };
// observe(data);
// data.name; // 触发get
// data.age = 27; // 触发set
// // 递归处理
// data.address.city;
// // 重新赋值,重新响应化
// data.address = {
//   city: "阳泉",
// };
// // 新增属性
// data.email = "1825203636@qq.com";
// $set(data, "email", "1825203636@qq.com");
// data.email;

// 案例3: 数组响应化
const data = []
observe(data)
data.push(1)
data.push(2)