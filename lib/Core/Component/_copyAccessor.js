export default function _copyAccessor (key, to, from) {
  Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key))
}
