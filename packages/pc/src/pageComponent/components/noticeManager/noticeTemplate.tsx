import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { Modal } from "ant-design-vue";
import noticeCenterApi from "@/api/noticeCenter";
import addTemplate from "@/pageComponent/components/noticeManager/addTemplate";
import { templateColumns } from "../../config/systemConfig";
import moment from "moment";

const props = {
  formData: Object,
};

export default defineComponent({
  name: "NoticeTemplate",
  components: {
    addTemplate,
  },
  props,
  setup(_props, _context) {
    // 查询表单
    const form = reactive<{
      [key: string]: string;
    }>({});

    // 模板数据
    const templateData = ref({});

    // 通道数据
    const data = reactive<{
      id?: number;
      corpId?: string;
      channelName?: string;
      available?: boolean;
      notificationChannelConfigList?: null;
    }>({});

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
    });

    // 列表数据
    const dataSource = ref([]);

    // 通道列表
    const channelList = ref<
      Array<{
        id?: number;
        corpId?: string;
        channelName?: string;
        available?: boolean;
        notificationChannelConfigList?: null;
      }>
    >([]);

    // 新增/修改模板弹窗显示
    const templateVisible = ref(false);

    // 新增/修改模板弹窗title
    const title = ref("");

    const http = async () => {
      const res = await noticeCenterApi.getChannelTemplateList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        channelId: data.id,
        ...form,
      });
      if (res.data) {
        pagination.current = res.data.current;
        pagination.total = res.data.total;
        dataSource.value = res.data.records;
      }
    };

    // 获取通道列表
    const getChannelList = async () => {
      const res = await noticeCenterApi.getChannelList();
      channelList.value = res.data;
    };

    // 编辑
    const edit = async (val) => {
      title.value = "修改模板";
      templateData.value = val;
      templateVisible.value = true;
    };

    // 分页变化
    const tableChange = (page) => {
      const { current, pageSize, total } = page;
      pagination.current = current;
      pagination.pageSize = pageSize;
      pagination.total = total;
      http();
    };

    watch(
      () => _props.formData,
      (e) => {
        if (e) {
          for (const key in e) {
            data[key] = e[key];
          }
          nextTick(() => {
            http();
          });
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      getChannelList();
    });
    return () => (
      <div class="noticeTemplate">
        <div class="noticeTemplate-top">
          <a-form
            label-col={{ span: 8 }}
            wrapper-col={{ span: 16 }}
            model={form}
          >
            <a-row grade={24}>
              {/* <a-col span={6}>
                <a-form-item label="模板分类">
                  <a-select
                    ref="select"
                    allowClear
                    v-model={[form.channelId, "value"]}
                  >
                    {channelList.value.map((item) => (
                      <a-select-option value={item.id}>
                        {item.channelName}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col> */}
              <a-col span={6}>
                <a-form-item label="模板编号">
                  <a-input
                    v-model={[form.templateCode, "value"]}
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
              <a-col span={12} style={{ textAlign: "right" }}>
                <a-button
                  type="primary"
                  onClick={() => {
                    http();
                  }}
                >
                  查询
                </a-button>
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
                templateData.value = {};
                title.value = "新增模板";
              }}
            >
              新增模板
            </a-button>
          </div>
          <a-table
            dataSource={dataSource.value}
            columns={templateColumns}
            scroll={{ y: 500 }}
            pagination={pagination}
            onChange={tableChange}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.key === "modifiedTime") {
                  return moment(record.updateDt).format("YYYY-MM-DD HH:mm:ss");
                }
                if (column.dataIndex === "action") {
                  return (
                    <div>
                      <a-button
                        type="link"
                        onClick={() => {
                          edit(record);
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
                            async onOk() {
                              const res =
                                await noticeCenterApi.getChannelTemplateDelete(
                                  record.id
                                );
                              if (res.data) {
                                http();
                                return true;
                              } else {
                                return false;
                              }
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
          centered={true}
          footer={false}
          keyboard={false}
          maskClosable={false}
        >
          <addTemplate
            formData={templateData.value}
            channelId={data.id}
            onClose={() => {
              http();
              templateVisible.value = false;
            }}
          ></addTemplate>
        </a-modal>
      </div>
    );
  },
});
