import { defineComponent, onMounted, reactive, ref, inject } from "vue";
import {
  PlusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";
import videoApi from "@/api/video";
import "../../assets/styles/video/preview.less";

export default defineComponent({
  props: {
    domType: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["stopVideo"],
  setup(props, context) {
    const selectedKeys: any = inject("cameraKeys");
    const listData: any = inject("attentions");
    const activeKey = ref(null);
    const getConcern = async () => {
      const res = await videoApi.getConcern();
      listData.value = res.data;
    };
    const viedoChange = (val: any) => {
      if (props.domType) {
        context.emit("stopVideo", val.cameraUuid);
      }
    };
    const deleFoll = async () => {
      if (activeKey.value) {
        const res = await videoApi.deleteConcern(activeKey.value);
        activeKey.value = null;
        getConcern();
      }
    };
    const addData = reactive({
      name: "",
    });
    const addVisible = ref(false);
    const addShow = () => {
      addData.name = "";
      addVisible.value = true;
    };
    const saveConcern = async (params: any) => {
      const res = await videoApi.saveConcern(params);
      getConcern();
    };
    const addSave = () => {
      const val = {
        name: addData.name,
      };
      saveConcern(val);

      addVisible.value = false;
    };
    const addClose = () => {
      addVisible.value = false;
    };
    const editData = reactive({
      name: "",
      id: "",
    });
    const editVisible = ref(false);
    const editShow = () => {
      editData.id = "";
      editData.name = "";
      if (activeKey.value) {
        for (const i of listData.value) {
          if (activeKey.value === String(i.id)) {
            editData.id = i.id;
            editData.name = i.name;
          }
        }
        editVisible.value = true;
      }
    };
    const editSave = () => {
      const val = { id: editData.id, name: editData.name };
      saveConcern(val);
      editVisible.value = false;
    };
    const editClose = () => {
      editVisible.value = false;
    };
    const upDown = async (type: any) => {
      if (activeKey.value) {
        const params = {
          id: activeKey.value,
          type,
        };
        const res = await videoApi.gzUpdateSort(params);
        getConcern();
      }
    };
    const cancelAttention = async (id: any) => {
      const res = await videoApi.deleteConcernCamera(id);
      getConcern();
    };
    context.expose({
      getConcern,
    });
    onMounted(() => {
      getConcern();
    });
    return () => (
      <div class="follow-item">
        <div class="icons-min">
          <PlusSquareOutlined class="icons" onClick={() => addShow()} />
          <FormOutlined class="icons" onClick={() => editShow()} />
          <a-popconfirm onConfirm={() => deleFoll()} title="确定删除分组？">
            <DeleteOutlined class="icons" />
          </a-popconfirm>
          <ArrowUpOutlined onClick={() => upDown(0)} class="icons" />
          <ArrowDownOutlined onClick={() => upDown(1)} class="icons" />
        </div>
        <a-collapse
          class="teams"
          ghost
          accordion
          v-model={[activeKey.value, "activeKey"]}
        >
          {listData.value.map((item: any, index: any) => {
            return (
              <a-collapse-panel
                class={[
                  "itemgz",
                  activeKey.value === String(item.id) ? "blue" : "",
                ]}
                key={item.id}
                header={item.name}
              >
                {item.list.map((el: any) => {
                  return (
                    <div
                      class={[
                        "items-min",
                        selectedKeys.value.indexOf(el.cameraUuid) >= 0
                          ? "selected"
                          : "",
                      ]}
                    >
                      <p title={el.name} onClick={() => viedoChange(el)}>
                        {el.name}
                      </p>
                      <a-popconfirm
                        onConfirm={() => {
                          cancelAttention(el.id);
                        }}
                        title="确定删除关注？"
                      >
                        <DeleteOutlined class="icons" />
                      </a-popconfirm>
                    </div>
                  );
                })}
              </a-collapse-panel>
            );
          })}
        </a-collapse>
        <a-modal
          centered={true}
          v-model={[editVisible.value, "visible"]}
          title="编辑分组名称"
          onOk={() => editSave()}
          onCancel={() => editClose()}
          closable={false}
        >
          <div class="collect-model-min">
            <span class="lable">分组名称</span>
            <a-input v-model={[editData.name, "value"]} />
          </div>
        </a-modal>
        <a-modal
          centered={true}
          v-model={[addVisible.value, "visible"]}
          title="添加分组"
          onOk={() => addSave()}
          onCancel={() => addClose()}
          closable={false}
        >
          <div class="collect-model-min">
            <span class="lable">分组名称</span>
            {/* <a-select class='sele'></a-select> */}
            <a-input v-model={[addData.name, "value"]} />
          </div>
        </a-modal>
      </div>
    );
  },
});
