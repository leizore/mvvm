class Watcher {
  constructor (exp, vm, cb) {
    this.$vm = vm;
    this.$exp = exp;
    this.depIds = {};
    this.getter = this.parseGetter(exp);
    this.value = this.get();
    this.cb = cb;
  }
  update () {
    let newVal = this.get();
    let oldVal = this.value;
    if (oldVal === newVal) return;
    this.cb.call(this.vm, newVal);
    this.value = newVal;
  }
  get () {
    Dep.target = this;
    var value = this.getter.call(this.$vm, this.$vm);
    Dep.target = null;
    return value;
  }
  parseGetter (exp) {
    if (/[^\w.$]/.test(exp)) return;
    return function (obj) {
      if (!obj) return;
      obj = obj[exp];
      return obj;
    }
  }
  addDep (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      this.depIds[dep.id] = dep;
      dep.subs.push(this);
    }
  }
}
