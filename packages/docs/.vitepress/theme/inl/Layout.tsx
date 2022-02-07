import { defineComponent } from "vue";
import sid from "./SideBar";
import headerInl from "./header";

export default defineComponent({
  components: { sid, headerInl },
  setup(_prop, _context) {
    const isRootPath = window.location.pathname !== "/";
    return () => (
      <inl-layout isBody arrange="column">
        {isRootPath ? <headerInl /> : ""}
        <inl-layout style={{ flex: 1 }}>
          {isRootPath ? <sid /> : ""}
          <inl-layout class="content">
            <content class="markdown-body" />
          </inl-layout>
        </inl-layout>
      </inl-layout>
    );
  },
});
