import { kebabCase } from 'lodash'
import { forEach, forIn, getAttr, closest, find } from 'chirashi'

import Observer from './Observer'
import Component from './Component'
import Directive from './Directive'
import * as Directives from '../Directives'

const defaultsGlobals = {
  $prefix: 'p-'
}

const defaults = {
  name: 'root'
}

export default class Core extends Component {
  constructor (globals = {}, options = {}) {
    globals = {...defaultsGlobals, ...globals}
    options = {...defaults, ...options}

    super(globals, options)

    this.$components = {
      [this.$id]: this
    }

    this.$directives = {}

    this.$gobals = {
      ...globals,
      ...options,
      $root: this,
      $components: this.$components,
      $directives: this.$directives
    }

    this.$gobals.$marker = this.$marker = `_${this.$prefix}id`
    this.$directivesMarker = `_${this.$prefix}directives`

    this._components = []
    this._directives = []

    forIn(Directives, this.directive.bind(this))
  }

  component (name, options) {
    name = kebabCase(name)

    const selector = 'selector' in options ? options.selector : `[${this.$prefix}${name}]`

    this._components.push({
      selector,
      options: {
        name,
        selector,
        ...options
      }
    })
  }

  directive (name, options) {
    name = kebabCase(name)

    const selector = 'selector' in options ? options.selector : `[${this.$prefix}${name}]`

    this._directives.push({
      selector,
      options: {
        name,
        selector,
        ...options
      }
    })
  }

  $mount (selector) {
    super.$mount(selector)

    this._observer = new Observer(this.$el)
    this._observer.on(this._domChanged.bind(this))

    this._domChanged()
  }

  _domChanged () {
    this._unbindComponents()
    this._unbindDirectives()
    this._bindComponents()
    this._bindDirectives()
  }

  _unbindComponents () {
    forIn(this.$components, (id, component) => {
      if (!closest(component.$el, document.body)) {
        component.$destroy()
        delete this.$components[id]
      }
    })
  }

  _bindComponents () {
    forEach(this._components, component => {
      forEach(find(this.$el, component.selector), el => {
        if (this.$marker in el) return

        const createdComponent = new Component(this.$gobals, component.options)
        createdComponent.$mount(el)
        this.$components[createdComponent.$id] = createdComponent
      })
    })
  }

  _unbindDirectives () {
    forIn(this.$directives, (id, directive) => {
      if (!closest(directive.$el, document.body)) {
        directive.$unbind()
        delete this.$directives[id]
      }
    })
  }

  _bindDirectives () {
    forEach(this._directives, directive => {
      forEach(find(this.$el, directive.selector), el => {
        if (!(this.$directivesMarker in el)) {
          el[this.$directivesMarker] = []
        } else if (el[this.$directivesMarker].indexOf(directive.options.name) !== -1) {
          return
        }

        el[this.$directivesMarker].push(directive.options.name)

        const createdDirective = new Directive(this.$gobals, directive.options)
        createdDirective.$bind(el, getAttr(el, `${this.$gobals.$prefix}${directive.options.name}`))
        this.$directives[createdDirective.$id] = createdDirective
      })
    })
  }
}
