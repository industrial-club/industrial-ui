import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import videoApi from "@/api/video";
import "../assets/styles/video/group.less";
import addGrouping from "./components/addGrouping";

const dataList: any[] = [];
const generateList = (data: any) => {
  let list: any = [];
  list = data;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const { key } = node;
      dataList.push({ key, title: key });
      if (node.children) {
        generateList(node.children);
      }
    }
  }
};
const getParentKey = (
  key: string | number,
  tree: any[]
): string | number | undefined => {
  let parentKey;
  let list: any = [];
  list = tree;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
  }

  return parentKey;
};
import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  components: { addGrouping },
  setup() {
    const selectedKeys: any = ref<(string | number)[]>([]);
    const expandedKeys: any = ref<(string | number)[]>([]);
    const searchValue: any = ref<string>("");
    const autoExpandParent = ref<boolean>(true);
    const gData: any = ref();
    const data: any = reactive({
      titleType: 0,
      move: false,
      editTitleNameType: false,
      list: [],
    });
    const getQueryGroup = async (params: any) => {
      const res = await videoApi.getQueryGroup(params);
      gData.value = res.data;
      generateList(gData.value);
    };
    const getGroup = async () => {
      const res = await videoApi.getGroup();
      data.list = res.data;
      getQueryGroup(data.list[data.titleType]);
    };

    const moveIn = (index: any) => {
      if (data.titleType === index) {
        data.move = true;
      } else {
        data.move = false;
      }
    };
    const moveOut = () => {
      data.move = false;
    };
    const titleChange = (index: any) => {
      if (data.titleType === index) {
        return false;
      }
      data.titleType = index;
      searchValue.value = "";
      gData.value = [];
      selectedKeys.value = [];
      generateList(gData.value);
      getQueryGroup(data.list[data.titleType]);
      return true;
    };
    const hideTitleName = () => {
      getGroup();
      data.editTitleNameType = false;
    };
    const saveCamera = async (params: any) => {
      const res = await videoApi.saveCamera(params);
      getGroup();
    };
    const saveGroup = async (params: any) => {
      const res = await videoApi.saveGroup(params);
      getGroup();
    };
    const saveGroupTabs = async (params: any) => {
      const res = await videoApi.saveGroupTabs(params);
      getGroup();
    };
    const titleNameSave = () => {
      const params = {
        name: data.list[data.titleType].name,
        id: data.list[data.titleType].id,
        uuid: data.list[data.titleType].uuid,
      };
      saveGroupTabs(params);
      data.editTitleNameType = false;
    };
    const titleNameEdit = (index: any, e: any) => {
      e.stopPropagation();
      data.editTitleNameType = true;
    };
    const groupingDeleId = async (id: any) => {
      const res = await videoApi.deleteGroupId(id);
      data.titleType = 0;
      getGroup();
    };
    const videoData = reactive({
      list: [],
    });

    const getVideoData = async () => {
      const res = await videoApi.getVideoList({
        pageNo: 1,
        pageSize: 999,
      });
      videoData.list = res.data.list;
    };
    const onExpand = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };
    const onDrop = (info: any) => {
      // console.log('当前id:', info.dragNode.id, '目标id:', info.node.id);
    };
    const pitchOn: any = reactive({
      data: {},
    });
    const onSelect = (keys: any, info: any) => {
      pitchOn.data = info;
      if (!info.selected) {
        selectedKeys.value[0] = info.node.eventKey;
      }
    };
    const deleteGroup = async (type: any) => {
      if (type === "zu") {
        const res = await videoApi.deleteGroup(pitchOn.data.node.uuid);
      }
      if (type === "xj") {
        const params = {
          groupUuid: pitchOn.data.node.parent.node.uuid,
          cameraUuid: pitchOn.data.node.uuid,
        };
        const res = await videoApi.delGroupRelCamera(params);
      }
      selectedKeys.value = [];
      getGroup();
    };
    const modifyModelVisible = ref(false);
    const modifyName = async () => {
      const res = await videoApi.queryGroup(pitchOn.data.node.uuid);
      pitchOn.data.node.title = res.data.name;
      modifyModelVisible.value = true;
    };
    const modifyNameSave = () => {
      const params = {
        id: pitchOn.data.node.id,
        name: pitchOn.data.node.title,
        uuid: pitchOn.data.node.uuid,
        groupTypeUuid: data.list[data.titleType].uuid,
      };
      saveGroup(params);

      modifyModelVisible.value = false;
    };
    const modifyNameClose = () => {
      modifyModelVisible.value = false;
    };
    const addModel: any = reactive({
      visible: false,
      type: "zu",
      value: "",
      itemType: "item",
      optionValue: [],
    });
    const addName = (itemType: any) => {
      addModel.value = "";
      addModel.optionValue = [];
      addModel.type = "zu";
      addModel.itemType = itemType;
      addModel.visible = true;
    };
    const addType = (type: any) => {
      addModel.type = type;
    };
    const addNameSave = () => {
      let params: any = {};
      if (addModel.type === "zu") {
        if (addModel.itemType === "item") {
          params = {
            name: addModel.value,
            parentUuid: pitchOn.data.node.uuid,
            groupTypeUuid: data.list[data.titleType].uuid,
          };
        } else {
          params = {
            name: addModel.value,
            groupTypeUuid: data.list[data.titleType].uuid,
          };
        }
        saveGroup(params);
      }
      if (addModel.type === "xj") {
        if (addModel.itemType === "item") {
          params = {
            groupUuid: pitchOn.data.node.uuid,
            cameraUuidList: addModel.optionValue,
          };
          saveCamera(params);
        }
      }
      addModel.visible = false;
    };
    const addNameClose = () => {
      addModel.visible = false;
    };
    const handleChange = (val: any) => {
      addModel.optionValue[0] = val !== null && val !== "" ? val : undefined;
    };
    const handleSearch = (val: any) => {
      if (val) {
        handleChange(val);
      }
    };
    const handleBlur = (val: any) => {
      if (val.target.value) {
        addModel.optionValue[0] = val.target.value;
      }
    };
    const filterOption = (input: string, option: any) => {
      const ele: any = videoData.list.find((type: any) => {
        return option.value === type.uuid;
      });
      return ele?.name.indexOf(input) >= 0;
    };
    onMounted(() => {
      getGroup();
      getVideoData();
    });
    watch(
      () => searchValue.value,
      (value) => {
        const expanded = dataList
          .map((item: any) => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, gData.value);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        expandedKeys.value = expanded;
        searchValue.value = value;
        autoExpandParent.value = true;
      }
    );

    return () => (
      <div class="group">
        <div class="header">
          <add-grouping
            onAddPhoto={() => getGroup()}
            photoData={videoData.list}
          />
        </div>
        <div class="tabs-min">
          {data.list.map((item: any, index: any) => {
            return (
              <div
                onMouseenter={() => moveIn(index)}
                onMouseleave={() => moveOut()}
                onClick={() => titleChange(index)}
                class={[
                  "tab-item",
                  data.titleType === index ? "border-active" : "",
                ]}
              >
                <div class="title-min">
                  <p class="name">{item.name}</p>
                </div>

                <div
                  class={[
                    "icons-min",
                    data.titleType === index && data.move ? "" : "display",
                  ]}
                >
                  <EditOutlined
                    onClick={(e) => titleNameEdit(index, e)}
                    class="icons"
                  />
                  <a-popconfirm
                    onConfirm={() => {
                      groupingDeleId(item.id);
                    }}
                    title="确定删除？"
                  >
                    <DeleteOutlined class="icons" />
                  </a-popconfirm>
                </div>
              </div>
            );
          })}
        </div>
        <a-input
          v-show={data.list && data.list.length > 0}
          v-model={[searchValue.value, "value"]}
          style="margin-bottom: 18px;width:300px"
          placeholder="搜索"
        />
        <div v-show={data.list && data.list.length > 0} class="btns-add">
          <a-button onClick={() => addName("big")} type="link">
            添加分组
          </a-button>
        </div>
        <a-tree
          class="tree-min"
          showLine={true}
          onSelect={onSelect}
          onDrop={onDrop}
          v-model={[selectedKeys.value, "selectedKeys"]}
          expandedKeys={expandedKeys.value}
          autoExpandParent={autoExpandParent.value}
          tree-data={gData.value}
          onExpand={onExpand}
          v-slots={{
            title: (item: any) => {
              return (
                <div class="tree-icons-min">
                  {item.title.indexOf(searchValue.value) > -1 ? (
                    <span>
                      {item.title.substr(
                        0,
                        item.title.indexOf(searchValue.value)
                      )}
                      <span style="color: #f50">{searchValue.value}</span>
                      {item.title.substr(
                        item.title.indexOf(searchValue.value) +
                          searchValue.value.length
                      )}
                    </span>
                  ) : (
                    <span>{item.title}</span>
                  )}
                  {item.selected ? (
                    <div class="icons-min">
                      <img
                        onClick={() => modifyName()}
                        v-show={item.nodeType === "G"}
                        src={"/micro-assets/inl/video/operation/edit.png"}
                        alt="编辑"
                      />
                      <a-popconfirm
                        onConfirm={() => {
                          deleteGroup(item.nodeType === "G" ? "zu" : "xj");
                        }}
                        title="确定删除？"
                      >
                        <img
                          src={"/micro-assets/inl/video/operation/dele.png"}
                          alt="删除"
                        />
                      </a-popconfirm>

                      <img
                        onClick={() => addName("item")}
                        v-show={item.nodeType === "G"}
                        src={"/micro-assets/inl/video/operation/add.png"}
                        alt="添加"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            },
          }}
        ></a-tree>
        <a-modal
          centered={true}
          v-model={[modifyModelVisible.value, "visible"]}
          title="修改分组名称"
          onOk={() => modifyNameSave()}
          onCancel={() => modifyNameClose()}
          closable={false}
        >
          <div class="modify-model-min">
            <span class="lable">分组名称:</span>
            <a-input v-model={[pitchOn.data.node.title, "value"]} />
          </div>
        </a-modal>
        <a-modal
          centered={true}
          v-model={[addModel.visible, "visible"]}
          width="460px"
          title="添加分组/相机"
          onOk={() => addNameSave()}
          onCancel={() => addNameClose()}
          closable={false}
        >
          <div class="add-model-min">
            <div class="btns-min" v-show={addModel.itemType === "item"}>
              <a-radio-group v-model={[addModel.type, "value"]}>
                <a-radio-button onClick={() => addType("zu")} value="zu">
                  分组
                </a-radio-button>
                <a-radio-button onClick={() => addType("xj")} value="xj">
                  相机
                </a-radio-button>
              </a-radio-group>
            </div>
            {addModel.type === "zu" ? (
              <div class="grouping-phto-min">
                <span class="lable">分组</span>
                <a-input v-model={[addModel.value, "value"]} />
              </div>
            ) : (
              <div class="grouping-phto-min">
                <span class="lable">相机</span>
                <a-select
                  mode="multiple"
                  class="select-min"
                  filter-option={filterOption}
                  v-model={[addModel.optionValue, "value"]}
                >
                  {videoData.list.map((items: any) => {
                    return (
                      <a-select-option value={items.uuid}>
                        {items.name}
                      </a-select-option>
                    );
                  })}
                </a-select>
              </div>
            )}
          </div>
        </a-modal>
        <a-modal
          centered={true}
          v-model={[data.editTitleNameType, "visible"]}
          title="修改分组类型名称"
          closable={false}
          onOk={() => titleNameSave()}
          onCancel={() => hideTitleName()}
        >
          <div class="modify-model-min">
            <span class="lable">分组类型名称:</span>
            <a-input v-model={[data.list[data.titleType].name, "value"]} />
          </div>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-group");
