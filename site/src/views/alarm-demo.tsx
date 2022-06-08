import { defineComponent } from "vue";

const AlarmDemo = defineComponent({
  setup() {
    return () => (
      <div class="alarm-demo">
        {/* <inl-alarm-record /> */}
        <inl-alarm-configure />
      </div>
    );
  },
});

export default AlarmDemo;
