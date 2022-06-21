import { defineComponent, reactive, ref } from "vue";
import { Modal } from "ant-design-vue";
import { templateColumns } from "../../config/systemConfig";
import addTemplate from "@/pageComponent/components/noticeManager/addTemplate";

export default defineComponent({
  name: "NoticeTemplate",
  components: {
    addTemplate,
  },
  setup() {
    const form = reactive({
      templateClassification: "",
      templateNo: "",
      templateName: "",
    });
    const dataSource = ref([
      {
        number: "SYS3324324",
        name: "验证码",
        modifiedBy: "李师傅",
        modifiedTime: "2022-3-4 12:23:23",
      },
    ]);
    const templateVisible = ref(false);
    const title = ref("");

    const handleOk = () => {};
    const edit = async () => {
      title.value = "修改模板";
      templateVisible.value = true;
    };

    return () => (
      <div class="noticeTemplate">
        <div class="noticeTemplate-top">
          <a-form
            label-col={{ span: 8 }}
            wrapper-col={{ span: 16 }}
            model={form}
          >
            <a-row grade={24}>
              <a-col span={6}>
                <a-form-item label="模板分类">
                  <a-select
                    ref="select"
                    v-model={[form.templateClassification, "value"]}
                  >
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="模板编号">
                  <a-input
                    v-model={[form.templateNo, "value"]}
                    placeholder="模板编号搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="模板名称">
                  <a-input
                    v-model={[form.templateName, "value"]}
                    placeholder="模板名称搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col span={6} style={{ textAlign: "right" }}>
                <a-button type="primary">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="noticeTemplate-content">
          <div>
            <a-button
              type="primary"
              onClick={() => {
                templateVisible.value = true;
                title.value = "新增模板";
              }}
            >
              新增模板
            </a-button>
          </div>
          <a-table
            dataSource={dataSource.value}
            columns={templateColumns}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "action") {
                  return (
                    <div>
                      <a-button
                        type="text"
                        onClick={() => {
                          edit();
                        }}
                      >
                        编辑
                      </a-button>
                      <a-button
                        type="text"
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: "系统提示",
                            content: "请确定是否删除此模板？",
                            onOk() {
                              return false;
                            },
                            onCancel() {},
                          });
                        }}
                      >
                        删除
                      </a-button>
                    </div>
                  );
                }
              },
            }}
          ></a-table>
        </div>
        <a-modal
          v-model={[templateVisible.value, "visible"]}
          title={title.value}
          onOk={handleOk}
          centered={true}
        >
          <addTemplate></addTemplate>
        </a-modal>
      </div>
    );
  },
});
