import { addClass, removeClass } from 'chirashi'

export default {
  bind () {
    this.currentClasses = []
  },

  update (value) {
    let newClasses

    if (typeof value === 'string') {
      newClasses = [value]
    } else if ('length' in value) {
      newClasses = value
    } else if (typeof value === 'object') {
      newClasses = Object.keys(value).filter(className => value[className])
    }

    const removeClasses = this.currentClasses.filter(className => newClasses.indexOf(className) === -1)

    if (newClasses.length) addClass(this.$el, ...newClasses)
    if (removeClasses.length) removeClass(this.$el, ...removeClasses)

    this.currentClasses = newClasses
  }
}
