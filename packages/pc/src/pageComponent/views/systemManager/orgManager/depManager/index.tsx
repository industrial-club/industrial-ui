/*
 * @Abstract: 部门管理
 * @Author: wang liang
 * @Date: 2022-04-05 10:23:24
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 16:17:00
 */
import { defineComponent, PropType, provide, ref, watch } from "vue";
import useBus from "@/pageComponent/hooks/useBus";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import { isEmpty } from "lodash";
import api, { setInstance } from "@/api/org/depManager";
import utils from "@/utils";

import EmployeeTable from "./employeeTable";
import DepTree from "./depTree";
import UpdateDepDialog from "./updateDepDialog";

export interface IUrlObj {
  // 部门树结构列表
  tree: string;
  // 部门详情
  detail: string;
  // 新增部门
  add: string;
  // 更新部门
  update: string;
  // 删除部门
  delete: string;
  // 部门排序
  sort: string;
  // 部门下的员工下拉列表
  empSelect: string;

  // 人员列表
  empList: string;
  // 人员详情
  empDetail: string;
  // 新增人员
  addEmp: string;
  // 编辑人员
  updateEmp: string;
  // 删除人员
  deleteEmp: string;
  // 岗位下拉列表
  postSelect: string;
  // 同步智信组织架构
  sync: string;
}

const DepManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    prefix: {
      type: String,
    },
    serverName: {
      type: String,
    },
    dividerGap: {
      type: Number,
      default: 24,
    },
    dividerColor: {
      type: String,
      default: "#EFF2F6",
    },
  },
  setup(prop, context) {
    setInstance({ prefix: prop.prefix, serverName: prop.serverName });
    const urlMap = { ...prop.url };
    provide("urlMap", urlMap);
    provide("urlPrefix", {
      prefix: prop.prefix,
      serverName: prop.serverName,
    });

    const bus = useBus("system");

    const currDep = ref<any>({});
    const parentDepName = ref("");

    /* 选中部门 */
    const handleSelectDep = async (dep: any) => {
      if (dep) {
        if (dep.isSystem) {
          currDep.value = dep;
        } else {
          const { data } = await api.getDetail(urlMap.detail)(dep.id);
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
        <div
          class="divider"
          style={{
            margin: `${-prop.dividerGap}px 20px ${-prop.dividerGap}px 0`,
            background: prop.dividerColor,
          }}
        ></div>
        <div class="right">
          {/* 基本信息 */}
          <div class="basic-info">
            <div class="basic-info-header">
              <span class="basic-info-title">基本详情</span>
              <a-space>
                <a-button
                  type="primary"
                  disabled={currDep.value?.isSystem || isEmpty(currDep.value)}
                  onClick={handleEditClick}
                >
                  编辑
                </a-button>
              </a-space>
            </div>
            <a-descriptions column={3}>
              <a-descriptions-item label="部门ID编号">
                {currDep.value.code}
              </a-descriptions-item>
              <a-descriptions-item label="部门名称">
                {currDep.value.name}
              </a-descriptions-item>
              <a-descriptions-item label="上级部门">
                {parentDepName.value}
              </a-descriptions-item>
              <a-descriptions-item label="部门负责人">
                {currDep.value.bossName}
              </a-descriptions-item>
              <a-descriptions-item label="部门状态">
                {currDep.value.valid !== undefined &&
                  (currDep.value.valid ? "启用" : "禁用")}
              </a-descriptions-item>
            </a-descriptions>
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

export default utils.installComponent(DepManager, "dep-manager");
