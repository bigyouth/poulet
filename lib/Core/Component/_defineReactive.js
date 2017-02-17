import { forEach, forIn } from 'chirashi'

export default function _defineReactive (watchers, watchKey, output, key, value) {
  watchKey += key

  watchers[watchKey] = []

  Object.defineProperty(output, key, {
    get: () => {
      return value
    },
    set: newValue => {
      value = newValue

      if (typeof newValue === 'object') {
        forIn(newValue, _defineReactive.bind(null, watchers, `${watchKey}.`, output[key]))
      }

      forEach(watchers[watchKey], callback => {
        callback(value)
      })
    }
  })

  output[key] = value
}
