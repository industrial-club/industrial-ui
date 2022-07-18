import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  PropType,
  ref,
} from "vue";
import eventApi from "@/api/event";
import "../assets/styles/video/event.less";

export default defineComponent({
  props: {
    // thingCode: {
    //   type: String,
    //   default: '',
    // },
    checkList: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    ok: Boolean,
  },
  emits: ["cancel", "saveCameraUuids"],
  setup(_props, _context) {
    const data: {
      selectedList: Array<{ id: number; name: string; uuid: string }>;
      treeData: Array<any>;
      selectedKeys: any;
      expandedKeys: any;
      checkedKeys: any;
      backupsExpandedKeys: any;
      autoExpandParent: boolean;
      uuid: string;
      name: string;
      searchStr: string;
      searchValue: string;
      searchStrRight: string;
    } = reactive({
      selectedList: [],
      treeData: [
        // {
        //   title: '0-0',
        //   key: '0-0',
        //   scopedSlots: { title: 'title' },
        //   children: [
        //     {
        //       title: '0-0-0',
        //       key: '0-0-0',
        //       scopedSlots: { title: 'title' },
        //       children: [],
        //     },
        //     {
        //       title: '0-0-2',
        //       key: '0-0-2',
        //       scopedSlots: { title: 'title' },
        //     },
        //   ],
        // },
      ],
      selectedKeys: [],
      expandedKeys: [],
      checkedKeys: [],
      backupsExpandedKeys: [],
      autoExpandParent: false,
      uuid: "",
      name: "",
      searchStr: "",
      searchValue: "",
      searchStrRight: "", // 右侧搜索
    });
    const checkedKeys = ref<Array<{ label: string; value: boolean }>>([]);
    watch(
      () => checkedKeys.value,
      () => {
        data.checkedKeys = [];
        checkedKeys.value.forEach((item) => {
          data.checkedKeys.push(item.label);
        });
      }
    );
    watch(
      () => _props.ok,
      (e) => {
        if (e) {
          _context.emit("saveCameraUuids", data.checkedKeys);
        }
      }
    );
    watch(
      () => _props.checkList,
      (e) => {
        if (e) {
          data.checkedKeys = e;
          checkedKeys.value = [];
          data.checkedKeys.forEach((item: string) => {
            checkedKeys.value.push({ label: item, value: false });
          });
        }
      },
      { deep: true }
    );
    const sum = ref(0);
    // 父级禁用
    const computedTree = (arr: any) => {
      arr.forEach((item: any) => {
        if (item.nodeType === "G") {
          item.disableCheckbox = true;
        } else {
          item.disableCheckbox = false; // 只能选相机
          sum.value += 1;
        }
        item.key = `${item.title}*${item.uuid}`;
        if (item.children) {
          computedTree(item.children);
        }
      });
      return arr;
    };
    // 获取树的数据
    const getTreeData = async () => {
      const groupTypeUuid =
        data.selectedList.find((item) => item.name === data.name)?.uuid || "";
      const res = await eventApi.getTreeData({
        params: {
          groupTypeUuid,
        },
      });
      if (Array.isArray(res.data)) {
        data.treeData = res.data.map((item: any) => {
          return {
            ...item,
          };
        });
      }
      computedTree(data.treeData);
    };

    const getSelected = async () => {
      const res = await eventApi.getCameraGroupType();
      if (Array.isArray(res.data)) {
        data.selectedList = (res as any).data.map((item: any) => ({
          ...item,
        }));
      }
      data.name = data.selectedList[0].name;
      getTreeData();
    };
    const getkeyList = (
      value: string,
      tree: string | any[],
      keyList: any[]
    ) => {
      // 遍历所有同一级的树
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        // 如果该节点存在value值则push
        if (node.title.indexOf(value) > -1) {
          keyList.push(node.key);
        }
        // 如果拥有孩子继续遍历
        if (node.children) {
          getkeyList(value, node.children, keyList);
        }
      }
      // 因为是引用类型，所有每次递归操作的都是同一个数组
      return keyList;
    };
    // 该递归主要用于获取key的父亲节点的key值
    const getParentKey: any = (key: any, tree: string | any[]) => {
      let parentKey;
      let temp;
      // 遍历同级节点
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          // 如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
          // 如果不存在，继续遍历其子节点
          if (node.children.some((item: { key: any }) => item.key === key)) {
            parentKey = node.key;
          } else if (temp === getParentKey(key, node.children)) {
            // parentKey = this.getParentKey(key,node.children)
            // 改进，避免二次遍历
            parentKey = temp;
          }
        }
      }
      return parentKey;
    };
    // 获取该节点的所有祖先节点
    const getAllParentKey = (key: any, tree: string | any[]) => {
      var parentKey: any;
      if (key) {
        // 获得父亲节点
        parentKey = getParentKey(key, tree);
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (
            !data.backupsExpandedKeys.some((item: any) => item === parentKey)
          ) {
            data.backupsExpandedKeys.push(parentKey);
          }
          // 继续向上查找祖先节点
          getAllParentKey(parentKey, tree);
        }
      }
    };
    // 右侧搜索
    const onSearchRight = () => {
      const arr: any = [];
      checkedKeys.value = JSON.parse(
        sessionStorage.getItem("checkedKeys") || ""
      );
      if (data.searchStrRight) {
        checkedKeys.value.forEach((item: any) => {
          if (item.label.indexOf(data.searchStrRight) > -1) {
            arr.push(item);
          }
        });
        checkedKeys.value = arr;
      }
    };
    // 左侧搜索
    const onSearch = () => {
      data.searchValue = data.searchStr;
      //  不搜索默认不张开
      if (data.searchValue === "") {
        data.expandedKeys = [];
      } else {
        data.expandedKeys = [];
        data.backupsExpandedKeys = [];
        const candidateKeysList = getkeyList(
          data.searchValue,
          data.treeData,
          []
        );
        // 遍历满足条件的所有节点
        candidateKeysList.forEach((item) => {
          // 获取每个节点的母亲节点
          const key = getParentKey(item, data.treeData);
          // 当item是最高一级，父key为undefined，将不放入到数组中
          // 如果母亲已存在于数组中，也不放入到数组中
          if (key && !data.backupsExpandedKeys.some((ele: any) => ele === key))
            data.backupsExpandedKeys.push(key);
        });
        const { length } = data.backupsExpandedKeys;
        for (let i = 0; i < length; i++) {
          getAllParentKey(data.backupsExpandedKeys[i], data.treeData);
        }
        data.expandedKeys = data.backupsExpandedKeys.slice();
      }
    };
    const unique = (arr: Array<string>) => {
      const newArr = [arr[0]];
      for (let i = 1; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    };
    let realCheck: any = [];
    const computedAllCheckItem = (arr: any) => {
      arr.forEach((item: any) => {
        if (item.nodeType === "C") {
          realCheck.push(item.key);
        }
        if (item.children) {
          computedAllCheckItem(item.children);
        }
      });
      realCheck = unique(realCheck);
    };
    // 备选列表全选状态
    const noChooseStatus = ref(false);

    // 选择树
    const onCheck = (checkedKeyList: any, info: any) => {
      data.checkedKeys = checkedKeyList.checked;
      realCheck = [];
      computedAllCheckItem(data.treeData);
      if (realCheck.length === unique(data.checkedKeys).length) {
        noChooseStatus.value = true;
      } else {
        noChooseStatus.value = false;
      }
    };

    // 展开
    const onExpand = (expandedKeys: any) => {
      data.expandedKeys = expandedKeys;
      data.autoExpandParent = false;
    };
    // const onCancel = () => {
    //   _context.emit('cancel');
    // };
    const handleTreeData = (data1: any, targetKeys: Array<string> = []) => {
      data1.forEach((item: any) => {
        item.disabled = targetKeys.includes(item.key as any);
        if (item.children) {
          handleTreeData(item.children, targetKeys);
        }
      });
      return data;
    };

    const addRight = () => {
      checkedKeys.value = [];
      data.checkedKeys.forEach((item: string) => {
        checkedKeys.value.push({ label: item, value: false });
      });
      sessionStorage.setItem("checkedKeys", JSON.stringify(checkedKeys.value));
      // _context.emit('addCamera', data.checkedKeys);
    };
    // 加入左侧
    const addLeft = () => {
      const arr: { label: string; value: boolean }[] = [];
      checkedKeys.value.forEach((item) => {
        if (item.value === false) {
          arr.push(item);
        }
      });
      checkedKeys.value = arr;
    };
    // 已选列表全选状态
    const chooseStatus = ref(false);
    // 已选列表全选反选
    const chooseAllCheck = () => {
      if (chooseStatus.value === false) {
        checkedKeys.value.forEach((item) => {
          item.value = true;
        });
      } else {
        checkedKeys.value.forEach((item) => {
          item.value = false;
        });
      }
    };
    // 右侧列表状态控制全选状态
    watch(
      () => checkedKeys.value,
      () => {
        const checkStatus = checkedKeys.value.every((item) => item.value);
        chooseStatus.value = checkStatus;
        if (checkedKeys.value.length === 0) chooseStatus.value = false;
      },
      { deep: true }
    );

    // 全选取消全选
    const computedAllCheck = (arr: any) => {
      if (noChooseStatus.value === false) {
        arr.forEach((item: any) => {
          if (item.nodeType === "C") {
            data.checkedKeys.push(item.key);
          }
          if (item.children) {
            computedAllCheck(item.children);
          }
        });
      } else {
        data.checkedKeys = [];
      }
      return arr;
    };
    // 备选列表点击事件
    const noChooseAllCheck = () => {
      computedAllCheck(data.treeData);
    };
    onMounted(() => {
      getSelected();
    });
    return () => (
      <div class="transfer">
        <div class="transfer_box">
          <div class="transfer_title">
            <span class="name">备选列表</span>
            <a-checkbox
              onClick={noChooseAllCheck}
              v-model={[noChooseStatus.value, "checked"]}
            >{`共${sum.value}项`}</a-checkbox>
          </div>
          <a-select style="width:100%" v-model={[data.name, "value"]}>
            {data.selectedList.map((item) => {
              return (
                <a-select-option
                  key={item.uuid}
                  onClick={() => {
                    data.name = item.name;
                    getTreeData();
                  }}
                  value={item.uuid}
                >
                  {item.name}
                </a-select-option>
              );
            })}
          </a-select>
          <a-input-search
            v-model={[data.searchStr, "value"]}
            placeholder="请输入搜索内容"
            style="width:100%"
            onSearch={onSearch}
          />
          <div class="tree">
            <a-tree
              blockNode
              checkable
              checkStrictly
              onCheck={onCheck}
              checkedKeys={data.checkedKeys}
              autoExpandParent={data.autoExpandParent}
              defaultExpandAll
              onExpand={onExpand}
              expandedKeys={data.expandedKeys}
              tree-data={data.treeData}
              vSlots={{
                title: (record: any) => (
                  <span
                    style={
                      data.searchValue
                        ? `font-weight:${
                            record.title.includes(data.searchValue) ? "700" : ""
                          }`
                        : ""
                    }
                  >
                    {record.title}
                  </span>
                ),
              }}
            ></a-tree>
          </div>
        </div>
        <div class="transfer_middle">
          <a-button size="small" type="primary" onClick={addLeft}>
            加入左侧
          </a-button>
          <a-button size="small" type="primary" onClick={addRight}>
            加入右侧
          </a-button>
        </div>
        <div class="transfer_box">
          <div class="transfer_title">
            <span class="name">已选列表</span>
            <a-checkbox
              onClick={chooseAllCheck}
              v-model={[chooseStatus.value, "checked"]}
            >{`共${checkedKeys.value.length}项`}</a-checkbox>
          </div>
          <div class="checkList">
            <a-input-search
              v-model={[data.searchStrRight, "value"]}
              placeholder="请输入搜索内容"
              style="width:100%"
              onSearch={onSearchRight}
            />
            {checkedKeys.value
              ? checkedKeys.value.map((item: any) => {
                  return (
                    <div>
                      <a-checkbox v-model={[item.value, "checked"]}>
                        {item.label.split("*")[0]}
                      </a-checkbox>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    );
  },
});
