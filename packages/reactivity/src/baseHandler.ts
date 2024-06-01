import {
  ReactiveFlags,
  reactiveMap,
  readonlyMap,
  shallowReadonlyMap,
} from "./creativity";

const get = createGetter();
const set = createSetter();

function createGetter(isReadonly = false) {
  return function get(target: object, key: string, receiver: object) {
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (
      isExistInReactiveMap() ||
      isExistInReadonlyMap() ||
      isExistInShallowReadonlyMap()
    ) {
      return target;
    }
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      //触发依赖收集
    }

    return res;
  };
}

function createSetter() {
  return function set(
    target: never,
    key: string,
    value: never,
    receiver: never,
  ) {
    const result = Reflect.set(target, key, value, receiver);
    //触发依赖

    return result;
  };
}

export const mutableHandler = {
  get,
  set,
};
