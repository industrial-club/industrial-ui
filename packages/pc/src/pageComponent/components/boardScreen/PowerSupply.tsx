import { defineComponent, PropType, ref } from "vue";
import dayjs from "dayjs";
import Card1Outer from "@/pageComponent/components/boardScreen/Card1Outer";

const props = {
  list: {
    type: Array as PropType<Array<any>>,
    default: [],
  },
};

export default defineComponent({
  components: {
    Card1Outer,
  },
  props,
  setup(this, _props, _ctx) {
    const collapseId = ref("");

    const isExpand = (item: any) => {
      return collapseId.value === item.loopId;
    };

    const collapseClick = (item: any) => {
      if (collapseId.value === item.loopId) {
        collapseId.value = "";
      } else {
        collapseId.value = item.loopId;
      }
    };
    return () => (
      <div class="power power-supply">
        {_props.list.map((item) => (
          <div class="power-item">
            <card1-outer
              class={[isExpand(item) ? "card-expand" : ""]}
              title={`${item.equipCode} ${item.equipName}`}
            >
              {isExpand(item) ? (
                <a-row gutter={[0, 6]}>
                  <a-col span={12}>申请人：{item.applyUserName}</a-col>
                  <a-col span={12}>
                    任务状态：<span class="mark">{item.taskStatus}</span>
                  </a-col>
                  <a-col span={12}>申请部门：{item.applyDeptName}</a-col>
                  <a-col span={12}>
                    申请时间：
                    {item.applyDate
                      ? dayjs(item.applyDate).format("YYYY.MM.DD HH:mm")
                      : "-"}
                  </a-col>
                  <a-col span={12}>停电原因：{item.powerCause}</a-col>
                  <a-col span={12}>送电操作人：{item.powerUserName}</a-col>
                </a-row>
              ) : null}

              <a-row class="special" gutter={[0, 6]}>
                <a-col span={24}>
                  计划停电时间：
                  {item.planPowerStartTime
                    ? dayjs(item.planPowerStartTime).format("YYYY.MM.DD HH:mm")
                    : "-"}
                  ——
                  {item.planPowerEndTime
                    ? dayjs(item.planPowerEndTime).format("YYYY.MM.DD HH:mm")
                    : "-"}
                </a-col>
              </a-row>
              {isExpand(item) ? (
                <>
                  <div class="block-title">设备信息</div>
                  <a-row gutter={[0, 6]}>
                    <a-col span={12}>设备位置：{item.spaName}</a-col>
                    <a-col span={12}>所属配电室：{item.roomName}</a-col>
                    <a-col span={12}>所属配电柜：{item.cabinetName}</a-col>
                    <a-col span={12}>所属回路：{item.loopName}</a-col>
                  </a-row>
                </>
              ) : null}
              <div
                class="collapse-btn"
                onClick={() => {
                  collapseClick(item);
                }}
              >
                {isExpand(item) ? (
                  <a-icon type="caret-up" />
                ) : (
                  <a-icon type="caret-down" />
                )}
              </div>
            </card1-outer>
          </div>
        ))}
      </div>
    );
  },
});
