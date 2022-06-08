import { defineComponent, onMounted, reactive, ref, provide, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import {
  baseAll,
  getInstanceListBySystemId,
  getPropertiesListByInstanceId,
  getEnum,
} from "@/pageComponent/api/alarm/warningConfigure";
import { TreeDataItem } from "ant-design-vue/es/tree/Tree";
import $store from "@/pageComponent/store";
import {
  insertAlarmRule,
  getRuleConfigureById,
} from "@/pageComponent/api/alarm/warningConfigure";
import BasicForm from "./form/basic-form";
import RuleForm from "./form/rule-form";
import LinkageForm from "./form/linkage-form";

const AddWarningConfigure = defineComponent({
  props: {
    id: {
      type: String,
    },
    onClose: {
      type: Function,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const configureId = ref();

    // 获取规则详情 回显表单
    const getDetail = async () => {
      const { data } = await getRuleConfigureById(configureId.value);
      if (data) $store.commit("setDetail", data);
    };

    // 判断路径中有没有id 如果有id =》 编辑模式
    if (props.id !== undefined) {
      configureId.value = props.id;
      getDetail();
    }

    // 表单ref 列表
    const formRefList: any[] = [];
    provide("setFormRef", (formRef: any) => {
      formRefList.push(formRef);
    });

    const enumObj = reactive<{
      [key: string]: Array<any>;
    }>({
      AlarmActionEnum: [], // 报警动作
      AlarmLevelEnum: [], // 报警等级
      AlarmStatusEnum: [], // 报警状态
      AlarmTriggerTypeEnum: [], // 报警触发方式
      AlarmTypeEnum: [], // 报警类型
      AlarmValueTypeEnum: [], // 报警值类型
      ConditionRelationEnum: [], // 条件关系
      OperatorEnum: [], // 操作符
      ReleaseTypeEnum: [], // 报警消警方式
      RuleTypeEnum: [], // 报警规则类型
    });
    const baseAllList = ref<Array<TreeDataItem>>([]);
    const findAllList = ref<Array<{ value: string; label: string }>>([]);

    /**
     * 获取字典数据
     */
    const http = () => {
      for (const key in enumObj) {
        getEnum(key).then((res) => {
          enumObj[key] = res.data;
        });
      }
    };
    /**
     * 格式化树形数据
     */
    const childrens = (data: Array<any>) => {
      let val: Array<TreeDataItem> = [];
      val = data.map((item) => ({
        title: item.systemName,
        value: `${item.id}`,
        key: `${item.id}`,
        children: childrens(item.children),
      }));
      return val;
    };
    /**
     * 获取所有系统
     */
    const getBaseAll = async () => {
      const res = await baseAll();
      baseAllList.value = [res.data];
    };
    /**
     * 获取所有设备
     */
    watch(
      () => $store.state.basicForm.systemCode,
      async (val) => {
        if (val) {
          const res = await getInstanceListBySystemId(val);

          res.data = res.data.map((item: any) => {
            item.label = item.modelInstance.instanceName;
            item.value = item.modelInstance.instanceCode;
            return item;
          });

          const propertiesList = await Promise.all(
            res.data.map((item: any) => {
              return getPropertiesListByInstanceId(item.id);
            })
          );
          propertiesList.forEach((item, index) => {
            res.data[index].children = item.data.map((item: any) => {
              item.label = item.propertyName;
              item.value = item.propertyCode;
              return item;
            });
          });
          findAllList.value = res.data;
        }
      },
      { immediate: true }
    );

    // 表单提交
    const tijiao = async () => {
      const validateList = formRefList.map((item) => item.value?.validate());
      await Promise.all(validateList);
      const obj = {
        ...$store.getters.basicForm,
        ...$store.getters.ruleForm,
        ...$store.getters.linkageForm,
        ruleType: "COMPARE_TYPE",
        propertyCode: $store.getters.ruleForm.propertyCode[1],
        instanceCode: $store.getters.ruleForm.propertyCode[0],
        notificationUserList:
          $store.getters.linkageForm.notificationUserList.map((item: any) => ({
            userId: item.id,
            userName: item.name,
          })),
        id: configureId.value ?? null,
      };
      const res = await insertAlarmRule(obj);
      if (res.data) {
        message.success("添加成功");
        props.onClose?.();
      }
    };
    /**
     * 点击取消按钮 返回报警配置界面
     */
    const goBack = () => props.onClose?.();

    onMounted(() => {
      getBaseAll();
      // getFindAll();
      http();
    });
    return () => (
      <div class="add-warning-configure">
        {/* 面包屑 */}
        <a-breadcrumb>
          <a-breadcrumb-item>报警配置</a-breadcrumb-item>
          <a-breadcrumb-item>添加报警</a-breadcrumb-item>
        </a-breadcrumb>
        {/* 表单 */}
        <div class="form-list-container">
          {/* 基础信息 */}
          <BasicForm enumObj={enumObj} baseAllList={baseAllList.value} />
          {/* 报警规则 */}
          <RuleForm enumObj={enumObj} instanceList={findAllList.value} />
          {/* 联动配置 */}
          <LinkageForm enumObj={enumObj} />
        </div>
        {/* 底部按钮 固定 */}
        <div class="footer">
          <a-space>
            <a-button type="primary" onClick={tijiao}>
              提交
            </a-button>
            <a-button onClick={goBack}>取消</a-button>
          </a-space>
        </div>
      </div>
    );
  },
});

export default AddWarningConfigure;
