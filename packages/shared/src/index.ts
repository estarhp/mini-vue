export function isObject(val: unknown) {
  return val !== null && typeof val === "object";
}

export const extend = Object.assign;
