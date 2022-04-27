/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 10:59:48
 */
import { defineComponent, ref, watch } from "vue";
import useProxy from "@/pageComponent/hooks/useProxy";
import useBus from "@/pageComponent/hooks/useBus";
import { cloneDeep, omit } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/auth/menuManager";

import {
  Space,
  Button,
  Form,
  FormItem,
  Input,
  Switch,
  Empty,
  message,
} from "ant-design-vue";
import IconSelect from "@/pageComponent/components/IconSelect";
import Dynamicicon from "@/pageComponent/components/DynamicIcon";

const MenuDetail = defineComponent({
  props: {
    node: {
      type: Object,
    },
  },
  setup(props) {
    const proxy = useProxy();
    const bus = useBus("system");

    const formRef = ref();

    /* 是否编辑状态 */
    const isEdit = ref(false);

    const form = ref<any>({});

    watch(
      () => props.node,
      async () => {
        if (props.node) {
          form.value = cloneDeep({
            ...props.node.dataRef,
            valid: props.node.valid === 1,
          });
        }
      }
    );

    const handleSave = async () => {
      await formRef.value.validate();

      await api.editMenuRecord({
        ...omit(form.value, "subList"),
        valid: form.value.valid ? 1 : 0,
      });
      message.success("修改成功");
      bus.emit("tree/refresh");
      isEdit.value = false;
    };

    /* 暴露编辑函数 */
    proxy._edit = () => (isEdit.value = true);

    return () => {
      return (
        <div class="menu-detail">
          {props.node ? (
            <>
              <div class="header">
                <span class="header-text">基本详情</span>
                <Space>
                  {isEdit.value ? (
                    <>
                      <Button
                        key="close"
                        onClick={() => (isEdit.value = false)}
                      >
                        关闭
                      </Button>
                      <Button key="save" type="primary" onClick={handleSave}>
                        保存
                      </Button>
                    </>
                  ) : (
                    <Button
                      key="edit"
                      type="primary"
                      onClick={() => (isEdit.value = true)}
                    >
                      编辑
                    </Button>
                  )}
                </Space>
              </div>
              <Form
                class="form"
                ref={formRef}
                labelCol={{ span: 4 }}
                labelAlign="right"
                model={form.value}
              >
                <FormItem
                  label="菜单编码"
                  name="code"
                  required
                  rules={getRequiredRule("菜单编码")}
                >
                  {isEdit.value ? (
                    <Input v-model={[form.value.code, "value"]} />
                  ) : (
                    <span>{props.node.code}</span>
                  )}
                </FormItem>
                <FormItem
                  label="页面名称"
                  name="name"
                  required
                  rules={getRequiredRule("页面名称")}
                >
                  {isEdit.value ? (
                    <Input v-model={[form.value.name, "value"]} />
                  ) : (
                    <span>{props.node.name}</span>
                  )}
                </FormItem>
                <FormItem label="父级页面">
                  <span>{props.node?.parent?.node?.name}</span>
                </FormItem>
                <FormItem
                  label="页面URL"
                  name="url"
                  required
                  rules={getRequiredRule("页面URL")}
                >
                  {isEdit.value ? (
                    <Input v-model={[form.value.url, "value"]} />
                  ) : (
                    <span>{props.node.url}</span>
                  )}
                </FormItem>
                <FormItem label="启用状态" name="valid">
                  {isEdit.value ? (
                    <Switch v-model={[form.value.valid, "checked"]} />
                  ) : (
                    <span>{props.node.valid ? "启用" : "禁用"}</span>
                  )}
                </FormItem>
                <FormItem label="ICON" name="icon">
                  {isEdit.value ? (
                    <IconSelect v-model={[form.value.icon, "value"]} />
                  ) : (
                    <Dynamicicon icon={props.node.icon} />
                  )}
                </FormItem>
              </Form>
            </>
          ) : (
            <Empty style={{ maxWidth: "500px" }} description="请选择菜单" />
          )}
        </div>
      );
    };
  },
});

export default MenuDetail;
