import { defineComponent } from "vue";

export default defineComponent({
  name: "card_3",
  setup(props, ctx) {
    return () => (
      <inl-card-box>
        <img src="http://192.168.5.66/assets/imgs/cards/card24.png" alt="" />
      </inl-card-box>
    );
  },
});
