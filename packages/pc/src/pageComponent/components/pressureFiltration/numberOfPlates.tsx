import { defineComponent, PropType, watch } from "vue";

const props = {
  data: {
    type: Array as PropType<Array<{ [key: string]: string | number | null }>>,
    default: [],
  },
};

export default defineComponent({
  props,
  setup(this, _props, _ctx) {
    return () => (
      <div class="pressureFiltrationHome-right-parameter">
        <div class="title">
          <span>板数统计</span>
          {/* <a-button type="link" v-slots={{ icon: () => <delete-outlined /> }}>
            板数清零
          </a-button> */}
        </div>
        <ul class="list">
          {_props.data.map((item) => (
            <li>
              <div>{item.ylCode}</div>
              <div>{item.plateCountDesc}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});
