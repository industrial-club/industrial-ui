import { defineComponent, PropType } from "vue";

const props = {
  data: {
    type: Array as PropType<Array<{ [key: string]: string }>>,
    default: [],
  },
};

export default defineComponent({
  props,
  setup(this, _props, _ctx) {
    return () => (
      <div class="pressureFiltrationHome-right-alarm">
        <div class="title">
          <span>报警列表</span>
        </div>
        <ul class="list">
          {_props.data.map((item) => (
            <li>
              <div class="name">
                <exclamation-circle-filled class="icon" />
                601浓缩机耙压过大
              </div>
              <div class="time">2022-11-21 20:43:00</div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});
