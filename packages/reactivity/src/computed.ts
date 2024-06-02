import { ReactiveEffect } from "./effect";
import { createDep } from "./dep";
import { trackRefValue, triggerRefValue } from "./ref";

export class ComputedRefImpl {
  public dep: Set<ReactiveEffect>;
  public effect: ReactiveEffect;

  public _dirty: boolean;
  private _value: unknown;

  constructor(getter: () => unknown) {
    this._dirty = true;
    this.dep = createDep();
    //如果一个computed 没有被使用，那么它不会触发get 也就是不会触发run，这个effect的依赖不会被收集
    this.effect = new ReactiveEffect(getter, () => {
      // scheduler
      if (this._dirty) {
        return;
      }
      this._dirty = true; //此时，我们需要重新调用effect,此处的scheduler 被调用 表明这个effect 所依赖的响应式proxy 发生了变化
      triggerRefValue(this); //同时，因为computed 的值发生改变，去执行其他依赖这个computed 的 effect，同时触发get
    });
  }
  get value() {
    //当调用get 时，computed 变量被用于其他effect
    //收集当前激活的effect到dep中
    trackRefValue(this);
    //若需要更新computed 的值 (时机： 依赖的值已经发生了改变 因为scheduler 的存在，effect 暂时未执行，因为执行是无意义，没用进行赋值操作)
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run(); //触发更新的getter effect run 更新这个值，如果没有其他effect直接依赖于这个computed ,这个computed 就不会更新，一定程度上节约了性能
    }

    return this._value;
  }
}

export function computed(getter: () => unknown) {
  return new ComputedRefImpl(getter);
}
