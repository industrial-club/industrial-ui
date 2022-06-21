import { defineComponent, ref } from "vue";
import utils from "@/utils";
import { centerColumns } from "@/pageComponent/config/systemConfig";
import addChannel from "@/pageComponent/components/noticeManager/addChannel";
import maintainModal from "@/pageComponent/components/noticeManager/noticeMaintain";

const noticeCenter = defineComponent({
  components: {
    addChannel,
    maintainModal,
  },
  setup() {
    const noticeList = ref([
      {
        name: "通知通道",
        secretKey: "",
        state: "启用",
      },
    ]);
    const channelVisible = ref(false);
    const title = ref("");
    const maintainVisible = ref(false);
    const maintainTitle = ref("");

    const edit = async () => {
      title.value = "修改通道";
      channelVisible.value = true;
    };
    const handleOk = () => {};

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
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "index") {
                  return index + 1;
                }
                if (column.dataIndex === "secretKey") {
                  return (
                    <div class="secretKey">
                      <p>{record.secretKey}</p>
                      <a-button
                        type="text"
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
                        type="text"
                        onClick={() => {
                          maintainVisible.value = true;
                        }}
                      >
                        通道维护
                      </a-button>
                      {index != 0 ? (
                        <a-button
                          type="text"
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
          onOk={handleOk}
          centered={true}
        >
          <addChannel></addChannel>
        </a-modal>
        <a-modal
          v-model={[maintainVisible.value, "visible"]}
          title={maintainTitle.value}
          onOk={handleOk}
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
