import { defineComponent } from "vue";

export default defineComponent({
  name: "card_4",
  setup(props, ctx) {
    return () => (
      <div>
        <img src="http://192.168.5.66/assets/imgs/cards/card25.png" alt="" />
      </div>
    );
  },
});
