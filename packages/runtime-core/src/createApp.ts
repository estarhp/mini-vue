import { createVNode } from "./vnode";

export function createAppAPI(
  render: (vnode: object, container: HTMLElement) => void,
) {
  return function createApp(rootComponent: never) {
    return {
      _component: rootComponent,
      mount(rootContainer: HTMLElement) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
