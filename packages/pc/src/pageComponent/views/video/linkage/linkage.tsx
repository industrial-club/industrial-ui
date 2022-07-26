import { defineComponent, onMounted, reactive, ref } from "vue";
import "../assets/styles/video/linkage.less";
import linkApi from "@/api/linkage";
import utils from "@/utils";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
import UpdateMode from "./updateMode";

const columns = [
  {
    title: "模式名称",
    dataIndex: "modeName",
  },
  {
    title: "模式编码",
    dataIndex: "modeCode",
  },
  {
    title: "操作",
    key: "action",
    width: 200,
  },
];

/**
 * 视频联动
 */
const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
    playPagePath: {
      type: String,
      default: "/intelligentCentralizedControl/videoManager/play",
    },
  },
  setup(props, context) {
    const form = ref({ modeName: "", modeCode: "" });

    const tableData = ref([]);
    const currPage = ref(1);
    const total = ref(0);
    const isLoading = ref(false);
    const getTableData = async () => {
      isLoading.value = true;
      const { data } = await linkApi.getModeList({
        ...form.value,
        pageNum: currPage.value,
        pageSize: 10,
      });
      tableData.value = data.list;
      total.value = data.total;
      isLoading.value = false;
    };
    getTableData();

    // 新增
    const isAddShow = ref(false);

    // 编辑
    const isEditShow = ref(false);
    const editRecord = ref({});
    const handleEditClick = (record: any) => {
      editRecord.value = record;
      isEditShow.value = true;
    };

    // 删除
    const handleDelete = async (record: any) => {
      await linkApi.deleteModeById(record.id);
      getTableData();
    };

    return {
      form,
      tableData,
      currPage,
      total,
      isLoading,
      isAddShow,
      isEditShow,
      editRecord,
      getTableData,
      handleEditClick,
      handleDelete,
    };
  },
  render() {
    return (
      <div class="linkage">
        {/* 上方搜索 */}
        <div class="search">
          <a-form
            layout="inline"
            labelCol={{ style: { width: "8em" } }}
            model={this.form}
          >
            <a-row style={{ width: "100%" }}>
              <a-col span={6}>
                <a-form-item name="modeName" label="模式名称">
                  <a-input
                    style="width: 200px"
                    allowClear
                    placeholder="请输入搜索内容"
                    v-model={[this.form.modeName, "value"]}
                  />
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item name="modeCode" label="模式编码">
                  <a-input
                    style="width: 200px"
                    allowClear
                    placeholder="请输入搜索内容"
                    v-model={[this.form.modeCode, "value"]}
                  />
                </a-form-item>
              </a-col>
              <a-col span={6} push={6}>
                <a-form-item style={{ textAlign: "right" }}>
                  <a-button
                    type="primary"
                    onClick={() => {
                      this.currPage = 1;
                      this.getTableData();
                    }}
                  >
                    搜索
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="operation">
          <a-button
            type="link"
            onClick={() => {
              this.isAddShow = true;
            }}
          >
            <PlusCircleOutlined />
            添加窗口模式
          </a-button>
        </div>
        <div class="table">
          <a-table
            loading={this.isLoading}
            columns={columns}
            dataSource={this.tableData}
            pagination={{
              total: this.total,
              current: this.currPage,
              onChange: (page: number) => {
                this.currPage = page;
                this.getTableData();
              },
            }}
            v-slots={{
              bodyCell: ({ column, record }: any) => {
                if (column.key === "action") {
                  return (
                    <a-space>
                      <router-link
                        target="_BLANK"
                        rel="opener"
                        to={{
                          path: this.playPagePath,
                          query: {
                            groupCode: record.itemCodeGroup,
                            modeCode: record.modeCode,
                            splicingId: record.splicingId,
                            cameraUuids: record.cameraUuids,
                          },
                        }}
                      >
                        播放
                      </router-link>
                      <a onClick={() => this.handleEditClick(record)}>编辑</a>
                      <a-popconfirm
                        title="确定删除？"
                        onConfirm={() => this.handleDelete(record)}
                      >
                        <a>删除</a>
                      </a-popconfirm>
                    </a-space>
                  );
                }
                return null;
              },
            }}
          ></a-table>
        </div>

        <UpdateMode
          mode="add"
          v-model={[this.isAddShow, "visible"]}
          onRefresh={this.getTableData}
        />
        <UpdateMode
          mode="update"
          record={this.editRecord}
          v-model={[this.isEditShow, "visible"]}
          onRefresh={this.getTableData}
        />
      </div>
    );
  },
});

export default utils.installComponent(com, "video-linkage");
