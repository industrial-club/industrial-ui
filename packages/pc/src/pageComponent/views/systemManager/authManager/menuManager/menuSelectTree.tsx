/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 10:51:32
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 10:59:56
 */
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import useBus from "@/pageComponent/hooks/useBus";
import { omit } from "lodash";
import api from "@/pageComponent/api/auth/menuManager";

import { message } from "ant-design-vue";
import CommonTree from "@/pageComponent/components/CommonTree";
import UpdateMenuDialog from "./updateMenuDialog";

/**
 * 菜单树结构
 */
const MenuSelectTree = defineComponent({
  props: {
    onSelect: {
      type: Function,
    },
    onEdit: {
      type: Function,
    },
  },
  setup(props) {
    const bus = useBus("system");

    const treeRef = ref();

    let refresh: () => void;

    onMounted(() => (refresh = treeRef.value._refresh));

    // 获取数据函数
    const getTreeData = async (keyword = "") => {
      const { data } = await api.getMenuTreeList({ keyword });
      return data.map((item: any) => {
        item.name = item.softSysName;
        item.id = "sys" + item.softSysId;
        item.isSystem = true;
        item.subList = item.menuList;
        return item;
      });
    };

    /* 当前选中的节点 */
    const handleSelectNode = (node: any) => {
      props.onSelect?.(node);
    };

    /* ===== 节点操作 ===== */
    // 复制节点
    const handleCopy = async (node: any) => {
      await api.insertMenuRecord(omit(node, "id", "sort", "subList"));
      message.success("复制成功");
      refresh();
    };
    // 编辑节点
    const handleEdit = (node: any) => {
      props.onEdit?.(node);
    };
    // 删除节点
    const handleDelete = async (node: any) => {
      await api.deleteMenuById(node.id);
      message.success("删除成功");
      refresh();
    };
    // 添加节点
    const [isAddNodeDialogShow, handleAddNodeClick, addNodeParent] =
      useModalVisibleControl();

    /* ===== 拖拽操作 ===== */
    const handleDrop = (data: any) => {
      // 发送排序请求 成功后重新查询数据
      api.sortMenu(data).then(() => {
        message.success("排序成功");
        refresh();
      });
    };

    return () => (
      <div class="menu-select-tree">
        <CommonTree
          ref={treeRef}
          isJSONOperation
          downLoadName="菜单结构.json"
          getData={getTreeData}
          onCopy={handleCopy}
          onAdd={handleAddNodeClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDrop={handleDrop}
          onSelect={handleSelectNode}
        />

        <UpdateMenuDialog
          onRefresh={refresh}
          parent={addNodeParent.value}
          v-model={[isAddNodeDialogShow.value, "visible"]}
        />
      </div>
    );
  },
});

export default MenuSelectTree;
