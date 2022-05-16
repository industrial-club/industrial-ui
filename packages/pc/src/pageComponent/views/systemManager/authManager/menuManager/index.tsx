/*
 * @Abstract: 菜单管理
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:10:38
 */
import { defineComponent, ref, provide, PropType } from "vue";
import utils from "@/utils";

import MenuSelectTree from "./menuSelectTree";
import MenuDetail from "./menuDetail";

export interface IUrlObj {
  // 树结构数据
  tree: string;
  // 添加菜单
  add: string;
  // 更新菜单
  update: string;
  // 删除菜单
  delete: string;
  // 排序菜单
  sort: string;
  // 上传菜单JSON
  upload: string;
}

const DEFAULT_URL: IUrlObj = {
  tree: "/comlite/v1/menu/all",
  add: "/comlite/v1/menu/add'",
  update: "/comlite/v1/menu/modify",
  delete: "/comlite/v1/menu/delete/",
  sort: "/comlite/v1/menu/sort/adjust",
  upload: "/comlite/v1/menu/json/upload",
};

/**
 * 菜单管理
 */
const MenuManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const urlMap = { ...DEFAULT_URL, ...props.url };
    provide("urlMap", urlMap);

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
        <div class="divider"></div>
        {/* 右侧详情 */}
        <div class="right-detail">
          <MenuDetail ref={detailRef} node={currSelectNode.value} />
        </div>
      </div>
    );
  },
});

export default utils.installComponent(MenuManager, "menu-manager");
