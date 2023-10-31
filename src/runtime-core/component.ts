import { shadowReadonly } from "../reactivity/reactive";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./compoonentProps";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  };
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  // initSlots()
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  // ctx
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shadowReadonly(instance.props));
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponent(instance);
}

function finishComponent(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
