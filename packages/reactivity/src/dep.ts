// 存储所有的effect 对象
import { ReactiveEffect } from "./effect";

export function createDep(effects?: ReactiveEffect[]): Set<ReactiveEffect> {
  return new Set(effects);
}
