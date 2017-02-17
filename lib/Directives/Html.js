import { setProp } from 'chirashi'

export default {
  update (innerHTML) {
    setProp(this.$el, { innerHTML })
  }
}
