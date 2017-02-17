import { forEach, forIn } from 'chirashi'

import * as Mixins from '../../mixins'

function lifeCycleMerger (base, mixin) {
  if (!base) return mixin

  if (!(base instanceof Array)) base = [base]
  if (!(mixin instanceof Array)) mixin = [mixin]

  return [...base, ...mixin]
}

const merger = {
  mounted: lifeCycleMerger,
  beforeDestroy: lifeCycleMerger,
  default (base, mixin) {
    if (typeof base === 'object' && typeof mixin === 'object') {
      return {...mixin, ...base}
    }

    return base || mixin
  },
  mixins: base => base
}

function _mergeOptions (base, mixin) {
  forIn(mixin, (key, value) => {
    if (key in merger) {
      base[key] = merger[key](base[key], value)
    } else {
      base[key] = merger.default(base[key], value)
    }
  })
}

export default function _mergeMixins (options) {
  const result = {...options}

  forEach(result.mixins, (mixin, index) => {
    if (typeof mixin === 'string') {
      mixin = Mixins[mixin]
    }

    if ('mixins' in options) {
      mixin = _mergeMixins(mixin)
    }

    _mergeOptions(result, mixin)
  })

  return result
}
