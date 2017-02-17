import { on, getProp, setProp } from 'chirashi'
import set from '../set'

export default {
  bind (el) {
    this.type = getProp(el, 'type')

    this.inputChanged = () => {
      let newValue
      switch (this.type) {
        case 'checkbox':
          newValue = getProp(this.$el, 'checked')
          break

        default:
          newValue = getProp(this.$el, 'value')
      }

      if (newValue === this.currentValue) return

      this.currentValue = newValue

      set(this.$scope, this.model, this.currentValue)
    }

    this.offObj = on(el, {
      'keyup blur change': this.inputChanged
    })
  },

  update (newValue) {
    if (newValue === this.currentValue) return

    this.model = this.$option.props[0]

    this.currentValue = newValue

    switch (this.type) {
      case 'checkbox':
        console.log(this.$el.checked)
        setProp(this.$el, { checked: newValue })
        console.log(this.$el.checked)
        break

      case 'radio':
        const selector = `${this.$options.selector.slice(0, -1)}="${this.model}"]`
        setProp(selector, { checked: false })
        setProp(`${selector}[value="${newValue}"]`, { checked: true })
        break

      default:
        setProp(this.$el, { value: newValue })
    }
  },

  unbind () {
    this.offObj.off()
  }
}
