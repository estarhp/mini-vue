// 存储所有的effect 对象
export function createDep(effects?) {
  return new Set(effects);
}
