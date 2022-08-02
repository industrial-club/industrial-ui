import { defineComponent } from "vue";
const Factory = defineComponent({
  setup() {
    return () => (
      <div class="factory-demo">
        <inl-factory-manage />
      </div>
    );
  },
});

export default Factory;
