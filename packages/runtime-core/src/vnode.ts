import { ShapeFlag } from "@mini-vue/shared";

export function createVNode(
  type: typeof TEXT | typeof FRAGMENT | string | object,
  props: { key?: string },
  children?: unknown[] | string,
) {
  const vnode = {
    el: null,
    component: null,
    key: props?.key,
    type,
    props: props || {},
    children,
    shapeFlag: getShapeFlag(type),
  };
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlag.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlag.TEXT_CHILDREN;
  }

  return vnode;
}

export function createTextVNode(text: string = "") {
  return createVNode(TEXT, {}, text);
}

export function normalizeChildren(
  vnode,
  children: unknown[] | string | object,
) {
  if (typeof children === "object") {
    if (vnode.shapeFlag & ShapeFlag.ELEMENT) {
      //如果是element 类型
    } else {
      vnode.shapeFlag |= ShapeFlag.SLOTS_CHILDREN;
    }
  }
}

//根据type判断是什么类型的组件
export function getShapeFlag(type: unknown) {
  return typeof type === "string"
    ? ShapeFlag.TEXT_CHILDREN
    : ShapeFlag.STATEFUL_COMPONENT;
}

export const TEXT = Symbol("Text");
export const FRAGMENT = Symbol("Fragment");

//标准化vnode
export function normalizeVNode(child: string | number | object) {
  if (typeof child === "string" || typeof child === "number") {
    return createVNode(TEXT, {}, String(child));
  }
  return child;
}
