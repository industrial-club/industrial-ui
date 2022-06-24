import { defineComponent, ref, PropType, watch, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
import utils from "@/utils";
import { centerColumns } from "@/pageComponent/config/systemConfig";
import addChannel from "@/pageComponent/components/noticeManager/addChannel";
import maintainModal from "@/pageComponent/components/noticeManager/noticeMaintain";

const noticeCenter = defineComponent({
  name: "NoticeCenter",
  components: {
    addChannel,
    maintainModal,
  },
  setup(_props) {
    const noticeList = ref([
      {
        name: "通知通道",
        secretKey: "MY543532343",
        state: true,
      },
      {
        name: "通知通道",
        secretKey: "MY543532344",
        state: false,
      },
    ]);
    const { toClipboard } = useClipboard();
    const channelVisible = ref(false);
    const title = ref("");
    const maintainVisible = ref(false);
    const maintainTitle = ref("");
    const api = ref({});

    const edit = async () => {
      title.value = "修改通道";
      channelVisible.value = true;
    };
    const channelOk = () => {
      channelVisible.value = false;
    };
    const channelCancel = () => {
      channelVisible.value = false;
    };
    const maintainOk = () => {
      maintainVisible.value = false;
    };
    const maintainCancel = () => {
      maintainVisible.value = false;
    };
    const copy = async (val) => {
      try {
        await toClipboard(val);
        message.success("复制成功");
      } catch (error) {
        console.log(error);
        message.error("复制失败");
      }
    };

    return () => (
      <div class="noticeCenter">
        <div class="noticeCenter-top">
          <a-button
            type="primary"
            onClick={() => {
              title.value = "新增通道";
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
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "index") {
                  return index + 1;
                }
                if (column.dataIndex === "state") {
                  return record.state ? "启用" : "禁用";
                }
                if (column.dataIndex === "secretKey") {
                  return (
                    <div class="secretKey">
                      <div>{record.secretKey}</div>
                      <a-button
                        type="link"
                        onClick={() => {
                          copy(record.secretKey);
                        }}
                        v-slots={{
                          icon: () => <copy-outlined />,
                        }}
                      ></a-button>
                    </div>
                  );
                }
                if (column.dataIndex === "action") {
                  return (
                    <div>
                      <a-button
                        type="link"
                        onClick={() => {
                          maintainVisible.value = true;
                        }}
                      >
                        通道维护
                      </a-button>
                      {index != 0 ? (
                        <a-button
                          type="link"
                          onClick={() => {
                            edit();
                          }}
                        >
                          编辑
                        </a-button>
                      ) : null}
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
          onOk={channelOk}
          onCancel={channelCancel}
          centered={true}
        >
          <addChannel></addChannel>
        </a-modal>
        <a-modal
          v-model={[maintainVisible.value, "visible"]}
          title={maintainTitle.value}
          onOk={maintainOk}
          onCancel={maintainCancel}
          centered={true}
          width={1200}
        >
          <maintainModal></maintainModal>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(noticeCenter, "notice-center");
