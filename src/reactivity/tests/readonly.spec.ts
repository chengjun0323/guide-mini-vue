import { isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    // not set
    const original = {
      foo: 1,
      bar: {
        baz: 2,
      },
    };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(wrapped.foo).toBe(1);
  });

  it("warn", () => {
    // console.log
    // mock
    console.warn = jest.fn();
    const user = readonly({
      age: 10,
    });
    user.age = 11;

    expect(console.warn).toBeCalled();
  });
});
