import { defineComponent } from "vue";
import util from "inl-util";

const { className, installComponent } = util;
const com = defineComponent({
  setup(_props, _context) {
    className("");
    return () => <div class="inl-button"></div>;
  },
});

export default installComponent(com, "inl-button");
