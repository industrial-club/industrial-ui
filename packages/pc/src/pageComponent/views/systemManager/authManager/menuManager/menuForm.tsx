import { computed, defineComponent, ref, watch } from "vue";
import { cloneDeep } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import { openMode } from ".";
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

const APP_TYPE_LIST = [
  {
    label: "工矿平台版",
    value: "mtip-factory",
  },
  {
    label: "执行单机版",
    value: "mtip-base-system",
  },
  {
    label: "设备单机版",
    value: "mtip-base-device",
  },
  {
    label: "第三方应用",
    value: "third",
  },
  {
    label: "智信",
    value: "zhixin",
  },
];

/**
 * 菜单表单
 */
const MenuForm = defineComponent({
  props: {
    form: {
      type: Object,
    },
    parentName: {
      type: String,
    },
  },
  setup(props, { expose }) {
    const formRef = ref();
    const form = ref<any>({});

    watch(
      () => props.form,
      (val) => {
        if (val) {
          form.value = cloneDeep(val);
        }
      },
      { immediate: true, deep: true }
    );

    /* ===== URL参数逻辑 ===== */
    // 应用类型
    const appType = ref<string | undefined>("mtip-factory");

    const isWithOrigin = computed(() => form.value.url.startsWith("http"));
    const fullUrl = computed(() => {
      const res = isWithOrigin.value
        ? form.value.url
        : `${location.origin}${form.value.url.startsWith("/") ? "" : "/"}${
            form.value.url
          }`;
      return res;
    });

    const searchParams = computed(() => {
      try {
        const url = new URL(fullUrl.value);
        let finnalUrl = url;
        if (url.hash) {
          finnalUrl = new URL(url.hash.replace("#", location.origin));
        }
        return finnalUrl.searchParams;
      } catch (e) {
        console.error(e);
        return new URLSearchParams();
      }
    });

    // 回显应用类型
    watch(
      () => form.value.url,
      () => {
        appType.value =
          searchParams.value.get("appType") ?? APP_TYPE_LIST[0].value;
      },
      { immediate: true }
    );

    // 参数列表
    const paramList = computed(() => {
      const res: any[] = [];
      searchParams.value.forEach((val, key) => {
        res.push({
          key,
          value: val,
        });
      });
      return res;
    });

    // 更改/删除 参数
    const modifyParam = ({ key, value }: any, isRemove = false) => {
      try {
        const url = new URL(fullUrl.value);
        if (url.hash) {
          const converceUrl = new URL(url.hash.replace("#", location.origin));
          if (isRemove) {
            converceUrl.searchParams.delete(key);
          } else {
            converceUrl.searchParams.set(key, value);
          }
          url.hash = converceUrl.href.replace(location.origin, "#");
        } else {
          if (isRemove) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, value);
          }
        }
        form.value.url = isWithOrigin.value
          ? url.href
          : url.href.replace(location.origin, "");
      } catch (e) {
        console.log(e);
      }
    };

    // 移除一个参数
    const handleRemoveParam = (item: any) => {
      modifyParam(item, true);
    };

    // 添加参数
    const newParam = ref({
      key: "",
      value: "",
    });
    const isAddParam = ref(false);
    const handleAddParam = () => {
      modifyParam(newParam.value);
      newParam.value.key = "";
      newParam.value.value = "";
    };

    watch(
      [appType, () => form.value.mode],
      ([val, mode]) => {
        if (mode === 0) return;
        modifyParam({ key: "appType", value: appType.value });
      },
      { immediate: true }
    );

    expose({
      _validate: async () => {
        await formRef.value.validate();
        return form.value;
      },
      _resetFields: () => formRef.value.resetFields(),
      _getForm: () => form.value,
    });

    return () => (
      <div class="menu-form">
        <a-form
          ref={formRef}
          model={form.value}
          labelCol={{ style: { width: "6em" } }}
          wrapperCol={{ style: { maxWidth: "500px" } }}
        >
          <a-form-item
            name="code"
            label="菜单编码"
            rules={getRequiredRule("菜单编码")}
          >
            <a-input v-model={[form.value.code, "value"]}></a-input>
          </a-form-item>
          <a-form-item
            name="name"
            label="页面名称"
            rules={getRequiredRule("页面名称")}
          >
            <a-input v-model={[form.value.name, "value"]}></a-input>
          </a-form-item>
          {props.parentName !== undefined && (
            <a-form-item label="父级页面">{props.parentName}</a-form-item>
          )}
          <a-form-item
            name="url"
            label="页面URL"
            rules={getRequiredRule("页面URL")}
          >
            <a-input v-model={[form.value.url, "value"]}></a-input>
            {form.value.mode !== 0 && (
              <>
                <a-button
                  style={{ margin: "8px" }}
                  type="primary"
                  onClick={() => (isAddParam.value = true)}
                >
                  <PlusOutlined />
                  添加参数
                </a-button>
                <ul class="params-container">
                  {paramList.value?.map((item) => (
                    <li key={item.key} class="param-item">
                      <a-space>
                        <span class="param-key">{item.key}</span>
                        <span>:</span>
                        <span class="param-value">{item.value}</span>
                        {item.key !== "appType" && (
                          <CloseOutlined
                            class="btn-remove"
                            style={{ color: "#ff4d4f" }}
                            onClick={() => handleRemoveParam(item)}
                          />
                        )}
                      </a-space>
                    </li>
                  ))}
                </ul>
                {isAddParam.value && (
                  <a-form-item style={{ margin: 0 }}>
                    <a-space>
                      <a-input
                        placeholder="参数名"
                        v-model={[newParam.value.key, "value"]}
                      ></a-input>
                      <span>:</span>
                      <a-input
                        placeholder="参数值"
                        v-model={[newParam.value.value, "value"]}
                      ></a-input>
                      <CheckOutlined onClick={handleAddParam} />
                      <CloseOutlined
                        style={{ color: "#ff4d4f" }}
                        onClick={() => {
                          isAddParam.value = false;
                          newParam.value = {
                            key: "",
                            value: "",
                          };
                        }}
                      />
                    </a-space>
                  </a-form-item>
                )}
                <a-form-item style={{ margin: 0 }} label="应用类型">
                  <a-radio-group
                    options={APP_TYPE_LIST}
                    v-model={[appType.value, "value"]}
                  ></a-radio-group>
                </a-form-item>
              </>
            )}
          </a-form-item>
          <a-form-item name="mode" label="打开方式">
            <a-select
              options={openMode}
              v-model={[form.value.mode, "value"]}
            ></a-select>
          </a-form-item>
          <a-form-item name="valid" label="启用状态">
            <a-switch v-model={[form.value.valid, "checked"]} />
          </a-form-item>
          <a-form-item name="icon" label="ICON" extra="请输入iconfont中的名称">
            <a-input v-model={[form.value.icon, "value"]}></a-input>
          </a-form-item>
        </a-form>
      </div>
    );
  },
});

export default MenuForm;
