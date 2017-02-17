import { on } from 'chirashi'

export default {
  unbind () {
    if (this.offObj) this.offObj.off()
  },

  update (options) {
    if (this.offObj) this.offObj.off()

    console.log('on', options)
    on(this.$el, options)
  }
}
