import { defineComponent, ref, provide, onBeforeUpdate, inject } from "vue";
import { api } from "@/api/param";
import { IUrlObj } from "./index";

import { message } from "ant-design-vue";
import DynamicForm from "./dynamicForm";
import CollapseContainer from "./collapseContainer";

const TabItem = defineComponent({
  props: {
    tabId: {
      type: String,
      required: true,
    },
    completeKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    /* ===== 表单ref ===== */
    // 菜单级别form ref
    const groupFormRef = ref<any[]>([]);
    // cell级别form ref
    const cellFormRef = ref<any[]>([]);
    // 更新前需要清空ref数组
    onBeforeUpdate(() => {
      groupFormRef.value = [];
      cellFormRef.value = [];
    });

    /* 是否编辑状态 */
    const isEdit = ref(false);
    provide("isEdit", isEdit);

    /* ===== 获取菜单级别的参数 以及菜单下cell级别参数 ===== */
    const groupList = ref([]);
    const getGoupAndCellParams = async () => {
      // 组级别
      const { data: groupRes } = await api.getGroupList(urlMap.list)({
        level: "group",
        parentId: props.tabId,
      });
      const validGroupList = groupRes.filter((item: any) => item.valid);
      // cell级别 (使用promise.all 防止阻塞)
      const cellPromises: Array<Promise<any>> = [];
      validGroupList.forEach((item: any) => {
        cellPromises.push(
          api.getGroupList(urlMap.list)({
            level: "cell",
            parentId: item.id,
          })
        );
        item._children = [];
      });
      const resList = await Promise.all(cellPromises);
      // 遍历结果 通过index映射存入到group中的_children中
      resList.forEach(({ data }, index) => {
        groupRes[index]._children = data.filter((item: any) => item.valid);
      });
      groupList.value = validGroupList;
    };
    getGoupAndCellParams();

    /* ===== 保存 ===== */
    const handleSave = async () => {
      const allFormRef = [...groupFormRef.value, ...cellFormRef.value];

      // 验证表单
      const validateList: Promise<any>[] = [];
      allFormRef.forEach((item) => {
        validateList.push(item._confirm());
      });
      // 转换结果
      const formList = (await Promise.all(validateList)).reduce(
        (prev, curr) => {
          // 展平 & 映射
          prev.push(
            ...curr.map((item: any) => {
              return {
                ...item.valueDefine,
                value: item.value,
                completeKey: `${props.completeKey}.${item.key}`,
              };
            })
          );
          return prev;
        },
        []
      );
      await api.batchSaveParamsValue(urlMap.save)(formList);
      message.success("保存成功");
      // 更新表单的值
      const updateFormList: Promise<any>[] = [];
      allFormRef.forEach((item) => updateFormList.push(item._update()));
      await Promise.all(updateFormList);
      isEdit.value = false;
    };

    return () => (
      <div class="tab-item">
        {/* 编辑按钮 */}
        <div class="operation">
          <a-space>
            {isEdit.value ? (
              <>
                <a-button
                  key="cancle"
                  style={{ width: "100px" }}
                  onClick={() => (isEdit.value = false)}
                >
                  取消
                </a-button>
                <a-button
                  key="save"
                  style={{ width: "100px" }}
                  type="primary"
                  onClick={handleSave}
                >
                  保存
                </a-button>
              </>
            ) : (
              <a-button
                key="edit"
                style={{ width: "100px" }}
                type="primary"
                onClick={() => (isEdit.value = true)}
              >
                编辑
              </a-button>
            )}
          </a-space>
        </div>
        {/* 标签级别的参数 (暂时不要) */}
        {/* <DynamicForm id={props.tabId} /> */}
        {/* 菜单级别 列表 */}
        <div class="group-container">
          {groupList.value.length ? (
            groupList.value.map((item: any, index) => (
              <div class="group-item" key={item.id}>
                <h2 class="group-item-title">{item.name}</h2>
                <DynamicForm
                  key={item.id}
                  ref={(ins: any) => (groupFormRef.value[index] = ins)}
                  id={item.id}
                  code={item.code}
                />

                {/* 二级菜单 多个 */}
                <div class="second-menu-container">
                  {(item._children ?? []).map((cell: any, index: number) => (
                    <CollapseContainer key={item.id} title={cell.name}>
                      <DynamicForm
                        ref={(ins: any) => (cellFormRef.value[index] = ins)}
                        id={cell.id}
                        code={`${item.code}.${cell.code}`}
                      />
                    </CollapseContainer>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <a-empty />
          )}
        </div>
      </div>
    );
  },
});

export default TabItem;
