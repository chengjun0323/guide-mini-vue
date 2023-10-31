import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup(props) {
    console.log(props, 'props');
  },
  render() {
    return h('div', {}, 'Foo: ' + this.count)
  }
};
