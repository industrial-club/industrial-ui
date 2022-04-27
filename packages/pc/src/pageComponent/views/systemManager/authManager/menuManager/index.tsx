/*
 * @Abstract: 菜单管理
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:10:38
 */
import { defineComponent, ref } from "vue";
import MenuSelectTree from "./menuSelectTree";
import MenuDetail from "./menuDetail";

/**
 * 菜单管理
 */
const MenuManager = defineComponent({
  setup() {
    const detailRef = ref();
    const currSelectNode = ref();

    const handleNodeSelect = (node: any) => (currSelectNode.value = node);

    const handleNodeEdit = (node: any) => {
      // currSelectNode.value = node;
      detailRef.value._edit();
    };

    return () => (
      <div class="menu-manager">
        {/* 左侧菜单树选择 */}
        <div class="tree">
          <MenuSelectTree onSelect={handleNodeSelect} onEdit={handleNodeEdit} />
        </div>
        {/* 右侧详情 */}
        <div class="right-detail">
          <MenuDetail ref={detailRef} node={currSelectNode.value} />
        </div>
      </div>
    );
  },
});

export default MenuManager;
