class MVVM {
  constructor (options) {
    this.$options = options;
    var data = this._data = this.$options.data;
    observe(data, this);
    new Compile(options.el || document.body, this);
  }
}