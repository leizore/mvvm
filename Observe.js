function observe (obj, vm) {
    if (!obj || typeof obj !== 'object') return;
    return new Observer(obj, vm)
}
class Observer {
    constructor(obj, vm) {
        this.$vm = vm;
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
