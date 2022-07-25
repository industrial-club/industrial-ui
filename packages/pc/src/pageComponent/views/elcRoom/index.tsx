import { defineComponent, onMounted, reactive, ref } from "vue";
import utils from "@/utils";
import { getCabinetRoomList } from "@/api/tupu";
import elcRoomHt from "@/pageComponent/components/elcRoomHt";

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "总回路数",
    dataIndex: "loopTotal",
    key: "loopTotal",
  },
  {
    title: "分闸数",
    dataIndex: "openTotal",
    key: "openTotal",
  },
  {
    title: "合闸数",
    dataIndex: "closeTotal",
    key: "closeTotal",
  },
  {
    title: "断连数",
    dataIndex: "disconnectionTotal",
    key: "disconnectionTotal",
  },
  // {
  //   title: "备用数",
  //   dataIndex: "lockTotal",
  //   key: "lockTotal",
  // },
  {
    title: "操作",
    key: "action",
  },
];
const elcRoom = defineComponent({
  name: "ElcRoom",
  components: {
    elcRoomHt,
  },
  setup() {
    const elcRoomList = ref([]);
    const visible = ref(false);
    const data = reactive({
      roomId: 0,
      name: "",
    });
    const http = async () => {
      const res = await getCabinetRoomList();
      elcRoomList.value = res.data;
    };
    onMounted(() => {
      http();
    });
    return () => (
      <div class="elcRoom">
        <a-table
          columns={columns}
          dataSource={elcRoomList.value}
          v-slots={{
            bodyCell: ({ column, record }) => {
              if (column.key === "action") {
                return (
                  <a-button
                    type="link"
                    onClick={() => {
                      data.name = record.name;
                      data.roomId = record.roomId;
                      visible.value = true;
                    }}
                  >
                    查看
                  </a-button>
                );
              }
            },
          }}
        ></a-table>
        <a-modal
          v-model={[visible.value, "visible"]}
          width="100%"
          footer={false}
          wrap-class-name="elcRoom-full-modal"
        >
          <elcRoomHt roomId={data.roomId} name={data.name}></elcRoomHt>
        </a-modal>
      </div>
    );
  },
});
export default utils.installComponent(elcRoom, "elc-room");
