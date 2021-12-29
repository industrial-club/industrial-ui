import { defineComponent } from "vue";
import installComponent from "../installComponent";
import { className } from "../../util";

const com = defineComponent({
  setup(_props, _context) {
    className("");
    return () => <div class="inl-button"></div>;
  },
});

export default installComponent(com, "inl-button");
