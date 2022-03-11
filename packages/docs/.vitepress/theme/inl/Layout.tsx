import { defineComponent, onMounted, ref } from "vue";
import sid from "./SideBar";
import headerInl from "./header";

export default defineComponent({
  components: { sid, headerInl },
  setup(_prop, _context) {
    let isRootPath = ref<boolean>(false);
    onMounted(() => {
      isRootPath.value = window.location.pathname !== "/";
    });
    return () => (
      <inl-layout isBody arrange="column">
        {isRootPath.value ? <headerInl /> : ""}
        <inl-layout style={{ flex: 1 }}>
          {isRootPath.value ? <sid /> : ""}
          <inl-layout class="content">
            <content class="markdown-body" />
          </inl-layout>
        </inl-layout>
      </inl-layout>
    );
  },
});
