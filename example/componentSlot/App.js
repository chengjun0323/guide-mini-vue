import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  setup() {
    return {};
  },
  render() {
    const app = h("div", {}, "App");
    // const foo = h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")]);
    // const foo = h(Foo, {}, h("p", {}, "123"));
    const foo = h(
      Foo,
      {},
      {
        header: ({age}) => h("div", {}, "header" + age),
        footer: () => h("div", {}, "footer"),
      }
    );
    return h("div", {}, [app, foo]);
  },
};
