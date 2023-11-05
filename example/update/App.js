import { ref, h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);

    const onClick = () => {
      count.value++;
    };

    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", { class: "App" }, [
      h("div", {}, "count:" + this.count),
      h("button", { onClick: this.onClick }, "click"),
    ]);
  },
};