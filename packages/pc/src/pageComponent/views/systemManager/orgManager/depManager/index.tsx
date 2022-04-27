/*
 * @Abstract: 部门管理
 * @Author: wang liang
 * @Date: 2022-04-05 10:23:24
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 16:17:00
 */
import { defineComponent, ref, watch } from "vue";
import useBus from "@/pageComponent/hooks/useBus";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import { isEmpty } from "lodash";
import api from "@/pageComponent/api/org/depManager";

import {
  Button,
  Space,
  Descriptions,
  DescriptionsItem,
  message,
} from "ant-design-vue";
import EmployeeTable from "./employeeTable";
import DepTree from "./depTree";
import UpdateDepDialog from "./updateDepDialog";

export default defineComponent({
  setup(prop, context) {
    const bus = useBus("system");

    const currDep = ref<any>({});
    const parentDepName = ref("");

    /* 选中部门 */
    const handleSelectDep = async (dep: any) => {
      if (dep) {
        if (dep.isSystem) {
          currDep.value = dep;
        } else {
          const { data } = await api.getDetail(dep.id);
          currDep.value = data ?? {};
          parentDepName.value = dep.parent.node.name;
        }
      } else {
        currDep.value = {};
      }
    };

    /* 刷新部门 */
    const handleRefresh = () => bus.emit("tree/refresh");

    // 编辑
    const [isEditDialogShow, handleEditClick] = useModalVisibleControl();

    return () => (
      <div class="depManager">
        {/* 左侧树结构 */}
        <div class="left">
          <DepTree onSelect={handleSelectDep} />
        </div>
        <div class="right">
          {/* 基本信息 */}
          <div class="basic-info">
            <div class="basic-info-header">
              <span class="basic-info-title">基本详情</span>
              <Space>
                <Button
                  type="primary"
                  disabled={currDep.value?.isSystem || isEmpty(currDep.value)}
                  onClick={handleEditClick}
                >
                  编辑
                </Button>
              </Space>
            </div>
            <Descriptions column={3}>
              <DescriptionsItem label="部门ID编号">
                {currDep.value.code}
              </DescriptionsItem>
              <DescriptionsItem label="部门名称">
                {currDep.value.name}
              </DescriptionsItem>
              <DescriptionsItem label="上级部门">
                {parentDepName.value}
              </DescriptionsItem>
              <DescriptionsItem label="部门负责人">
                {currDep.value.bossName}
              </DescriptionsItem>
              <DescriptionsItem label="部门状态">
                {currDep.value.valid !== undefined &&
                  (currDep.value.valid ? "启用" : "禁用")}
              </DescriptionsItem>
            </Descriptions>
          </div>
          {/* 人员表格 */}
          <div class="employee-container">
            <h2 class="title">部门人员详情</h2>
            <EmployeeTable
              depId={currDep.value?.id}
              isValid={currDep.value?.valid === 1}
            />
          </div>

          <UpdateDepDialog
            mode="edit"
            record={currDep.value ?? {}}
            v-model={[isEditDialogShow.value, "visible"]}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    );
  },
});
