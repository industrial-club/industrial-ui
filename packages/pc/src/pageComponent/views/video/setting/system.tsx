import { defineComponent, ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import "../assets/styles/video/setting.less";
import setApi from "@/api/setting";

import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const formRef = ref(null);
    const form = reactive({
      dialog: false,
      list: [],
      formState: {
        adress: "",
        disabled: "",
      },
      rules: {},
    });
    const list: any = ref([]);
    const saveList: any = ref([]);
    const getList = async () => {
      const res = await setApi.findAll();
      if (res.code === "M0000") {
        list.value = res.data || [];
        saveList.value = res.data || []; // 保留原始数据
      }
    };
    onMounted(() => {
      getList();
    });
    const addAddress = () => {
      const obj = {
        name: "",
        remark: "",
        id: "",
        uuid: "",
        url: "",
      };
      list.value.push(obj);
    };
    const idArr: any = ref([]);
    const deleteId = async (id: any) => {
      const res = await setApi.deleteById({ id });
      if (res.code !== "M0000") {
        message.error("删除失败");
      }
      getList();
    };
    const deleteRow = (item: any, idx: any) => {
      if (item.id === "") {
        list.value.splice(idx, 1);
      } else {
        deleteId(item.id);
      }
    };
    const editRow = async (param: any) => {
      if (param.url !== "") {
        const res = await setApi.save(param);
        if (res.code !== "M0000") {
          message.error("操作失败");
        }
        getList();
      }
    };
    return () => (
      <div class="setting_system">
        <div class="system_title">系统设置</div>
        <a-form
          ref={formRef}
          model={form.formState}
          rules={form.rules}
          labelAlign="right"
          colon={false}
          labelCol={{ span: 6 }}
        >
          <a-form-item label="NTP服务地址">
            <a-row>
              <a-col>
                <a-input
                  v-model={[form.formState.adress, "value"]}
                  placeholder="输入ip:port"
                ></a-input>
              </a-col>
              &emsp;
              <a-col>
                <a-switch
                  checked-children="启用"
                  un-checked-children="禁用"
                  v-model={[form.formState.disabled, "checked"]}
                ></a-switch>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="流媒体服务地址" name="name">
            {list.value.map((item: any, idx: any) => {
              return (
                <a-row gutter="16" class="media">
                  <a-col>
                    <a-input
                      v-model={[item.url, "value"]}
                      onBlur={() => editRow(item)}
                    ></a-input>
                  </a-col>
                  <a-col>
                    <a-input
                      v-model={[item.secret, "value"]}
                      onBlur={() => editRow(item)}
                    ></a-input>
                  </a-col>
                  <a-col>
                    <span
                      class="icon delete"
                      onClick={() => deleteRow(item, idx)}
                    >
                      <img src={"/micro-assets/inl/video/setting/delete.png"} />
                      删除
                    </span>
                  </a-col>
                </a-row>
              );
            })}

            <span class="icon" onClick={() => addAddress()}>
              <img src={"/micro-assets/inl/video/setting/add.png"} />
              添加服务
            </span>
          </a-form-item>
        </a-form>
        <div class="form_footer">
          {/* <a-button type='primary' onClick={() => save()}>
            保存
          </a-button>
          <a-button onClick={() => cancel()}>取消</a-button> */}
        </div>
      </div>
    );
  },
});
export default utils.installComponent(com, "video-system");
