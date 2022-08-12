import { defineComponent } from "vue";

export default defineComponent({
  name: "card_2",
  setup(props, ctx) {
    return () => (
      <img src="http://192.168.5.66/assets/imgs/cards/card28.png" alt="" />
    );
  },
});
