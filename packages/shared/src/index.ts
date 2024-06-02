export function isObject(val: unknown) {
  return val !== null && typeof val === "object";
}

export const extend = Object.assign;

export function hasChanged(value: unknown, newValue: unknown) {
  return !Object.is(value, newValue);
}
