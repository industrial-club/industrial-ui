import { defineComponent, ref, watch } from "vue";
import utils from "@/utils";

const changeThemeBtn = defineComponent({
  setup(prop, context) {
    const theme = ref(localStorage.getItem("theme") || "dark");

    watch(
      theme,
      () => {
        if (theme.value === "dark") {
          document
            .getElementsByTagName("html")[0]
            .setAttribute("data-doc-theme", "dark");
          document
            .getElementsByTagName("body")[0]
            .setAttribute("data-theme", "dark");
          document.getElementsByTagName("html")[0].style.colorScheme = "dark";
        } else {
          document
            .getElementsByTagName("html")[0]
            .setAttribute("data-doc-theme", "light");
          document
            .getElementsByTagName("body")[0]
            .setAttribute("data-theme", "light");
          document.getElementsByTagName("html")[0].style.colorScheme = "light";
        }
        window.localStorage.setItem("theme", theme.value);
        context.emit("change", theme.value);
      },
      { immediate: true }
    );
    return () => (
      <a-select
        ref="select"
        v-models={[[theme.value, "value"]]}
        style="width: 120px"
      >
        <a-select-option value="default">默认主题</a-select-option>
        <a-select-option value="dark">黑色主题</a-select-option>
      </a-select>
    );
  },
});

export type themeName = "dark" | "light";
export default utils.installComponent(changeThemeBtn, "change-theme-select");
