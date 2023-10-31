import { isObject } from "../shared/index";
import {
  mutableHandlers,
  readonlyHandlers,
  shadowReadonlyHandlers,
} from "./baseHandlers";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function shadowReadonly(raw) {
  return createActiveObject(raw, shadowReadonlyHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createActiveObject(target, baseHandlers) {
  if(!isObject(target)) {
    console.warn(`target ${target}不是一个对象`);
    return target;
  }
  return new Proxy(target, baseHandlers);
}
