import { forIn, forEach, getElement } from 'chirashi'
import { uniqueId } from 'lodash'

import get from '../../get'

import _copyAccessor from './_copyAccessor'
import _defineReactive from './_defineReactive'
import _mergeMixins from './_mergeMixins'

const lifeCycle = ['mounted', 'beforeDestroy']

export default class Component {
  constructor (globals = {}, options = {}) {
    Object.assign(this, globals)
    this.$options = options

    this.$id = this._generateId()

    this.$options = _mergeMixins(this.$options)

    this.$scope = {}

    this._bindLifeCycle()
    this._bindData()
    this._bindMethods()
  }

  _bindData () {
    this.$data = {}

    this._watchers = {}
    forIn(this.$options.data, (key, value) => {
      _defineReactive(this._watchers, '', this.$data, key, value)
      _copyAccessor(key, this, this.$data)
      _copyAccessor(key, this.$scope, this.$data)
    })
  }

  _bindMethods () {
    this.$methods = {}
    forIn(this.$options.methods, (name, callback) => {
      this.$methods[name] = callback.bind(this)
    })

    Object.assign(this, this.$methods)
    Object.assign(this.$scope, this.$methods)
  }

  _generateId () {
    return uniqueId(`${this.$prefix}${this.$options.name}-`)
  }

  _bindLifeCycle () {
    forEach(lifeCycle, method => {
      this[method] = (...args) => {
        forEach(this.$options[method], callback => callback.apply(this, args))
      }
    })
  }

  $watch (key, options) {
    if (typeof options === 'function') {
      options = {
        deep: false,
        immediate: false,
        handler: options
      }
    }

    if (options.deep) {
      forIn(this._watchers, (watchKey, watchers) => {
        if (watchKey.indexOf(key) === 0) {
          watchers.push(options.handler)
        }
      })
    } else {
      if (key in this._watchers) {
        this._watchers[key].push(options.handler)
      }
    }

    if (options.immediate) {
      options.handler(get(this.$scope, key))
    }
  }

  $unwatch (key, callback) {
    forIn(this._watchers, (watchKey, watchers) => {
      watchers.splice(watchers.indexOf(callback), 1)
    })
  }

  $mount (el) {
    this.$el = getElement(el)

    this.$el[this.$marker] = this.$id

    this.mounted(el)
  }

  $destroy () {
    this.beforeDestroy()
  }
}
