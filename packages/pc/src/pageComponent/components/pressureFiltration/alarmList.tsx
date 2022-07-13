import { defineComponent } from "vue";

export default defineComponent({
  setup(this, props, ctx) {
    return () => (
      <div class="pressureFiltrationHome-right-alarm">
        <div class="title">
          <span>报警列表</span>
          <a-button type="link" style={{ paddingRight: "0" }}>
            更多
            <double-right-outlined style={{ margin: "0" }} />
          </a-button>
        </div>
        <ul class="list">
          <li>
            <div class="name">
              <exclamation-circle-filled class="icon" />
              601浓缩机耙压过大
            </div>
            <div class="time">2022-11-21 20:43:00</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>8053</div>
            <div>12板</div>
          </li>
          <li>
            <div>1</div>
            <div>11板</div>
          </li>
        </ul>
      </div>
    );
  },
});
