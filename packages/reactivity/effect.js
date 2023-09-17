
let activeEffect
const targetMap = new WeakMap()
const activeEffectStack = []

export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    activeEffectStack.push(effectFn)
    const res = fn()
    activeEffectStack.pop()
    activeEffect = activeEffectStack[activeEffectStack.length - 1]
    return res
  }
  effectFn.deps = []
  effectFn.options = options
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

export function cleanup(effectFn) {
  const { deps } = effectFn
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effectFn)
  }
  effectFn.deps.length = []
}

export function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && [...effects].forEach(triggerEffect)
}

export function triggerEffect(effect) {
  if (effect !== activeEffect) {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }
}