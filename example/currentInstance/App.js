import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from './Foo.js';

export const App = {
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    console.log(instance, "App");
  },
  render() {
    return h("div", {}, [h("p", {}, "currentInstance demo"), h(Foo)]);
  },
};
