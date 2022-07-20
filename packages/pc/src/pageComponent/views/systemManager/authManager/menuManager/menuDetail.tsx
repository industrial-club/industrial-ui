/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 09:03:01
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-27 11:49:31
 */
import { defineComponent, ref, inject, watch } from "vue";
import useProxy from "@/pageComponent/hooks/useProxy";
import useBus from "@/pageComponent/hooks/useBus";
import { cloneDeep, omit, isEqual } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/api/auth/menuManager";
import { IUrlObj, openMode } from "./index";

import { message, Modal } from "ant-design-vue";
import MenuForm from "./menuForm";

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
    const originForm = ref<any>({});
    const changeForm = (val: any) => {
      if (!val) return;
      originForm.value = {
        ...(val.dataRef ?? val),
        valid: val.valid === 1,
      };
      form.value = cloneDeep(originForm.value);
    };
    watch(
      () => props.node,
      async (val) => {
        // 确定是否保存
        const currForm = isEdit.value ? formRef.value._getForm() : form.value;
        if (isEdit.value && !isEqual(currForm, originForm.value)) {
          Modal.confirm({
            title: "确定保存",
            content: "是否保存当前修改？",
            async onOk() {
              await handleSave();
              changeForm(val);
            },
            onCancel() {
              changeForm(val);
              isEdit.value = false;
            },
          });
        } else {
          isEdit.value = false;
          changeForm(val);
        }
      },
      { immediate: true, deep: true }
    );

    const startEdit = () => {
      if (props.node) {
        isEdit.value = true;
      }
    };

    const handleSave = async () => {
      const data = await formRef.value._validate();

      await api.editMenuRecord(urlMap.update)({
        ...omit(data, "subList"),
        valid: data.valid ? 1 : 0,
      });
      message.success("保存成功");
      bus.emit("tree/refresh");
      isEdit.value = false;
    };

    /* 暴露编辑函数 */
    proxy._edit = () => {
      startEdit();
    };

    return () => {
      // 打开方式
      const renderMode = (mode: number) =>
        openMode.find((item) => item.value === mode)?.label;

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
              {isEdit.value ? (
                <MenuForm
                  ref={formRef}
                  form={form.value}
                  parentName={props.node?.parent?.node.name}
                />
              ) : (
                <a-form labelCol={{ style: { width: "6em" } }}>
                  <a-form-item label="菜单编码">{form.value.code}</a-form-item>
                  <a-form-item label="页面名称">{form.value.name}</a-form-item>
                  <a-form-item label="父级页面">
                    {props.node?.parent?.node.name}
                  </a-form-item>
                  <a-form-item label="页面URL">{form.value.url}</a-form-item>
                  <a-form-item label="打开方式">
                    {renderMode(form.value.mode)}
                  </a-form-item>
                  <a-form-item label="启用状态">
                    {form.value.valid ? "启用" : "禁用"}
                  </a-form-item>
                  <a-form-item label="ICON">
                    <icon-font type={form.value.icon}></icon-font>
                  </a-form-item>
                </a-form>
              )}
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
