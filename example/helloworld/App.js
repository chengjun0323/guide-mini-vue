import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    window.self = this
    return h(
      "div",
      {
        id: "app",
        class: ["red", "hard"],
        onClick() {
          console.log('click');
        },
        onMousedown() {
          console.log('mousedown');
        }
      },
      "hi, " + this.msg
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
