class Compile {
  constructor (el, vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    this.$vm = vm;
    if (this.$el) {
      this.compileElement(this.$el);
    }
  }
  compileElement (el) {
    var childNodes = Array.from(el.childNodes);
    if (childNodes.length > 0) {
      childNodes.forEach(child => {
        var childArr = Array.from(child.childNodes);
        // 匹配{{}}里面的内容
        var reg = /\{\{((?:.)+?)\}\}/;
        if (childArr.length > 0) {
          this.compileElement(child)
        } 
        if (this.isTextNode(child)) {
          var text = child.textContent.trim();
          var matchTextArr = reg.exec(text);
          var matchText;
          if (matchTextArr && matchTextArr.length > 1) {
            matchText = matchTextArr[1];
            this.compileText(child, matchText);
          }
        } else if (this.isElementNode(child)) {
          this.compileNode(child);
        }
      })
    }

  }
  compileText(node, exp) {
    this.bind(node, this.$vm, exp, 'text');
  }
  compileNode (node) {
    var attrs = Array.from(node.attributes);
    attrs.forEach(attr => {
      if (this.isDirective(attr.name)) {
        var directiveName = attr.name.substr(2);
        if (directiveName.includes('on')) {
          node.removeAttribute(attr.name);
          var eventName = directiveName.split(':')[1];
          this.addEvent(node, eventName, attr.value);
        } else if (directiveName.includes('model')) {
          // v-model
          this.bind(node, this.$vm, attr.value, 'value');
          node.addEventListener('input', (e) => {
            this.$vm[attr.value] = e.target.value;
          })
        }else{
          // v-text v-html
          node.removeAttribute(attr.name);
          this.bind(node, this.$vm, attr.value, directiveName);
        }
      }
    })
  }
  addEvent(node, eventName, exp) {
    node.addEventListener(eventName, this.$vm.$options.methods[exp].bind(this.$vm));
  }
  bind (node, vm, exp, dir) {
    if (dir === 'text') {
      node.textContent = vm[exp];
    } else if (dir === 'html') {
      node.innerHTML = vm[exp];
    } else if (dir === 'value') {
      console.log('sss')
      node.value = vm[exp];
    }
    new Watcher(exp, vm, function () {
      if (dir === 'text') {
        node.textContent = vm[exp];
      } else if (dir === 'html') {
        node.innerHTML = vm[exp];
      }
    })
  }
  hasChildNode (node) {
    return node.children && node.children.length > 0;
  }
  // 是否是指令
  isDirective (attr) {
    if (typeof attr !== 'string') return;
    return attr.includes('v-');
  }
  // 元素节点
  isElementNode (node) {
    return node.nodeType === 1;
  }
  // 文本节点
  isTextNode (node) {
    return node.nodeType === 3;
  }
}
