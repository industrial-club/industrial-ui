import { defineComponent } from "vue";
import sid from "./SideBar";

export default defineComponent({
  components: { sid },
  setup(_prop, _context) {
    return () => (
      <inl-layout isBody arrange="column">
        <inl-layout-header></inl-layout-header>
        <inl-layout style={{ flex: 1 }}>
          <sid />
          <inl-layout class="content">
            <content class="markdown-body" />
          </inl-layout>
        </inl-layout>
      </inl-layout>
    );
  },
});
