import { defineComponent } from "vue";
import inl from "inl-ui";
const { theme } = inl.utils;
const SystemSetting = defineComponent({
  setup() {
    const setTheme = (e: string) => {
      theme.set(e);
    };
    return () => (
      <div class="alarm-demo">
        <inl-system-setting versions="AB" onSetTheme={setTheme} />
        {/* <inl-alarm-configure /> */}
      </div>
    );
  },
});

export default SystemSetting;
