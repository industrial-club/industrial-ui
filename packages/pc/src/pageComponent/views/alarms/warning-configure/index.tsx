import { defineComponent, PropType, provide, ref } from "vue";
import ConfigureTable from "./configure-table";
import AddWarningConfig from "@/pageComponent/views/alarms/add-warning-configure";
import utils from "@/utils";

export interface IUrlObj {
  // 规则列表
  ruleList: string;
  // 规则详情
  getDetail: string;
  // 更新规则/新增规则
  updateRule: string;
  // 启用/禁用
  switchEnable: string;
  // 删除规则
  deleteRule: string;
  // 批量上传规则
  upload: string;
  // 获取所有系统
  baseAll: string;
  // 获取系统下的设备列表
  instanceList: string;
  // 获取设备对应的信号列表
  propertiesList: string;
  // 部门人员树结构
  depTree: string;
  // 获取参数
  getEnum: string;
}

const WarningConfigure = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const urlObj = { ...props.url };
    provide("urlObj", urlObj);

    const isAddShow = ref(false);
    const detailId = ref();

    const handleShowAdd = (record: any) => {
      detailId.value = record ? record.id : undefined;
      isAddShow.value = true;
    };

    return () => (
      <div class="index">
        {isAddShow.value ? (
          <AddWarningConfig
            id={detailId.value}
            onClose={() => (isAddShow.value = false)}
          />
        ) : (
          <ConfigureTable onShowAdd={handleShowAdd} />
        )}
      </div>
    );
  },
});

export default utils.installComponent(WarningConfigure, "alarm-configure");
