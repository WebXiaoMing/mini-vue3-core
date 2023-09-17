import { effect } from "./effect"

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}

export function watch(source, cb, options = {}) {
  let getter
  let newValue, oldValue
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  const jobRunner = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: jobRunner
  })

  if (options.immediate) {
    jobRunner()
  } else {
    oldValue = effectFn()
  }
}