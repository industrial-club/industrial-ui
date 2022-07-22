import { defineComponent } from "vue";

export default defineComponent({
  name: "default",
  cname: "默认卡片",
  setup(props, ctx) {
    return () => <inl-card-box class="inl_card_default"></inl-card-box>;
  },
});
