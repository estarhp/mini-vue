import {
  reactive,
  ReactiveFlags,
  reactiveMap,
  readonly,
  readonlyMap,
  shallowReadonlyMap,
} from "./creativity";
import { isObject } from "@mini-vue/shared";
import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGetter = createGetter(true);
const shallowGetter = createGetter(true, true);
const readonlySetter = createSetter(true);

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: object, key: string, receiver: object) {
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly; //isReactive()
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly; //isReadonly()
    } else if (
      isExistInReactiveMap() ||
      isExistInReadonlyMap() ||
      isExistInShallowReadonlyMap()
    ) {
      return target; //toRaw()
    }
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      //触发依赖收集
      track(target, "get", key);
    }

    if (shallow) {
      return res; //shallowReadonly 不需要层级的转换行为
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter(readonly = false) {
  return function set(
    target: never,
    key: string,
    value: never,
    receiver: never,
  ) {
    if (readonly) {
      console.warn(
        `set operation on key ${String(key)} failed: target is readonly`,
        target,
      );
      return true;
    }
    const result = Reflect.set(target, key, value, receiver);
    //触发依赖

    trigger(target, "get", key);

    return result;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGetter,
  set: readonlySetter,
};

export const shallowHandlers = {
  get: shallowGetter,
  set: readonlySetter,
};
