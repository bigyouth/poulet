import { on } from 'chirashi'

export default {
  unbind () {
    if (this.off) this.off()
  },

  update (options) {
    if (this.off) this.off()

    on(this.$el, options)
  }
}
