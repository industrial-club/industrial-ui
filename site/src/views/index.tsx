import { defineComponent } from "vue";
import buttonDemo from "./button";
import menuDemo from "./menu";
import formDemo from "./form";
import videoDemo from "./video";
import baseDemo from "./base-demo";
import alarmDemo from "./alarm-demo";
import systemSetting from "./ststemSetting-demo";
import factoryDemo from "./factory";

export default defineComponent({
  setup() {
    return () => (
      <div style={{ backgroundColor: "#fff", height: "100%", padding: "24px" }}>
        {/* <buttonDemo></buttonDemo>
        <menuDemo></menuDemo>
        <formDemo></formDemo> */}
        {/* <videoDemo></videoDemo> */}
        <baseDemo></baseDemo>
        {/* <alarm-demo></alarm-demo> */}

        {/* <systemSetting></systemSetting> */}
        {/* <factoryDemo /> */}
      </div>
    );
  },
  components: {
    buttonDemo,
    menuDemo,
    formDemo,
    videoDemo,
    baseDemo,
    alarmDemo,
    systemSetting,
    factoryDemo,
  },
});
