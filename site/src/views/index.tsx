import { defineComponent } from "vue";
import buttonDemo from "./button";
import menuDemo from "./menu";
import formDemo from "./form";
import videoDemo from "./video";
import baseDemo from "./base-demo";

export default defineComponent({
  setup() {
    return () => (
      <div style={{ backgroundColor: "#fff", height: "100%" }}>
        <buttonDemo></buttonDemo>
        <menuDemo></menuDemo>
        <formDemo></formDemo>
        {/* <videoDemo></videoDemo> */}
        {/* <baseDemo></baseDemo> */}
      </div>
    );
  },
  components: {
    buttonDemo,
    menuDemo,
    formDemo,
    videoDemo,
    baseDemo,
  },
});
