import { setStyleProp } from 'chirashi'

export default {
  update (value) {
    setStyleProp(this.$el, {
      display: value ? 'block' : 'none'
    })
  }
}
