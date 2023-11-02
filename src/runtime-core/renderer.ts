import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(initialVNode, container) {
  // patch
  patch(initialVNode, container);
}

function patch(initialVNode, container) {
  // 判断是 component 还是 element，分别处理
  // Fragment 只渲染 children
  const { type, shapeFlag } = initialVNode;
  switch (type) {
    case Fragment:
      processFragment(initialVNode, container);
      break;
    case Text:
      processText(initialVNode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(initialVNode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(initialVNode, container);
      }
      break;
  }
}

function processFragment(initialVNode, container) {
  mountChildren(initialVNode, container);
}

function processText(initialVNode, container) {
  const { children } = initialVNode;
  const textNode = (initialVNode.el = document.createTextNode(children));
  container.append(textNode);
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
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      el.addEventListener(key.slice(2).toLowerCase(), props[key]);
    }
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
