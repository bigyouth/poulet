import { setStyle } from 'chirashi'

export default {
  update (value) {
    setStyle(this.$el, {
      display: value ? 'block' : 'none'
    })
  }
}
