/*
 * @Abstract: 菜单管理
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:10:38
 */
import { defineComponent, ref, provide, PropType } from "vue";
import utils from "@/utils";
import { setInstance } from "@/api/auth/menuManager";

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

export const openMode = [
  {
    value: 0,
    label: "打开新标签",
  },
  {
    value: 1,
    label: "打开新窗口",
  },
  {
    value: 2,
    label: "打开iframe",
  },
];

/**
 * 菜单管理
 */
const MenuManager = defineComponent({
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
  setup(props) {
    setInstance({ prefix: props.prefix, serverName: props.serverName });
    const urlMap = { ...props.url };
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
        <div
          class="divider"
          style={{
            margin: `${-props.dividerGap}px 20px ${-props.dividerGap}px 0`,
            background: props.dividerColor,
          }}
        ></div>
        {/* 右侧详情 */}
        <div class="right-detail">
          <MenuDetail ref={detailRef} node={currSelectNode.value} />
        </div>
      </div>
    );
  },
});

export default utils.installComponent(MenuManager, "menu-manager");
