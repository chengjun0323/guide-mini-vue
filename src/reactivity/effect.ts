import { extend } from "../shared";

let activeEffect;
let shouldTrack;
class ReactiveEffect {
  private _fn;
  deps = [];
  active = true;
  onStop?: () => void;
  public scheduler;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    // 应该收集
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();
    // 重置
    shouldTrack = false;

    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (dep.has(activeEffect)) return;
  // 已经在dep中
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
