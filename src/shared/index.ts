export const extend = Object.assign;

export const isObject = (target) => {
  return target !== null && typeof target === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(newValue, val);
};
