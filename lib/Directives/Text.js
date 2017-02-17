import { setProp } from 'chirashi'

export default {
  update (textContent) {
    setProp(this.$el, { textContent })
  }
}
