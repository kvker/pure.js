;(function () {
  function PureJS() {
    this.util.$$('[id]').forEach((dom) => {
      this.dom[dom.id] = dom
    })
  }

  // 功能函数
  PureJS.prototype.util = {
    $(selector) {
      return document.querySelector(selector)
    },
    $$(selector, is_normal) {
      const doms = document.querySelectorAll(selector)
      return is_normal ? doms : Array.from(doms)
    },
    // template标签根据ES6模板字符串转HTML标签
    template2string(string, params) {
      const keys = Object.keys(params)
      const values = Object.values(params)
      return new Function(...keys, `return \`${string}\``)(...values)
    },
    // 移除常见中文标点
    removePunctuation(string) {
      return string.replace(/，|。|？|！|；|、！|：|“|”|《|【|】|》/g, '&emsp;')
    },
    // 创建子类
    createSubClass(BaseClass = PureJS) {
      function SubClass(...args) {
        BaseClass.apply(this, args)
      }
      const InheritSuper = function () {}
      InheritSuper.prototype = BaseClass.prototype
      SubClass.prototype = new InheritSuper()
      SubClass.prototype.constructor = BaseClass
      return SubClass
    },
  }
  // 通用配置
  PureJS.prototype.config = {
    // 判断是否为华为快应用
    is_hwqa: typeof system !== 'undefined',
  }
  // 统一数据处理
  PureJS.prototype.data = {}
  // 统一DOM处理
  PureJS.prototype.dom = {}
  // 统一回调
  PureJS.prototype.callback = {}
  // 统一缓存处理
  PureJS.prototype.cache = {}
  // UI交互处理
  PureJS.prototype.ui = {
    loading() {
      if (this.config.is_hwqa) {
        system.postMessage('loading---请求中...')
      } else {
        document.body.style.pointerEvents = 'none'
        document.body.style.opacity = 0.2
      }
    },
    unloading() {
      if (this.config.is_hwqa) {
        system.postMessage('unloading')
      } else {
        document.body.style.pointerEvents = 'initial'
        document.body.style.opacity = 1
      }
    },
    alert(text) {
      if (this.config.is_hwqa) {
        system.postMessage('alert---' + text)
      } else {
        return window.alert.call(null, text)
      }
    },
  }
  // 处理函数
  PureJS.prototype.update = function (data) {
    let value, value_origin, callback
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        value = data[key]
        value_origin = this.data[key]
        callback = this.callback[key]
        if (value !== value_origin) {
          this.data[key] = value
          callback && callback(value, data)
        }
      }
    }
  }
  PureJS.prototype.regist = function (key, callback) {
    this.callback[key] = callback.bind(this)
  }
  PureJS.prototype.unregist = function (key) {
    this.callback[key] = null
  }
  Pure.prototype.remove = function(key) {
    this.data[key] = null
    this.dom[key] = null
    this.callback[key] = null
  }

  window.pjs = new PureJS()
})()
