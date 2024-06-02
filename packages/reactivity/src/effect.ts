import { extend } from "@mini-vue/shared";
import { createDep } from "./dep";

const targetMap = new WeakMap();
let activeEffect: undefined | ReactiveEffect = void 0;
let shouldTrack = false;

export class ReactiveEffect {
  active = true;
  deps: Set<ReactiveEffect>[] = []; //收集所有包含自身的deps
  public onStop?: () => void;
  constructor(
    public fn: () => unknown,
    public scheduler?: () => unknown,
  ) {
    console.log("创建ReactiveEffect对象");
  }

  run() {
    console.log("run");
    //不再收集依赖
    if (!this.active) {
      return this.fn();
    }
    //开始收集依赖
    shouldTrack = true;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this;

    const result = this.fn(); //触发内部所有proxy 的getter , 开始依赖搜集 --》 track()

    shouldTrack = false;
    activeEffect = undefined;

    return result;
  }

  stop() {
    //避免重复的执行
    if (this.active) {
      if (this.onStop) {
        this.onStop();
      }
      cleanupEffect(this);
      this.active = false;
    }
  }
}

export function effect(fn: () => unknown, options = {}) {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run(); //首次执行
  const runner = _effect.run.bind(_effect) as {
    (): unknown;
    effect: ReactiveEffect;
  };
  runner.effect = _effect;

  return runner;
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function track(target: object, type: string, key: string) {
  if (!isTracking()) {
    return;
  }

  //初始化第一次收集
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  //以后的收集
  let dep = depsMap.get(key);
  if (!dep) {
    dep = createDep();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

export function stop(runner: { (): unknown; effect: ReactiveEffect }) {
  runner.effect.stop();
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  //存放所有的effect
  if (!dep.has(activeEffect!)) {
    dep.add(activeEffect!);
    activeEffect?.deps.push(dep);
  }
}

export function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0; //清空整个数组
}

export function trigger(target: object, type: string, key) {
  const deps: Set<ReactiveEffect>[] = [];

  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);

  deps.push(dep);

  const effects: ReactiveEffect[] = [];

  deps.forEach((dep) => {
    effects.push(...dep);
  });
  triggerEffects(createDep(effects));
}

export function triggerEffects(dep: Set<ReactiveEffect>) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
