import { defineComponent, ref } from "vue";
import setApi from "@/api/setting";
import CheckCamera from "../components/checkCamera";
import utils from "@/utils";

/**
 * 相机权限管理
 */

const columns = [
  {
    title: "角色名称",
    dataIndex: "roleName",
  },
  {
    title: "视频权限",
    key: "permission",
  },
  {
    title: "操作",
    key: "action",
  },
];

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    // 角色列表
    const roleList = ref([]);
    const isLoading = ref(false);
    const getRoleList = async () => {
      isLoading.value = true;
      const { data } = await setApi.getRoleList();
      roleList.value = data;
      isLoading.value = false;
    };
    getRoleList();

    // 配置权限
    const currConfigList = ref([]);
    const currConfigRoleId = ref();
    const isConfigShow = ref(false);
    const handleShowConfig = async (record: any) => {
      const { data } = await setApi.getRolePermission(record.roleId);
      if (Array.isArray(data[record.roleId])) {
        currConfigList.value = data[record.roleId].map(
          (item: any) => item.cameraUuid
        );
      } else {
        currConfigList.value = [];
      }
      currConfigRoleId.value = record.roleId;
      isConfigShow.value = true;
    };
    // 保存权限
    const handleCommit = async () => {
      await setApi.setRolePermission(
        currConfigRoleId.value,
        currConfigList.value
      );
      isConfigShow.value = false;
      getRoleList();
    };

    return {
      roleList,
      isLoading,
      isConfigShow,
      currConfigList,
      handleShowConfig,
      handleCommit,
    };
  },
  render() {
    return (
      <div class="camera-permission">
        <a-table
          columns={columns}
          dataSource={this.roleList}
          loading={this.isLoading}
          pagination={false}
          v-slots={{
            bodyCell: ({ column, record }: any) => {
              let resDom: any = "";
              if (column.key === "action") {
                resDom = (
                  <a onClick={() => this.handleShowConfig(record)}>
                    相机权限配置
                  </a>
                );
              }
              if (column.key === "permission") {
                resDom = (
                  <span>
                    已配置【
                    <span style={{ color: "#3e7eff" }}>{record.cameraNum}</span>
                    】台相机
                  </span>
                );
              }
              return resDom;
            },
          }}
        ></a-table>
        <CheckCamera
          v-models={[
            [this.currConfigList, "checkedKeys"],
            [this.isConfigShow, "visible"],
          ]}
          onOk={this.handleCommit}
          // v-model={[this.isConfigShow, 'visible']}
        />
      </div>
    );
  },
});

export default utils.installComponent(com, "video-permission");
