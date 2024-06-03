import { createVNode } from "./vnode";

export function h(
  type: string | object,
  props: unknown | null = null,
  children: string | unknown[],
) {
  return createVNode(type, props, children);
}
