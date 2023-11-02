import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  // instance.prop -> event 
  const { props } = instance;
  // TPP
  // 先写一个特定行为 -> 重构为通用行为
  // add -> Add -> onAdd
  // add-foo -> addFoo -> onAddFoo
 
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
