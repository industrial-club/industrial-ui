import { defineComponent } from "vue";

export default defineComponent({
  name: "alarm",
  cname: "报警模块图表",
  setup(props, ctx) {
    return () => (
      <img src="http://192.168.5.66/assets/imgs/cards/card27.png" alt="" />
    );
  },
});
