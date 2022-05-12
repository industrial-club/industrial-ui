/*
 * @Abstract: 用户详情对话框
 * @Author: wang liang
 * @Date: 2022-03-25 09:27:03
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 10:37:33
 */

import { defineComponent, watch, nextTick, ref, inject } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import api from "@/pageComponent/api/auth/userManager";
import { IUrlObj } from "./index";

import { Modal } from "ant-design-vue";

const UserProfileDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    const isVisible = useVModel(props, "visible", emit);

    const profile = ref<any>({});

    /* 打开对话框后 获取用户详情 */
    watch(isVisible, async (val) => {
      if (val) {
        await nextTick();
        const { data } = await api.getEmployeeDetailInfo(urlMap.employeeDetail)(
          props.record.employeeId
        );
        profile.value = data;
      }
    });

    return () => (
      <div class="user-profile-dialog">
        <Modal
          title="员工详情"
          width={650}
          v-model={[isVisible.value, "visible"]}
        >
          {{
            default: () => (
              <a-descriptions
                column={2}
                labelStyle={{
                  display: "block",
                  textAlign: "right",
                  width: "100px",
                }}
              >
                <a-descriptions-item label="编号">
                  {profile.value.code}
                </a-descriptions-item>
                <a-descriptions-item label="姓名">
                  {profile.value.name}
                </a-descriptions-item>
                <a-descriptions-item label="性别">
                  {profile.value.sex === 0 ? "女" : "男"}
                </a-descriptions-item>
                <a-descriptions-item label="年龄">
                  {profile.value.age}
                </a-descriptions-item>
                <a-descriptions-item label="籍贯">
                  {profile.value.nativePlace}
                </a-descriptions-item>
                <a-descriptions-item label="身份证号">
                  {profile.value.identityCard}
                </a-descriptions-item>
                <a-descriptions-item label="入职时间">
                  {profile.value.hiredate}
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                  {profile.value.mobile}
                </a-descriptions-item>
                <a-descriptions-item label="直属领导">
                  {profile.value.bossName}
                </a-descriptions-item>
                <a-descriptions-item label="岗位">
                  {profile.value.jobPostNames}
                </a-descriptions-item>
              </a-descriptions>
            ),
            footer: () => (
              <a-button onClick={() => (isVisible.value = false)}>
                关闭
              </a-button>
            ),
          }}
        </Modal>
      </div>
    );
  },
});

export default UserProfileDialog;
