import { createStore } from "vuex";

export default createStore({
  state: () => ({
    basicForm: {
      name: "", // 报警名称
      alarmType: "FAULT", // 报警类型
      description: "", // 报警详情
      releaseType: "0", // 是否手动消警
      tagList: [], // 标签
      available: true, // 是否启用
      systemUuid: undefined, // 系统编码
    },
    ruleForm: {
      propertyCode: [] as any[], // 设备信号
      valueType: "CURRENT", // 统计方式
      alarmConditionList: [
        {
          alarmLevel: 1, // 报警级别
          opValue: 0, // 报警值
          operator: "EQ", // 操作符
        },
      ], // 报警规则
      conditionRelation: "OR", // 规则间关系
      triggerType: "IMMEDIATELY", // 触发类型
      triggerTime: 0, // 触发时间
    },
    linkageForm: {
      videoAvailable: false, // 联动视频
      audioAvailable: true, // 语音播报
      screenshotAvailable: false, // 抓拍
      notificationStageList: ["CREATE"], // 通知阶段
      notificationUserList: [], // 通知人员
    },
  }),
  getters: {
    basicForm: (state) => state.basicForm,
    ruleForm: (state) => state.ruleForm,
    linkageForm: (state) => state.linkageForm,
  },
  mutations: {
    setBasicForm(state, payload) {
      state.basicForm = payload;
    },
    setRuleForm(state, payload) {
      state.ruleForm = payload;
    },
    setLinkageForm(state, payload) {
      state.linkageForm = payload;
    },
    // 回显表单
    setDetail(state, payload) {
      // 基础表单
      state.basicForm = {
        alarmType: payload.alarmType,
        available: payload.available,
        description: payload.description,
        name: payload.name,
        releaseType: payload.releaseType,
        systemUuid: payload.systemUuid,
        tagList: payload.tagList,
      };
      // 规则表单
      state.ruleForm = {
        alarmConditionList: payload.alarmConditionList,
        conditionRelation: payload.conditionRelation,
        propertyCode: [Number(payload.instanceUuid), payload.propertyCode],
        triggerTime: payload.triggerTime,
        triggerType: payload.triggerType,
        valueType: payload.valueType,
      };
      // 联动表单
      state.linkageForm = {
        audioAvailable: payload.audioAvailable,
        notificationStageList: payload.notificationStageList,
        screenshotAvailable: payload.screenshotAvailable,
        notificationUserList: payload.notificationUserList.map((item: any) => ({
          id: item.userId,
          name: item.userName,
        })),
        videoAvailable: payload.videoAvailable,
      };
    },
  },
  actions: {},
  modules: {},
});
