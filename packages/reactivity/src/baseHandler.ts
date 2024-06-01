const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target: object, key: string, receiver: unknown) {
    return Reflect.get(target, key, receiver);
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
