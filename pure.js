// template标签根据ES6模板字符串转HTML标签
String.prototype.template2string = function (params) {
  const keys = Object.keys(params)
  const values = Object.values(params)
  return new Function(...keys, `return \`${this}\``)(...values)
}

// 移除常见中文标点
String.prototype.removePunctuation = function () {
  return this.replace(/，|。|？|！|；|、！|：|“|”|《|【|】|》/g, '&emsp;')
}

// 缓存
window.cache = {}

// 判断是否为华为快应用
window.is_hwqa = typeof system !== 'undefined'

window.$ = function (selector) {
  return document.querySelector(selector)
}

window.$$ = function (selector, is_normal) {
  const doms = document.querySelectorAll(selector)
  return is_normal ? doms : Array.from(doms)
}

window.loading = function () {
  if (window.is_hwqa) {
    system.postMessage('loading---请求中...')
  } else {
    document.body.style.pointerEvents = 'none'
    document.body.style.opacity = 0.2
  }
}

window.unloading = function () {
  if (window.is_hwqa) {
    system.postMessage('unloading')
  } else {
    document.body.style.pointerEvents = 'initial'
    document.body.style.opacity = 1
  }
}

let window_alert = window.alert
window.alert = function (text) {
  if (window.is_hwqa) {
    system.postMessage('alert---' + text)
  } else {
    return window_alert.call(null, text)
  }
}

function Page() {
  this.dom = {}

  $$('[id]').forEach((dom) => {
    this.dom[dom.id] = dom
  })

  this.data = null
  this.data_proxy = null
  if(this.dataHandler) this.dataHandler()
  else console.error('请实现dataHandler方法')
}

function App() {
  Page.call(this, arguments)
}

// 避免两次调用继承的父类
function InheritSuper() {}
InheritSuper.prototype = Page.prototype
App.prototype = new InheritSuper()
App.prototype.constructor = Page

var app = new App()
