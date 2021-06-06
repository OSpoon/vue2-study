/**
 * 维护watchers数组,通知watcher进行更新
 */
export class Dep {
  constructor() {
    this.watchers = [];
  }

  addDep(dep) {
    this.watchers.push(dep);
  }

  notify() {
    this.watchers.forEach((watcher) => {
      watcher.update();
    });
  }
}
