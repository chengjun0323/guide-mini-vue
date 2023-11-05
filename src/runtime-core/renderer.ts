import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // patch
  patch(null, vnode, container, null);
}

function patch(n1, n2, container, parentComponent) {
  // 判断是 component 还是 element，分别处理
  // Fragment 只渲染 children
  const { type, shapeFlag } = n2;
  switch (type) {
    case Fragment:
      processFragment(n1, n2, container, parentComponent);
      break;
    case Text:
      processText(n1, n2, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(n1, n2, container, parentComponent);
      }
      break;
  }
}

function processFragment(n1, n2, container, parentComponent) {
  mountChildren(n2, container, parentComponent);
}

function processText(n1, n2, container) {
  const { children } = n2;
  const textNode = (n2.el = document.createTextNode(children));
  container.append(textNode);
}

function processElement(n1, n2: any, container: any, parentComponent) {
  if (!n1) {
    mountElement(n2, container, parentComponent);
  } else {
    patchElement(n1, n2, container);
  }
}

function patchElement(n1, n2, container) {
  console.log("n1", n1);
  console.log("n2", n2);
}

function mountElement(vnode: any, container: any, parentComponent) {
  const { type, props, children, shapeFlag } = vnode;
  const el = (vnode.el = document.createElement(type));
  // string array
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
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

function mountChildren(vnode, el, parentComponent) {
  vnode.children.forEach((v) => {
    patch(null, v, el, parentComponent);
  });
}

function processComponent(n1, n2: any, container: any, parentComponent) {
  mountComponent(n2, container, parentComponent);
}

function mountComponent(vnode: any, container: any, parentComponent) {
  const instance = createComponentInstance(vnode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container) {
  effect(() => {
    if (!instance.isMounted) {
      console.log("init");
      const { proxy } = instance;
      const subTree = (instance.subTree = instance.render.call(proxy));
      // vnode -> element -> mountElement
      patch(null, subTree, container, instance);
      vnode.el = subTree.el;
      instance.isMounted = true;
    } else {
      console.log("update");
      const { proxy } = instance;
      const subTree = instance.render.call(proxy);
      const prevSubTree = instance.subTree;
      instance.subTree = subTree;

      patch(prevSubTree, subTree, container, instance);
    }
  });
}
