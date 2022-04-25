/*
 * @Abstract: 新建 更新 查看 员工对话框
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 10:31:58
 */

import { computed, defineComponent, PropType, ref, watch, nextTick } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import dayjs from "dayjs";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/org/depManager";
import {
  Modal,
  Form,
  FormItem,
  Select,
  SelectOption,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Button,
  message,
  DatePicker,
} from "ant-design-vue";
import SearchSelect from "@/pageComponent/components/SearchSelect";

const UpdateEmployeeDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<"view" | "add" | "edit">,
      required: true,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    depId: {
      type: [Number, String],
    },
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const isVisible = useVModel(props, "visible", emit);

    const modalTitle = useModalTitle(props.mode, "员工");

    const isView = computed(() => props.mode === "view");

    /* ===== 表单 ===== */
    const form = ref<any>({});
    const formRef = ref();
    watch(isVisible, async (val) => {
      if (!val) {
        formRef.value.resetFields();
        return;
      }
      await nextTick();
      if (props.mode !== "add") {
        const { data } = await api.getEmployeeDetail(props.record.id);
        data.jobPostIds = (data?.jobPostIds?.split(",") ?? []).map(Number);
        data.hiredate = dayjs(data.hiredate);
        form.value = data;
      }
    });

    /* 保存 */
    const handleSave = async () => {
      await formRef.value.validate();
      const data = {
        ...form.value,
        jobPostIds: form.value?.jobPostIds?.join(",") ?? "",
        hiredate: form.value.hiredate.format("YYYY-MM-DD HH:mm:ss"),
        depId: props.depId,
      };

      if (props.mode === "add") {
        await api.insetEmployee(data);
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.updateEmployee(data);
        message.success("修改成功");
      }
      props.onRefresh?.();
      isVisible.value = false;
    };

    return () => {
      return (
        <div class="update-employee-dialog">
          <Modal
            width={800}
            title={modalTitle.value}
            centered
            v-model={[isVisible.value, "visible"]}
          >
            {{
              default: () => (
                <Form
                  ref={formRef}
                  labelCol={{ style: { width: "120px" } }}
                  model={form.value}
                >
                  <Row>
                    <Col span={12}>
                      <FormItem
                        name="code"
                        required
                        label="编号(唯一)"
                        rules={getRequiredRule("编号")}
                      >
                        {isView.value ? (
                          <span>{form.value.code}</span>
                        ) : (
                          <Input v-model={[form.value.code, "value"]} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="name"
                        required
                        label="姓名"
                        rules={getRequiredRule("姓名")}
                      >
                        {isView.value ? (
                          <span>{form.value.name}</span>
                        ) : (
                          <Input v-model={[form.value.name, "value"]} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="sex"
                        required
                        label="性别"
                        rules={getRequiredRule("性别")}
                      >
                        {isView.value ? (
                          <span>{form.value.sex ? "男" : "女"}</span>
                        ) : (
                          <Select v-model={[form.value.sex, "value"]}>
                            <SelectOption key={1}>男</SelectOption>
                            <SelectOption key={0}>女</SelectOption>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="age"
                        required
                        label="年龄"
                        rules={getRequiredRule("年龄")}
                      >
                        {isView.value ? (
                          <span>{form.value.age}</span>
                        ) : (
                          <InputNumber
                            min={0}
                            controls={false}
                            v-model={[form.value.age, "value"]}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="nativePlace"
                        required
                        label="籍贯"
                        rules={getRequiredRule("籍贯")}
                      >
                        {isView.value ? (
                          <span>{form.value.nativePlace}</span>
                        ) : (
                          <Input v-model={[form.value.nativePlace, "value"]} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="identityCard"
                        label="身份证号"
                        rules={[
                          {
                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                            message: "请输入正确的身份证号",
                          },
                        ]}
                      >
                        {isView.value ? (
                          <span>{form.value.identityCard}</span>
                        ) : (
                          <Input v-model={[form.value.identityCard, "value"]} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="hiredate"
                        required
                        label="入职时间"
                        rules={getRequiredRule("入职时间")}
                      >
                        {isView.value ? (
                          <span>
                            {form.value.hiredate?.format("YYYY/MM/DD")}
                          </span>
                        ) : (
                          <DatePicker
                            format="YYYY/MM/DD"
                            disabledDate={(date) =>
                              date && date?.isAfter(dayjs())
                            }
                            v-model={[form.value.hiredate, "value"]}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="mobile"
                        required
                        label="手机号"
                        rules={[
                          getRequiredRule("手机号"),
                          {
                            pattern:
                              /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                            message: "请输入正确的手机号",
                          },
                        ]}
                      >
                        {isView.value ? (
                          <span>{form.value.mobile}</span>
                        ) : (
                          <Input v-model={[form.value.mobile, "value"]} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem name="bossId" label="直属上级">
                        {isView.value ? (
                          <span>{form.value.bossName}</span>
                        ) : (
                          <SearchSelect
                            getUrl="/employee/all/summary"
                            extParams={{
                              departmentId: props.depId,
                              ruleType: 0,
                            }}
                            v-model={[form.value.bossId, "value"]}
                          ></SearchSelect>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        name="jobPostIds"
                        required
                        label="岗位名称"
                        rules={getRequiredRule("岗位名称")}
                      >
                        {isView.value ? (
                          <span>{props.record.jobPostNames}</span>
                        ) : (
                          <SearchSelect
                            {...{ mode: "multiple" }}
                            getUrl="/jobPost/all/summary"
                            extParams={{ depId: props.depId }}
                            v-model={[form.value.jobPostIds, "value"]}
                          ></SearchSelect>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              ),
              footer: () => (
                <Space>
                  <Button onClick={() => (isVisible.value = false)}>
                    关闭
                  </Button>
                  {!isView.value && (
                    <Button type="primary" onClick={handleSave}>
                      保存
                    </Button>
                  )}
                </Space>
              ),
            }}
          </Modal>
        </div>
      );
    };
  },
});

export default UpdateEmployeeDialog;
