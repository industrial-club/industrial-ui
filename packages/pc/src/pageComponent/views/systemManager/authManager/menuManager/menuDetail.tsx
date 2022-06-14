/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-27 11:49:31
 */
import { defineComponent, ref, inject } from "vue";
import useProxy from "@/pageComponent/hooks/useProxy";
import useBus from "@/pageComponent/hooks/useBus";
import { cloneDeep, omit } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/api/auth/menuManager";
import { IUrlObj } from "./index";

import { message } from "ant-design-vue";
import IconSelect from "@/pageComponent/components/IconSelect";
import Dynamicicon from "@/pageComponent/components/DynamicIcon";

const MenuDetail = defineComponent({
  props: {
    node: {
      type: Object,
    },
  },
  setup(props) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    const proxy = useProxy();
    const bus = useBus("system");

    const formRef = ref();

    /* 是否编辑状态 */
    const isEdit = ref(false);

    const form = ref<any>({});

    const startEdit = () => {
      if (props.node) {
        isEdit.value = false;
        form.value = cloneDeep({
          ...(props.node.dataRef ?? props.node),
          valid: props.node.valid === 1,
        });
        isEdit.value = true;
      }
    };

    const handleSave = async () => {
      await formRef.value.validate();

      await api.editMenuRecord(urlMap.update)({
        ...omit(form.value, "subList"),
        valid: form.value.valid ? 1 : 0,
      });
      message.success("修改成功");
      bus.emit("tree/refresh");
      isEdit.value = false;
    };

    /* 暴露编辑函数 */
    proxy._edit = () => {
      startEdit();
    };

    return () => {
      return (
        <div class="menu-detail">
          {props.node ? (
            <>
              <div class="header">
                <span class="header-text">基本详情</span>
                <a-space>
                  {isEdit.value ? (
                    <>
                      <a-button
                        key="close"
                        onClick={() => (isEdit.value = false)}
                      >
                        关闭
                      </a-button>
                      <a-button key="save" type="primary" onClick={handleSave}>
                        保存
                      </a-button>
                    </>
                  ) : (
                    <a-button
                      key="edit"
                      type="primary"
                      onClick={startEdit}
                      disabled={props.node.isSystem}
                    >
                      编辑
                    </a-button>
                  )}
                </a-space>
              </div>
              <a-form
                class="form"
                ref={formRef}
                labelCol={{ span: 4 }}
                labelAlign="right"
                model={form.value}
              >
                <a-form-item
                  label="菜单编码"
                  name="code"
                  required
                  rules={getRequiredRule("菜单编码")}
                >
                  {isEdit.value ? (
                    <a-input v-model={[form.value.code, "value"]} />
                  ) : (
                    <span>{props.node.code}</span>
                  )}
                </a-form-item>
                <a-form-item
                  label="页面名称"
                  name="name"
                  required
                  rules={getRequiredRule("页面名称")}
                >
                  {isEdit.value ? (
                    <a-input v-model={[form.value.name, "value"]} />
                  ) : (
                    <span>{props.node.name}</span>
                  )}
                </a-form-item>
                <a-form-item label="父级页面">
                  <span>{props.node?.parent?.node?.name}</span>
                </a-form-item>
                <a-form-item
                  label="页面URL"
                  name="url"
                  required
                  rules={getRequiredRule("页面URL")}
                >
                  {isEdit.value ? (
                    <a-input v-model={[form.value.url, "value"]} />
                  ) : (
                    <span>{props.node.url}</span>
                  )}
                </a-form-item>
                <a-form-item label="启用状态" name="valid">
                  {isEdit.value ? (
                    <a-switch v-model={[form.value.valid, "checked"]} />
                  ) : (
                    <span>{props.node.valid ? "启用" : "禁用"}</span>
                  )}
                </a-form-item>
                <a-form-item
                  label="ICON"
                  name="icon"
                  extra="请输入iconfont中的名称"
                >
                  {isEdit.value ? (
                    <a-input v-model={[form.value.icon, "value"]}></a-input>
                  ) : (
                    <icon-font
                      style={{ color: "#5c667d", fontSize: "20px" }}
                      type={props.node.icon}
                    ></icon-font>
                  )}
                </a-form-item>
              </a-form>
            </>
          ) : (
            <a-empty style={{ maxWidth: "500px" }} description="请选择菜单" />
          )}
        </div>
      );
    };
  },
});

export default MenuDetail;
