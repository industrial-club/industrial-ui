import { defineComponent, ref, PropType, watch, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
import utils from "@/utils";
import { centerColumns } from "@/pageComponent/config/systemConfig";
import addChannel from "@/pageComponent/components/noticeManager/addChannel";
import maintainModal from "@/pageComponent/components/noticeManager/noticeMaintain";
import noticeCenterApi from "@/api/noticeCenter";

const noticeCenter = defineComponent({
  name: "NoticeCenter",
  components: {
    addChannel,
    maintainModal,
  },
  setup(_props) {
    // 列表数据
    const noticeList = ref([]);

    // 通道数据
    const data = ref({});

    // 一键复制
    const { toClipboard } = useClipboard();

    // 新增/修改通道弹窗显示
    const channelVisible = ref(false);

    // 新增/修改通道弹窗title
    const title = ref("");

    // 通道维护弹窗显示
    const maintainVisible = ref(false);

    // 获取数据
    const http = async () => {
      const res = await noticeCenterApi.getChannelList();
      noticeList.value = res.data;
    };

    // 编辑
    const edit = async (val) => {
      title.value = "修改通道";
      data.value = val;
      channelVisible.value = true;
    };

    // 通道维护
    const maintainCancel = () => {
      maintainVisible.value = false;
    };

    // 复制
    const copy = async (val) => {
      try {
        await toClipboard(val);
        message.success("复制成功");
      } catch (error) {
        console.log(error);
        message.error("复制失败");
      }
    };

    onMounted(() => {
      http();
    });
    return () => (
      <div class="noticeCenter">
        <div class="noticeCenter-top">
          <a-button
            type="primary"
            onClick={() => {
              title.value = "新增通道";
              data.value = {};
              channelVisible.value = true;
            }}
          >
            新增通道
          </a-button>
        </div>
        <div class="noticeCenter-content">
          <a-table
            dataSource={noticeList.value}
            columns={centerColumns}
            bordered
            pagination={false}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.key === "index") {
                  return index + 1;
                }
                if (column.key === "state") {
                  return record.available ? "启用" : "禁用";
                }
                if (column.key === "secretKey") {
                  return (
                    <div class="secretKey">
                      <div>{record.id}</div>
                      {record.id ? (
                        <a-button
                          type="link"
                          onClick={() => {
                            copy(record.id);
                          }}
                          v-slots={{
                            icon: () => <copy-outlined />,
                          }}
                        ></a-button>
                      ) : null}
                    </div>
                  );
                }
                if (column.key === "action") {
                  return (
                    <div>
                      <a-button
                        type="link"
                        onClick={() => {
                          data.value = record;
                          maintainVisible.value = true;
                        }}
                      >
                        通道维护
                      </a-button>
                      <a-button
                        type="link"
                        onClick={() => {
                          edit(record);
                        }}
                      >
                        编辑
                      </a-button>
                    </div>
                  );
                }
              },
            }}
          ></a-table>
        </div>
        <a-modal
          v-model={[channelVisible.value, "visible"]}
          title={title.value}
          centered={true}
          footer={false}
          keyboard={false}
          maskClosable={false}
        >
          <addChannel
            onClose={() => {
              channelVisible.value = false;
              http();
            }}
            formData={data.value}
          ></addChannel>
        </a-modal>
        <a-modal
          v-model={[maintainVisible.value, "visible"]}
          onCancel={maintainCancel}
          centered={true}
          width={1200}
          footer={false}
          keyboard={false}
          maskClosable={false}
        >
          <maintainModal formData={data.value}></maintainModal>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(noticeCenter, "notice-center");
