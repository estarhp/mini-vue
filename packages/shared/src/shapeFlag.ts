export const enum ShapeFlag {
  ELEMENT = 1,
  STATEFUL_COMPONENT = 1 << 2, //组件类型
  TEXT_CHILDREN = 1 << 3, //string 类型的children
  ARRAY_CHILDREN = 1 << 4, //数组类型的children
  SLOTS_CHILDREN = 1 << 5, //插槽类型
}
