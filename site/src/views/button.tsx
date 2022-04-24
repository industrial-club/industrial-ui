import { defineComponent } from "vue";
import { Button } from "ant-design-vue";

export default defineComponent({
  setup() {
    return () => (
      <div class={"button-demo"}>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
        <Button danger type="dashed">
          Dashed Button
        </Button>
      </div>
    );
  },
});
