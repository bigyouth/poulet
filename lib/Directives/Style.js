import { setStyleProp } from 'chirashi'

export default {
  update (options) {
    setStyleProp(this.$el, options)
  }
}
