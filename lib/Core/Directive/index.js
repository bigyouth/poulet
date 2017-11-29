import { forEach, getElement, parents } from 'chirashi'
import { uniqueId } from 'lodash'

import _stringParser from './_stringParser'

const lifeCycle = ['bind', 'update', 'unbind']

export default class Directive {
  constructor (globals = {}, options = {}) {
    Object.assign(this, globals)
    this.$options = options

    this.$update = this.$update.bind(this)

    this.$id = this._generateId()

    this._bindLifeCycle()
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

  _eval (string) {
    return (0, eval)(`(function ($scope) { return ${string}; })`)(this.$scope)
  }

  $bind (el, option) {
    this.$el = getElement(el)

    this.$option = _stringParser(option)

    const closests = [this.$el, ...parents(this.$el)]
    let parent
    let i = 0
    while ((parent = closests[i++]) && !(this.$marker in parent)) {}

    this.$component = this.$components[parent[this.$marker]]

    if (this.bind) {
      try {
        this.bind(el)
      } catch (e) {
        console.error(e)
      }
    }

    this.unwatchers = []
    if (this.$option.props.length) {
      forEach(this.$option.props, prop => {
        this.unwatchers.push(this.$component.$watch(prop, this.$update, { immediate: true }))
      })
    } else {
      this.$update()
    }
  }

  $update () {
    if (this.update) {
      try {
        this.update(this._eval(this.$option.template))
      } catch (e) {
        console.error(e)
      }
    }
  }

  $unbind () {
    forEach(this.unwatchers, unwatch => {
      unwatch()
    })

    if (this.unbind) {
      try {
        this.unbind()
      } catch (e) {
        console.error(e)
      }
    }
  }

  get $scope () {
    return this.$component.$scope
  }
}
