import { defineComponent } from "vue";

const props = {
  componentName: String,
};

export default defineComponent({
  name: "default",
  cname: "默认卡片",
  props,
  setup(_props, _ctx) {
    return () => <inl-card-box class="inl_card_default"></inl-card-box>;
  },
});
