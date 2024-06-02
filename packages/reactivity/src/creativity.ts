import {
  mutableHandlers,
  readonlyHandlers,
  shallowHandlers,
} from "./baseHandler";

export const reactiveMap = new WeakMap();
export const readonlyMap = new WeakMap();

export const shallowReadonlyMap = new WeakMap();

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v-raw",
}

function createCreativeObject(
  target: object,
  proxyMap: WeakMap<object, unknown>,
  baseHandler: ProxyHandler<object>,
) {
  const existProxy = proxyMap.get(target);
  if (existProxy) {
    return existProxy;
  }
  const proxy = new Proxy(target, baseHandler);
  proxyMap.set(target, proxy);
  return proxy;
}

export function reactive(target: object) {
  return createCreativeObject(target, reactiveMap, mutableHandlers);
}

export function readonly(target: object) {
  return createCreativeObject(target, readonlyMap, readonlyHandlers);
}

export function shallow(target: object) {
  return createCreativeObject(target, shallowReadonlyMap, shallowHandlers);
}

export function isReactive(value: unknown) {
  //如果为普通对象则返回undefined
  //如果为reactive 会触发getter 返回true
  return !!value![ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: unknown) {
  return !!value![ReactiveFlags.IS_READONLY];
}

export function isProxy(value: unknown) {
  return isReactive(value) || isReadonly(value);
}

export function toRaw(value: unknown) {
  //如果不是proxy 就返回value
  if (!value![ReactiveFlags.RAW]) {
    return value;
  }
  //如果是proxy 则触发getter
  return value![ReactiveFlags.RAW];
}
