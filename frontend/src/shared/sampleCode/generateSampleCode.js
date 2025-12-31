import { RULES } from './rules'

export const generateSampleCode = (type, data) => {
  if (!type || !data) return ''

  const rule = RULES[type]
  if (!rule) return ''

  // cek required field
  const missing = rule.required?.some(
    (key) => data[key] === undefined || data[key] === null || data[key] === ''
  )

  if (missing) return ''

  return rule.generate(data)
}
