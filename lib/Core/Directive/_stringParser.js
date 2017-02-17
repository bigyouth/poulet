import { forEach } from 'chirashi'

const stringRegex = /([\w-_.\s]+)/g
const quote = /["']/g

export default function stringParser (input) {
  const props = []
  let inquote = false
  let inobject = false
  let leftobject = false
  let nbQuotes = 0

  const segments = input.split(/\s/g)
  forEach(segments, (segment, index) => {
    const quotes = segment.match(quote)
    if (!inquote && quotes) {
      inquote = true
    }

    if (!inobject && segment.indexOf('{') !== -1) {
      inobject = true
      leftobject = true
    }

    if (inobject && segment.indexOf(',') === 0) {
      leftobject = true
    }

    if (!inquote && !leftobject) {
      let variable = segment.match(stringRegex)

      if (variable) {
        variable = variable[0]

        if (isNaN(+variable)) {
          props.push(variable)
          segments[index] = segment.replace(variable, `$scope.${variable}`)
        }
      }
    }

    if (quotes) nbQuotes += quotes.length
    if (quotes && nbQuotes % 2 === 0) {
      inquote = false
    }

    if (inobject && segment.indexOf(':') !== -1) {
      leftobject = false
    }

    if (inobject && segment.indexOf(',') !== -1) {
      leftobject = true
    }

    if (inobject && segment.indexOf('}') !== -1) {
      inobject = false
    }
  })

  return { template: segments.join(' '), props }
}
