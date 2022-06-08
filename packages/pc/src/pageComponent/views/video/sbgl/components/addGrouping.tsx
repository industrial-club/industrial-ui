import { defineComponent, reactive } from "vue";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
import videoApi from "@/api/video";
import "../../assets/styles/video/group.less";

export default defineComponent({
  props: {
    photoData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["addPhoto"],

  setup(props, context) {
    const addPhtot: any = reactive({
      visible: false,
      title: "",
    });

    const addPhotoShow = () => {
      addPhtot.visible = true;
      addPhtot.title = "";
    };
    const addPhotoSave = async () => {
      const params = {
        name: addPhtot.title,
      };
      const res = await videoApi.saveGroupTabs(params);
      context.emit("addPhoto");
      addPhtot.visible = false;
    };
    const addPhotoClose = () => {
      addPhtot.visible = false;
    };
    return () => (
      <div>
        <a-button onClick={() => addPhotoShow()} type="primary">
          添加分组类型
        </a-button>
        <a-modal
          centered={true}
          v-model={[addPhtot.visible, "visible"]}
          width="660px"
          title="添加分组类型"
          onOk={() => addPhotoSave()}
          onCancel={() => addPhotoClose()}
          closable={false}
        >
          <div class="add-grouping-modal-min">
            <div class="item-min">
              <span class="lable">分组类型名称</span>
              <a-input v-model={[addPhtot.title, "value"]} />
            </div>
          </div>
        </a-modal>
      </div>
    );
  },
});
