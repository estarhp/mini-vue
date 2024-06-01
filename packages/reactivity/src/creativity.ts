import { mutableHandler } from "./baseHandler";

export const creativeMap = new WeakMap();
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
  return createCreativeObject(target, creativeMap, mutableHandler);
}
