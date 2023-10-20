import { isReadonly, shadowReadonly } from "../reactive";

describe("shadowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shadowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });

  it("warn", () => {
    // console.log
    // mock
    console.warn = jest.fn();
    const user = shadowReadonly({
      age: 10,
    });
    user.age = 11;

    expect(console.warn).toBeCalled();
  });
});
