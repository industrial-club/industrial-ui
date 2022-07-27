import { defineComponent, ref } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "Task",
  setup(this, props, ctx) {
    const taskList = ref([
      {
        time: dayjs(),
        content: "411压滤机已经达到设定进料结束条件,请确认是否执行进料结束指令",
        duration: "1200",
        electricCurrent: "56.8A",
      },
    ]);
    return () => (
      <div class="task">
        {taskList.value.length > 0 ? (
          <ul class="task-list">
            {taskList.value.map((item) => (
              <li class="task-list-item">
                <div class="task-list-item-time">
                  <div>{dayjs(item.time).format("YYYY-MM-DD")}</div>
                  <div>{dayjs(item.time).format("HH:mm:ss")}</div>
                </div>
                <div class="task-list-item-details">
                  <div>{item.content}</div>
                  <div>进料时长：{item.duration}</div>
                  <div>入料泵电流：{item.electricCurrent}</div>
                </div>
                <div class="task-list-item-btn">
                  <a-button type="primary">确定</a-button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div class="empty">当前暂无待办任务</div>
        )}
      </div>
    );
  },
});
