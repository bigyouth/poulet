import { forEach, forIn } from 'chirashi'

const _arrayChangingMethods = ['push', 'splice', 'unshift']

export default function _defineReactive (watchers, watchKey, output, key, value) {
  watchKey += key

  watchers[watchKey] = {}

  Object.defineProperty(output, key, {
    get: () => {
      return value
    },
    set: newValue => {
      forIn(watchers[watchKey], (key, options) => options.beforeChange())

      value = newValue

      if (typeof newValue === 'object') {
        forIn(newValue, _defineReactive.bind(null, watchers, `${watchKey}.`, output[key]))
      }

      forIn(watchers[watchKey], (key, options) => options.afterChange())

      if (value instanceof Array) {
        forEach(_arrayChangingMethods, method => {
          value[method] = function () {
            forIn(watchers[watchKey], (key, options) => {
              if (options.deep) options.beforeChange()
            })

            const ret = Array.prototype[method].apply(this, arguments)

            forIn(watchers[watchKey], (key, options) => {
              if (options.deep) options.afterChange()
            })

            return ret
          }
        })
      }
    }
  })

  output[key] = value
}
