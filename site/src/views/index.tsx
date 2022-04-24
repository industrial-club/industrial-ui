import { defineComponent } from "vue";
import buttonDemo from "./button";
import menuDemo from "./menu";
import formDemo from "./form";

export default defineComponent({
  setup() {
    return () => (
      <div style={{ backgroundColor: "#fff", height: "100%" }}>
        <buttonDemo></buttonDemo>
        <menuDemo></menuDemo>
        <formDemo></formDemo>
      </div>
    );
  },
  components: {
    buttonDemo,
    menuDemo,
    formDemo,
  },
});
