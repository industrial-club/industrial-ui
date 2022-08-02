import { defineComponent, PropType } from "vue";
import dayjs, { Dayjs } from "dayjs";

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
                {item.name}
              </div>
              <div class="time">
                {dayjs(item.firstAlarmTime).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});
