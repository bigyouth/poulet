import { forEach } from 'chirashi'

export default class Observer {
  constructor (domElement) {
    this._observer = new MutationObserver(this._update.bind(this))

    this._observer.observe(domElement, {
      childList: true,
      subtree: true
    })

    this._listeners = []
  }

  on (callback) {
    this._listeners.push(callback)
  }

  off (callback) {
    this._listeners.splice(this._listeners.indexOf(callback), 1)
  }

  _update () {
    forEach(this._listeners, listener => {
      try {
        listener()
      } catch (e) {
        console.error(e)
      }
    })
  }
}
