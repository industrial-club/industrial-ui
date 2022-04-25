/*
 * @Abstract: 用户详情对话框
 * @Author: wang liang
 * @Date: 2022-03-25 09:27:03
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 10:37:33
 */

import { defineComponent, watch, nextTick, ref } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import api from "@/pageComponent/api/auth/userManager";

import { Modal, Descriptions, DescriptionsItem, Button } from "ant-design-vue";

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
    const isVisible = useVModel(props, "visible", emit);

    const profile = ref<any>({});

    /* 打开对话框后 获取用户详情 */
    watch(isVisible, async (val) => {
      if (val) {
        await nextTick();
        const { data } = await api.getEmployeeDetailInfo(
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
              <Descriptions
                column={2}
                labelStyle={{
                  display: "block",
                  textAlign: "right",
                  width: "100px",
                }}
              >
                <DescriptionsItem label="编号">
                  {profile.value.code}
                </DescriptionsItem>
                <DescriptionsItem label="姓名">
                  {profile.value.name}
                </DescriptionsItem>
                <DescriptionsItem label="性别">
                  {profile.value.sex === 0 ? "女" : "男"}
                </DescriptionsItem>
                <DescriptionsItem label="年龄">
                  {profile.value.age}
                </DescriptionsItem>
                <DescriptionsItem label="籍贯">
                  {profile.value.nativePlace}
                </DescriptionsItem>
                <DescriptionsItem label="身份证号">
                  {profile.value.identityCard}
                </DescriptionsItem>
                <DescriptionsItem label="入职时间">
                  {profile.value.hiredate}
                </DescriptionsItem>
                <DescriptionsItem label="手机号">
                  {profile.value.mobile}
                </DescriptionsItem>
                <DescriptionsItem label="直属领导">
                  {profile.value.bossName}
                </DescriptionsItem>
                <DescriptionsItem label="岗位">
                  {profile.value.jobPostNames}
                </DescriptionsItem>
              </Descriptions>
            ),
            footer: () => (
              <Button onClick={() => (isVisible.value = false)}>关闭</Button>
            ),
          }}
        </Modal>
      </div>
    );
  },
});

export default UserProfileDialog;
