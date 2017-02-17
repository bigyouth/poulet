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
    let i = -1
    while ((parent = closests[++i]) && !(this.$marker in parent)) {}

    this.$component = this.$components[parent[this.$marker]]

    if (this.bind) this.bind(el)

    if (this.$option.props.length) {
      forEach(this.$option.props, prop => {
        this.$component.$watch(prop, {
          immediate: true,
          handler: this.$update
        })
      })
    } else {
      this.$update()
    }
  }

  $update () {
    if (this.update) this.update(this._eval(this.$option.template))
  }

  $unbind () {
    forEach(this.$option.props, prop => {
      this.$component.$unwatch(prop, this.$update)
    })

    if (this.unbind) this.unbind()
  }

  get $scope () {
    return this.$component.$scope
  }
}
