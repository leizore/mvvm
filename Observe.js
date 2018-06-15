function observe (obj, vm) {
    if (!obj || typeof obj !== 'object') return;
    return new Observer(obj, vm)
}
class Observer {
    constructor(obj, vm) {
        this.walk(obj, vm);
        this.dep = new Dep();
    }
    walk (obj, vm) {
        var self = this;
        Object.keys(obj).forEach(key => {
            Object.defineProperty(vm, key, {
                configurable: true,
                enumerable: true,
                get () {
                    // 当获取vm 的值的时候，如果 Dep 有 target 时执行，目的是将 Watcher 抓过来
                    if (Dep.target) {
                        self.dep.depend();
                    }
                    return obj[key];
                },
                set (newVal) {
                    var val = obj.key;
                    if (val === newVal) return;
                    obj[key] = newVal;
                    self.dep.notify();
                }
            })
        })
    }
}
