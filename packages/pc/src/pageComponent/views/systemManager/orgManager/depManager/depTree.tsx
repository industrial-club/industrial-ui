/*
 * @Abstract: 部门 树结构
 * @Author: wang liang
 * @Date: 2022-04-07 14:41:29
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 13:15:32
 */

import { defineComponent, ref, onMounted } from "vue";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import { removeDateProp } from "@/pageComponent/utils/tree";
import api from "@/pageComponent/api/org/depManager";

import CommonTree from "@/pageComponent/components/CommonTree";
import UpdateDepDialog from "./updateDepDialog";
import { message } from "ant-design-vue";

const DepTree = defineComponent({
  props: {
    onSelect: {
      type: Function,
    },
  },
  setup(props) {
    const treeRef = ref();

    // 获取数据
    let refresh: () => void;

    onMounted(() => (refresh = treeRef.value._refresh));

    const getTreeData = async (keyword = "") => {
      const { data } = await api.getDepData({ keyword });
      const res = [data].map((item: any) => {
        item.id = `sys${item.id}`;
        item.subList = item.departmentList;
        item.isSystem = true;
        return item;
      });
      return res;
    };

    // 选中部门
    const handleSelect = (node: any) => {
      props.onSelect?.(node);
    };

    /* 节点操作 */
    // 添加部门
    const [isAddDepDialogShow, handleAddDepClick, addDepParent] =
      useModalVisibleControl();
    // 编辑部门
    const [isEditDepDialogShow, handleEditDepClick, editDepRecord] =
      useModalVisibleControl();
    // 删除部门
    const hanldeDeleteDep = async (node: any) => {
      await api.deleteDepById(node.id);
      message.success("删除成功");
      refresh();
    };
    // 部门排序
    const hanldeDrop = async (data: any) => {
      removeDateProp(data);
      await api.sortDepList(data[0]);
      message.success("排序成功");
      refresh();
    };

    return () => (
      <div class="dep-tree">
        <CommonTree
          ref={treeRef}
          getData={getTreeData}
          isJSONOperation={false}
          onAdd={handleAddDepClick}
          onEdit={handleEditDepClick}
          onDelete={hanldeDeleteDep}
          onDrop={hanldeDrop}
          onSelect={handleSelect}
        />

        {/* 添加部门 */}
        <UpdateDepDialog
          mode="add"
          v-model={[isAddDepDialogShow.value, "visible"]}
          parent={addDepParent.value}
          onRefresh={refresh}
        />
        {/* 编辑部门 */}
        <UpdateDepDialog
          mode="edit"
          record={editDepRecord.value}
          v-model={[isEditDepDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
      </div>
    );
  },
});

export default DepTree;
