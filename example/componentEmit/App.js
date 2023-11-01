import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  setup() {
    return {};
  },
  render() {
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        }
      }),
    ]);
  },
};
