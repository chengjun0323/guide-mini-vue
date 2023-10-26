import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(initialVNode, container) {
  // patch
  patch(initialVNode, container);
}

function patch(initialVNode, container) {
  // 判断是 component 还是 element，分别处理
  // 处理组件
  // 思考：如何区别是 element 还是 component 类型
  const { shapeFlag } = initialVNode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(initialVNode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(initialVNode, container);
  }
}

function processElement(initialVNode: any, container: any) {
  mountElement(initialVNode, container);
}

function mountElement(initialVNode: any, container: any) {
  const { type, props, children, shapeFlag } = initialVNode;
  const el = (initialVNode.el = document.createElement(type));
  // string array
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(initialVNode, el);
  }
  // props
  for (let key in props) {
    el.setAttribute(key, props[key]);
  }

  container.append(el);
}

function mountChildren(initialVNode, el) {
  initialVNode.children.forEach((v) => {
    patch(v, el);
  });
}

function processComponent(initialVNode: any, container: any) {
  mountComponent(initialVNode, container);
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  // initialVNode -> element -> mountElement
  patch(subTree, container);
  initialVNode.el = subTree.el;
}
