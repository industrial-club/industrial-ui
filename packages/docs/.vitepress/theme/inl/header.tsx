import { defineComponent } from "vue";
import { withBase } from "vitepress";
export default defineComponent({
  components: {},
  setup(_prop, _context) {
    return () => (
      <inl-layout-header height={60}>
        <img
          src={withBase("assets/imgs/mt_icon.png")}
          style={{
            height: "60px",
          }}
        />
      </inl-layout-header>
    );
  },
});
