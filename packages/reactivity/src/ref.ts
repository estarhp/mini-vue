import { hasChanged, isObject } from "@mini-vue/shared";
import { reactive } from "./creativity";
import { createDep } from "./dep";
import {
  ReactiveEffect,
  isTracking,
  trackEffects,
  triggerEffects,
} from "./effect";
import { ComputedRefImpl } from "./computed";

export function ref(value: unknown) {
  return createRef(value);
}

export function createRef(value: unknown) {
  return new RefImpl(value);
}

export class RefImpl {
  private _rawValue: unknown;
  private _value: unknown;
  public dep: Set<ReactiveEffect>;
  public __v_isRef = true;

  constructor(value: unknown) {
    this._rawValue = value;
    // 判断value 是否为一个对象
    //对于非对象的value 需要先用reactive 先处理
    this._value = convert(value);
    this.dep = createDep();
  }

  get value() {
    //收集依赖
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    // 新值不等于老值时才会重新触发依赖更新
    if (hasChanged(this._value, newValue)) {
      //对值进行更新
      this._value = newValue;
      this._rawValue = newValue;
      //触发依赖更新
      triggerRefValue(this);
    }
  }
}

export function convert(value: unknown) {
  return isObject(value) ? reactive(value as object) : value;
}

export function trackRefValue(ref: RefImpl | ComputedRefImpl) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function triggerRefValue(ref: RefImpl | ComputedRefImpl) {
  triggerEffects(ref.dep);
}

export function unRef(ref: unknown) {
  return isRef(ref) ? (ref as RefImpl).value : ref;
}

export function isRef(value: unknown) {
  return !!(value as RefImpl | { __v_isRef: undefined }).__v_isRef;
}

//这个函数的目的： 帮助结构ref， 再template 中使用ref 不需要再.value
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

export const shallowUnwrapHandlers = {
  get(target: object, key: string, receiver: unknown) {
    // 如果是一个ref类型的话，直接返回.value
    return unRef(Reflect.get(target, key, receiver));
  },
  set(target: object, key: string, value: unknown, receiver: unknown) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      target[key].value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};
