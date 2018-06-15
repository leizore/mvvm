class Dep {
  constructor (props) {
    this.subs = [];
    this.uid = 0;
  }
  addSub (sub) {
    this.subs.push(sub);
    this.uid++;
  }
  notify () {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
  depend (sub) {
    Dep.target.addDep(this);
  }
}
Dep.target = null;
