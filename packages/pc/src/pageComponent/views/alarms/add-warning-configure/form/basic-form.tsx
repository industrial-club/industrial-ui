import {
  defineComponent,
  nextTick,
  reactive,
  ref,
  PropType,
  watch,
  inject,
} from "vue";
import $store from "@/pageComponent/store";
import { PlusOutlined } from "@ant-design/icons-vue";
import { TreeDataItem } from "ant-design-vue/lib/tree/Tree";
import { getRootSystem, getChildrenSystem } from "@/api/alarm/warningConfigure";

const props = {
  enumObj: {
    type: Object as PropType<{ [key: string]: Array<any> }>,
  },
};
const rules = {
  name: { required: true, message: "请输入报警名称" },
};
/**
 * 基础信息表单
 */
const BasicForm = defineComponent({
  props,
  setup(_props, _ctx) {
    const formRef = ref();
    const inputRef = ref();

    // 把formRef传给页面根组件
    const setFormRef: any = inject("setFormRef");
    setFormRef(formRef);

    const basicForm = ref<any>({
      name: "", // 报警名称
      alarmType: "FAULT", // 报警类型
      description: "", // 报警详情
      releaseType: "AUTO", // 是否手动消警
      tagList: [], // 标签
      available: true, // 是否启用
      systemUuid: undefined, // 系统编码
    });

    // 表单回显
    watch(
      () => $store.state.basicForm,
      (val) => {
        basicForm.value = val;
      }
    );

    // 系统列表
    const systemList = ref<any[]>([]);

    // 递归获取所有系统列表
    async function getSystemList(pId: string | 0) {
      let data: any[] = [];
      if (pId === 0) {
        data = (await getRootSystem()).data.map((item: any) => ({
          ...item.thingInst,
          pId: 0,
        }));
      } else {
        const { data: list } = await getChildrenSystem(pId);
        data = list.map((item: any) => ({ ...item.thingInst, pId }));
      }
      if (data.length > 0) {
        data.forEach((item: any) => {
          getSystemList(item.id);
        });
      }

      systemList.value.push(...data);
    }
    // const getRoot = async () => {
    //   const { data } = await getRootSystem();
    //   systemList.value = data.map((item: any) => ({
    //     ...item.thingInst,
    //     pId: 0,
    //   }));
    // };
    // getRoot();
    // const loadSystemList = async (treeNode: any) => {
    //   const { data } = await getChildrenSystem(treeNode.dataRef.id);
    //   systemList.value.push(
    //     ...data.map((item: any) => ({
    //       ...item.thingInst,
    //       pId: treeNode.dataRef.id,
    //     }))
    //   );
    //   return true;
    // };
    getSystemList(0);

    const state = reactive<{
      tags: Array<string>;
      inputVisible: boolean;
      inputValue: string;
    }>({
      tags: [],
      inputVisible: false,
      inputValue: "",
    });
    const showInput = () => {
      state.inputVisible = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };
    const handleInputConfirm = () => {
      const { inputValue } = state;
      let tags = basicForm.value.tagList;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      basicForm.value.tagList = tags;
      Object.assign(state, {
        inputVisible: false,
        inputValue: "",
      });
    };
    const handleClose = (removedTag: string) => {
      const tags = basicForm.value.tagList.filter(
        (tag: string) => tag !== removedTag
      );
      basicForm.value.tagList = tags;
    };
    watch(
      () => basicForm,
      (e) => {
        if (e) {
          $store.commit("setBasicForm", e);
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return () => (
      <div class="basic-form form">
        <h2 class="form-title">基础信息</h2>
        <div class="form-container">
          <a-form
            ref={formRef}
            colon={false}
            rules={rules}
            labelAlign="right"
            label-col={{ span: 5 }}
            wrapper-col={{ span: 19 }}
            model={basicForm.value}
          >
            <a-row gutter={16}>
              <a-col span={12}>
                <a-form-item label="报警名称" name="name">
                  <a-input
                    v-model={[basicForm.value.name, "value"]}
                    maxlength={50}
                  />
                </a-form-item>
              </a-col>
              <a-col span={12}>
                <a-form-item label="报警类型">
                  <a-select v-model={[basicForm.value.alarmType, "value"]}>
                    {_props.enumObj?.AlarmTypeEnum.map((item) => (
                      <a-select-option value={item.code}>
                        {item.name}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col>
              {/* <a-col span={12}>
                <a-form-item label="所属厂矿">
                  <a-select v-model={[basicForm.value.alarmType, "value"]}>
                    {_props.enumObj?.AlarmTypeEnum.map((item) => (
                      <a-select-option value={item.code}>
                        {item.name}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col> */}
              {/* <a-col span={12}>
                <a-form-item label="所属项目">
                  <a-select v-model={[basicForm.value.alarmType, "value"]}>
                    {_props.enumObj?.AlarmTypeEnum.map((item) => (
                      <a-select-option value={item.code}>
                        {item.name}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col> */}
              <a-col span={12}>
                <a-form-item
                  name="systemUuid"
                  label="报警系统"
                  rules={{ required: true, message: "请选择报警系统" }}
                >
                  <a-tree-select
                    tree-default-expand-all
                    tree-data={systemList.value}
                    treeDataSimpleMode
                    replaceFields={{ value: "id", label: "name" }}
                    // loadData={loadSystemList}
                    v-model={[basicForm.value.systemUuid, "value"]}
                  ></a-tree-select>
                </a-form-item>
              </a-col>
              <a-col span={12}>
                <a-form-item label="标签">
                  <span>
                    {basicForm.value.tagList.map((item, index) => (
                      <a-tag
                        key={item}
                        closable
                        onClose={() => {
                          handleClose(item);
                        }}
                      >
                        {item}
                      </a-tag>
                    ))}
                  </span>
                  {state.inputVisible ? (
                    <a-input
                      ref={inputRef}
                      style={{ width: "100px" }}
                      type="text"
                      size="small"
                      maxlength={10}
                      v-model={[state.inputValue, "value"]}
                      onBlur={handleInputConfirm}
                      onPressEnter={handleInputConfirm}
                    />
                  ) : (
                    <a-tag
                      style={{ borderStyle: "dashed", backgroundColor: "#fff" }}
                    >
                      <div onClick={showInput}>
                        <PlusOutlined />
                        标签
                      </div>
                    </a-tag>
                  )}
                </a-form-item>
              </a-col>
              <a-col span={12}>
                <a-form-item label="报警详情">
                  <a-textarea
                    maxlength={200}
                    v-model={[basicForm.value.description, "value"]}
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <a-col span={12}>
                <a-form-item label="手动消警">
                  <a-switch
                    checkedValue="MANUAL"
                    unCheckedValue="AUTO"
                    checkedChildren="开"
                    unCheckedChildren="关"
                    v-model={[basicForm.value.releaseType, "checked"]}
                  />
                </a-form-item>
              </a-col>
              <a-col span={12}>
                <a-form-item label="是否启用">
                  <a-switch
                    v-model={[basicForm.value.available, "checked"]}
                    checkedChildren="开"
                    unCheckedChildren="关"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    );
  },
});

export default BasicForm;
