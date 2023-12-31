import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "app",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mousedown");
        },
      },
      [h("div", {}, "hi, " + this.msg), h(Foo, { count: 1 })]
      // "hi, " + this.msg
      // string
      // "hi, mini-vue"
      // array
      // [
      //   h('p', {class: 'red'}, 'hi'),
      //   h('p', {class: 'blue'}, 'mini-vue')
      // ]
    );
  },
  setup() {
    return {
      msg: "mini-vue233",
    };
  },
};
