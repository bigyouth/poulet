export default function (obj, key) {
  const keys = key.split('.')
  key = keys.pop()
  const n = keys.length
  for (let i = 0; i < n; ++i) {
    obj = obj[keys[i]]
  }

  return obj[key]
}
