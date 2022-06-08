import { defineComponent, PropType, ref } from "vue";
// import useVModel from "@/pageComponent/views/video/hooks/userVModel";
import videoApi from "@/api/video";

import { SearchOutlined } from "@ant-design/icons-vue";

const computedTree = (arr: any) => {
  arr.forEach((item: any) => {
    if (item.nodeType === "G") {
      item.disableCheckbox = true;
    } else {
      item.disableCheckbox = false; // 只能选相机
    }
    item.key = `${item.parentUuid}-${item.uuid}`;
    if (item.children) {
      computedTree(item.children);
    }
  });
  return arr;
};

/**
 * 选择相机权限
 */
const CheckCamera = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    checkedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ["update:visible", "update:checkedKeys", "ok"],
  setup(props, { emit }) {
    const treeRef = ref();

    const isVisible = useVModel(props, "visible", emit);

    const checkedList = useVModel(props, "checkedKeys", emit);
    const groupVal = ref("");
    // 树结构数据
    const treeData = ref([]);
    const getTreeData = async () => {
      const res = await videoApi.getQueryGroup({ uuid: groupVal.value });
      treeData.value = computedTree(res.data);
    };
    // 下拉框
    const groupList = ref([]);

    const getGroup = async () => {
      const res = await videoApi.getGroup();
      groupList.value = [];
      if (res.code === "M0000") {
        groupList.value = res?.data;
        groupVal.value = res?.data[0].uuid;
        getTreeData();
      }
    };
    getGroup();

    // 处理选中
    const handleCheck = (keys: string[], { checked, node }: any) => {
      if (checked) {
        checkedList.value.push(node.uuid);
      } else {
        const index = checkedList.value.findIndex((item) => item === node.uuid);
        if (index !== -1) checkedList.value.splice(index, 1);
      }
    };

    return {
      treeRef,
      isVisible,
      groupVal,
      groupList,
      checkedList,
      treeData,
      getTreeData,
      handleCheck,
    };
  },
  render() {
    return (
      <a-modal
        title="相机权限配置"
        centered
        v-model={[this.isVisible, "visible"]}
        onOk={() => this.$emit("ok")}
      >
        <a-space style={{ width: "100%" }} direction="vertical">
          <a-select
            v-model={[this.groupVal, "value"]}
            onChange={this.getTreeData}
          >
            {this.groupList.map((item: any) => {
              return (
                <a-select-option value={item.uuid}>{item.name}</a-select-option>
              );
            })}
          </a-select>
          <a-input placeholder="请输入搜索内容">
            {{ suffix: () => <SearchOutlined /> }}
          </a-input>
          <a-tree
            ref={this.treeRef}
            class="videoTree"
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            fieldNames={{
              children: "children",
              title: "title",
              key: "uuid",
            }}
            treeData={this.treeData}
            checkedKeys={this.checkedList}
            onCheck={this.handleCheck}
            // onCheck={chooseTree}
          ></a-tree>
        </a-space>
      </a-modal>
    );
  },
});

export default CheckCamera;
