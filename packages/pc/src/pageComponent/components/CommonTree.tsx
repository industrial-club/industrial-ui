/*
 * @Abstract: 公共树结构组件 菜单管理、部门管理
 * @Author: wang liang
 * @Date: 2022-04-07 14:42:40
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-27 10:26:03
 */

import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import useProxy from "@/pageComponent/hooks/useProxy";
import useBus from "@/pageComponent/hooks/useBus";
import { debounce } from "lodash";
import { findById, getParentById } from "@/pageComponent/utils/tree";

import { Modal } from "ant-design-vue";
import {
  SearchOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  HolderOutlined,
} from "@ant-design/icons-vue";

const CommonTree = defineComponent({
  props: {
    downLoadName: {
      type: String,
      default: "树结构数据.json",
    },
    getData: {
      type: Function,
      required: true,
    },
    onSelect: {
      type: Function,
    },
    onCopy: {
      type: Function,
    },
    onDelete: {
      type: Function,
    },
    onEdit: {
      type: Function,
    },
    onAdd: {
      type: Function,
    },
    onDrop: {
      type: Function,
    },
    isJSONOperation: {
      type: Boolean,
      default: false,
    },
    onJSONUploadClick: {
      type: Function,
    },
  },
  setup(props) {
    const proxy = useProxy();
    const bus = useBus("system");

    const searchText = ref("");

    const treeData = ref([]);
    const originData = ref([]);

    const isLoading = ref(false);

    // 获取数据
    const getTreeData = debounce(async (callback?: () => void) => {
      isLoading.value = true;
      const data = await props.getData(searchText.value);
      treeData.value = data;
      originData.value = data;
      isLoading.value = false;
      // 默认选中第一个
      if (!selectedKeys.value.length) {
        selectedKeys.value[0] = data[0].id;
        handleSelectNode([], { selected: true, node: data[0] });
      }
      callback?.();
    }, 300);
    getTreeData();
    // 暴露刷新数据方法
    proxy._refresh = getTreeData;

    /* 当前选中的节点 */
    const selectedKeys = ref<any[]>([]);
    const handleSelectNode = (keys: any, { node, selected }: any) => {
      if (!selected) {
        props.onSelect?.(undefined);
      } else {
        props.onSelect?.(node);
      }
    };
    // 更新节点后重新选中节点 展示最新的信息
    proxy._reselect = () => {
      const node: any = findById(treeData.value, selectedKeys.value[0]);
      const parent = getParentById(treeData.value, node.id);
      // console.log(res);

      handleSelectNode([], {
        node: { ...node, parent: { node: parent } },
        selected: true,
      });
    };

    /* ===== 节点操作 ===== */
    // 下载JSON文件
    const handleDownload = () => {
      const str = JSON.stringify(originData.value, null, 2);
      const blob = new Blob([str]);
      const url = URL.createObjectURL(blob);
      const aEl = document.createElement("a");
      aEl.href = url;
      aEl.download = props.downLoadName;
      aEl.click();
    };
    // 复制节点
    const handleCopy = (node: any) => {
      Modal.confirm({
        title: "复制菜单",
        content: `确定复制菜单“${node.name}”?`,
        async onOk() {
          props.onCopy?.(node);
        },
      });
    };
    // 编辑节点
    const handleEdit = (data: any) => {
      props.onEdit?.(data);
    };
    // 添加节点
    const handleAddNodeClick = (data: any) => {
      props.onAdd?.(data);
    };

    // 删除节点
    const handleDelete = (node: any) => {
      Modal.confirm({
        title: "删除菜单",
        content: `确定删除菜单“${node.name}”?`,
        async onOk() {
          props.onDelete?.(node);
        },
      });
    };

    /* ===== 拖拽操作 ===== */
    const isDraggable = ref(false);
    const handleDrop = (info: any) => {
      const dropKey = info.node.id;
      const dragKey = info.dragNode.id;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data: any, id: string | number, callback: any) => {
        data.forEach((item: any, index: number) => {
          if (item.id === id) {
            return callback(item, index, data);
          }
          if (item.subList) {
            return loop(item.subList, id, callback);
          }
        });
      };
      const data = [...treeData.value];

      // Find dragObject
      let dragObj: any;
      loop(data, dragKey, (item: any, index: number, arr: any[]) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: any) => {
          item.subList = item.subList || [];
          /// where to insert 示例添加到头部，可以是随意位置
          item.subList.unshift(dragObj);
        });
      } else if (
        (info.node.subList || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item: any) => {
          item.subList = item.subList || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.subList.unshift(dragObj);
        });
      } else {
        let ar: any[] = [];
        let i = 0;
        loop(data, dropKey, (_item: any, index: number, arr: any[]) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      // treeData.value = data;

      /* ----- 转换数据 ----- */

      // 递归设置sort字段
      const setSort = (node: any, index: number) => {
        node.sort = index + 1;
        if (node.subList.length) {
          node.subList.forEach((sub: any, ind: number) => {
            setSort(sub, ind);
          });
        }
      };

      // 转换第一层数据
      const res = data.map((item: any, index: number) => {
        setSort(item, index);
        item.id = parseInt(item.id.replace("sys", ""));
        item.menuList = item.subList;
        return item;
      });

      // 发送排序请求 成功后重新查询数据
      props.onDrop?.(res);
    };

    /* ===== 更新树结构数据后刷新 ===== */
    const handleRefresh = async () => {
      await getTreeData(proxy._reselect);
    };
    onMounted(() => bus.on("tree/refresh", handleRefresh));
    onBeforeUnmount(() => bus.off("tree/refresh", handleRefresh));

    return () => (
      <div class="common-tree">
        {/* 搜索 */}
        <a-input
          style={{ marginBottom: "16px" }}
          placeholder="请输入内容"
          allowClear
          suffix={<SearchOutlined />}
          v-model={[searchText.value, "value"]}
          onChange={getTreeData}
        />
        {/* 工具栏容器 */}
        <div class="utils-container">
          {props.isJSONOperation && (
            <>
              <a-button
                style={{ padding: "4px 0" }}
                type="link"
                onClick={() => props.onJSONUploadClick?.()}
              >
                <CloudUploadOutlined />
                上传json文件
              </a-button>
              <a-button
                style={{ padding: "4px 0" }}
                type="link"
                onClick={handleDownload}
              >
                <CloudDownloadOutlined />
                下载json文件
              </a-button>
            </>
          )}
        </div>
        <div class="tree-container">
          <a-spin spinning={isLoading.value}>
            {treeData.value.length > 0 ? (
              <a-tree
                showLine={{ showLeafIcon: true }}
                blockNode
                draggable={isDraggable.value}
                defaultExpandAll
                fieldNames={{ children: "subList", key: "id", title: "name" }}
                treeData={treeData.value}
                v-model={[selectedKeys.value, "selectedKeys"]}
                onSelect={handleSelectNode}
                onDrop={handleDrop}
              >
                {{
                  title: ({ name, selected, isSystem, dataRef }: any) => {
                    return (
                      <span class="tree-node-title">
                        <span class="name">{name}</span>
                        {/* 当前选中的节点需要展示操作按钮 */}
                        {selected && isSystem && (
                          <span class="operation" style={{ float: "right" }}>
                            <PlusCircleOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddNodeClick(dataRef);
                              }}
                            />
                          </span>
                        )}
                        {selected && !isSystem && (
                          <span class="operation" style={{ float: "right" }}>
                            <a-space>
                              {/* 只能复制没有子菜单的菜单 */}
                              {!dataRef.subList.length &&
                                props.onCopy !== undefined && (
                                  <CopyOutlined
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(dataRef);
                                    }}
                                  />
                                )}
                              <EditOutlined
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(dataRef);
                                }}
                              />
                              {/* 有子节点的节点不能删除 */}
                              {!dataRef.subList.length && (
                                <DeleteOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(dataRef);
                                  }}
                                />
                              )}
                              {dataRef.valid === 1 && (
                                <PlusCircleOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddNodeClick(dataRef);
                                  }}
                                />
                              )}
                              {!searchText.value && (
                                <HolderOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onMouseover={(e) => {
                                    isDraggable.value = true;
                                  }}
                                  onMouseleave={() => {
                                    isDraggable.value = false;
                                  }}
                                />
                              )}
                            </a-space>
                          </span>
                        )}
                      </span>
                    );
                  },
                }}
              </a-tree>
            ) : (
              <a-empty />
            )}
          </a-spin>
        </div>
      </div>
    );
  },
});

export default CommonTree;
