import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onUnmounted,
  watch,
  inject,
} from "vue";
import { useRoute } from "vue-router";
import videoApi from "@/api/video";
import "../../assets/styles/video/preview.less";

const dataList: any[] = [];
const generateList = (data: any) => {
  let list: any = [];
  list = data;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      // if (node.nodeType === 'G') {
      //   node.disabled = true;
      // }
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
  tree: any
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
export default defineComponent({
  components: {},
  props: {
    domType: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["stopVideo", "titleChange", "getFollow", "dragTree"],
  setup(props, context) {
    const route = useRoute();
    const selectedKeys: any = inject("cameraKeys");
    const attentions: any = inject("attentions");
    const expandedKeys: any = ref<(string | number)[]>([]);
    const searchValue: any = ref<string>("");
    const autoExpandParent = ref<boolean>(true);
    const gData: any = ref();
    const data: any = reactive({
      titleType: 0,
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
    // 更换树
    const titleTypeChange = (index: any) => {
      data.titleType = index;
      sessionStorage.setItem("titleTreeType", JSON.stringify(data.titleType));
      searchValue.value = "";
      selectedKeys.value = [];
      gData.value = [];
      generateList(gData.value);
      getQueryGroup(data.list[data.titleType]);
      context.emit("titleChange");
      return true;
    };
    const onExpand = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    const pitchOn: any = reactive({
      data: {},
    });
    const onSelect = async (keys: any, info: any) => {
      if (info.node.nodeType === "G") {
        const inde = selectedKeys.value.indexOf(info.node.eventKey);
        selectedKeys.value.splice(inde, 1);
        return false;
      }
      pitchOn.data = info;
      if (props.domType) {
        context.emit("stopVideo", info.node.uuid, info.node.eventKey);
        if (!info.selected) {
          selectedKeys.value.push(info.node.eventKey);
        }
      } else {
        const inde = selectedKeys.value.indexOf(info.node.eventKey);
        if (inde !== -1) {
          selectedKeys.value.splice(inde, 1);
        } else {
          selectedKeys.value.push(info.node.eventKey);
        }
      }
      return true;
    };
    const remoSelectValue = (val: any) => {
      const inde = selectedKeys.value.indexOf(val);
      selectedKeys.value.splice(inde, 1);
    };
    const addSelectValue = (val: any) => {
      selectedKeys.value.push(val);
    };
    const listData: any = ref([]);
    const getConcern = async () => {
      const res = await videoApi.getConcern();
      listData.value = res.data;
    };
    const collctData = reactive({
      concernUuid: "",
      uuid: "",
    });
    const collectVisible = ref(false);
    const checkAttention = (uuid: string) => {
      let have = false;
      attentions.value.forEach((group: any) => {
        group.list.forEach((camera: any) => {
          if (camera.cameraUuid === uuid) {
            have = true;
          }
        });
      });
      return have;
    };
    const collectShow = (e: any, item: any) => {
      if (checkAttention(item.uuid)) {
        return;
      }
      collctData.concernUuid = "";
      collctData.uuid = "";
      e.stopPropagation();
      collctData.uuid = item.uuid;
      getConcern();
      collectVisible.value = true;
    };
    const collectSave = async () => {
      const val = {
        concernUuid: collctData.concernUuid,
        cameraUuid: collctData.uuid,
      };
      const res = await videoApi.addConcern(val);
      collectVisible.value = false;
      context.emit("getFollow");
    };
    const collectClose = () => {
      collectVisible.value = false;
    };

    context.expose({
      remoSelectValue,
      addSelectValue,
    });

    let interval: any;
    onMounted(() => {
      getGroup();
      if (sessionStorage.getItem("titleTreeType")) {
        data.titleType = Number(sessionStorage.getItem("titleTreeType"));
      }
      interval = setInterval(() => {
        getQueryGroup(data.list[data.titleType]);
      }, 10000);
    });
    onUnmounted(() => {
      clearInterval(interval);
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
          .filter(
            (item: any, i: number, self: any[]) =>
              item && self.indexOf(item) === i
          );
        expandedKeys.value = expanded;
        searchValue.value = value;
        autoExpandParent.value = true;
      }
    );

    const dropTree = (info: any) => {
      context.emit("dragTree", info.node);
    };

    return () => (
      <div class="tree-item">
        <div class="search-mins">
          <a-select
            onChange={(e: any) => titleTypeChange(e)}
            v-model={[data.titleType, "value"]}
            class="select-min"
          >
            {data.list.map((item: any, index: any) => {
              return (
                <a-select-option value={index}>{item.name}</a-select-option>
              );
            })}
          </a-select>
          {route.params.pad === "pad" ? (
            ""
          ) : (
            <a-input
              class="ipt-min"
              placeholder="输入相机名称"
              v-show={data.list && data.list.length > 0}
              v-model={[searchValue.value, "value"]}
            />
          )}
        </div>
        <div class="tree-b">
          <a-tree
            class="tree-mins"
            multiple
            draggable
            onDragstart={(info: any) => {
              const dt = info.event.dataTransfer;
              dt.setDragImage(info.event.target.children[2], 0, 0);
              dropTree(info);
            }}
            showLine={true}
            onSelect={onSelect}
            v-model={[selectedKeys.value, "selectedKeys"]}
            expandedKeys={expandedKeys.value}
            autoExpandParent={autoExpandParent.value}
            tree-data={gData.value}
            replaceFields={{
              children: "children",
              title: "title",
              key: "uuid",
            }}
            onExpand={onExpand}
            v-slots={{
              title: (item: any) => {
                return (
                  <div class="tree-icons-min">
                    <div class="icons-min">
                      <img
                        class="active-r"
                        v-show={item.nodeType === "C"}
                        src={
                          item.onlineStatus === "ONLINE"
                            ? "/micro-assets/inl/video/operation/cameraYes.png"
                            : "/micro-assets/inl/video/operation/cameraNo.png"
                        }
                        alt="在线"
                      />
                    </div>
                    {item.title.indexOf(searchValue.value) > -1 ? (
                      <span
                        class={[
                          "xj",
                          item.nodeType === "G" ? "gactive" : "",
                          item.onlineStatus === "ONLINE" ? "yactive" : "",
                        ]}
                      >
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
                      <span
                        class={[
                          "xj",
                          item.nodeType === "G" ? "gactive" : "",
                          item.onlineStatus === "ONLINE" ? "yactive" : "",
                        ]}
                      >
                        {item.title}
                      </span>
                    )}
                    <div class="icons-min" v-show={item.nodeType === "C"}>
                      <img
                        class="active-l"
                        onClick={(e: any) => collectShow(e, item)}
                        src={
                          checkAttention(item.uuid)
                            ? "/micro-assets/inl/video/operation/collectYes.png"
                            : "/micro-assets/inl/video/operation/collectNo.png"
                        }
                        alt="收藏"
                      />
                    </div>
                  </div>
                );
              },
            }}
          ></a-tree>
        </div>
        <a-modal
          centered={true}
          v-model={[collectVisible.value, "visible"]}
          title="选择关注分组"
          onOk={() => collectSave()}
          onCancel={() => collectClose()}
          closable={false}
        >
          <div class="collect-model-min">
            <span class="lable">分组</span>
            <a-select
              v-model={[collctData.concernUuid, "value"]}
              class="sele"
              onChange={(par: any) => {
                collctData.concernUuid = par;
              }}
            >
              {listData.value.map((item: any, index: any) => {
                return (
                  <a-select-option value={item.uuid}>
                    {item.name}
                  </a-select-option>
                );
              })}
            </a-select>
          </div>
        </a-modal>
      </div>
    );
  },
});
