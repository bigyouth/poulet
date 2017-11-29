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

  $watch (key, callback, options = { deep: false, immediate: false }) {
    const watcherId = uniqueId(this.$id + '-' + key + '-')

    if (typeof callback === 'string') callback = this.$scope[callback]

    const oldValue = {
      value: null
    }

    options.beforeChange = () => {
      const old = get(this.$scope, key)

      if (old instanceof Array) {
        oldValue.value = [...old]
      } else if (typeof old === 'object') {
        oldValue.value = {...old}
      } else {
        oldValue.value = old
      }
    }

    options.afterChange = () => {
      callback(get(this.$scope, key), oldValue.value)
    }

    if (key in this._watchers) {
      this._watchers[key][watcherId] = options

      if (options.deep) {
        const keyRoot = key + '.'
        if (typeof get(this.$scope, key) === 'object') {
          forIn(this._watchers, (watchKey, watchers) => {
            if (watchKey.indexOf(keyRoot) === 0) {
              this._watchers[watchKey][watcherId] = options
            }
          })
        }
      }
    }

    if (options.immediate) {
      options.afterChange()
    }

    return () => {
      if (options.deep) {
        if (typeof get(this.$scope, key) === 'object') {
          forIn(this._watchers, (watchKey, watchers) => {
            delete this._watchers[watchKey][watcherId]
          })
        }
      } else {
        if (key in this._watchers) {
          delete this._watchers[key][watcherId]
        }
      }
    }
  }

  $mount (el) {
    this.$el = getElement(el)

    this.$el[this.$marker] = this.$id

    try {
      this.mounted(el)
    } catch (e) {
      console.error(e)
    }
  }

  $destroy () {
    try {
      this.beforeDestroy()
    } catch (e) {
      console.error(e)
    }
  }
}
