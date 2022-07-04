const centerColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "通道名称",
    dataIndex: "channelName",
    key: "name",
  },
  {
    title: "通道密钥",
    dataIndex: "id",
    width: 250,
    key: "secretKey",
  },
  {
    title: "通道状态",
    dataIndex: "available",
    key: "state",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];
const gradeColumns = [
  {
    title: "通知等级",
    dataIndex: "level",
    key: "grade",
  },
  {
    title: "是否投用",
    dataIndex: "available",
    key: "isUse",
  },
  {
    title: "选择通知方式",
    dataIndex: "platformList",
    key: "mode",
  },
];
const templateColumns = [
  {
    title: "模板编号",
    dataIndex: "id",
    key: "number",
  },
  {
    title: "模板名称",
    dataIndex: "templateName",
    key: "name",
  },
  {
    title: "最后修改人",
    dataIndex: "updateUserName",
    key: "modifiedBy",
  },
  {
    title: "最后修改时间",
    dataIndex: "updateDt",
    key: "modifiedTime",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];
const managerColumns = [
  {
    title: "通道",
    dataIndex: "channelName",
    key: "passageway",
  },
  {
    title: "通知标题",
    dataIndex: "messageTitle",
    key: "notificationTitle",
  },
  {
    title: "通知等级",
    dataIndex: "level",
    key: "notificationLevel",
  },
  {
    title: "发送人",
    dataIndex: "senderName",
    key: "sender",
  },
  {
    title: "发送类型",
    dataIndex: "sendType",
    key: "sendType",
  },
  {
    title: "创建时间",
    dataIndex: "realSendTime",
    key: "creationTime",
  },
  {
    title: "记录状态",
    dataIndex: "sendState",
    key: "recordStatus",
  },
  {
    title: "发送量（失败）",
    dataIndex: "totalReceiverCount",
    key: "volumeSent",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];
const sendDetailsColumns = [
  {
    title: "收件人",
    dataIndex: "receiverName",
    key: "addressee",
  },
  {
    title: "发送时间",
    dataIndex: "sendTime",
    key: "date",
  },
  {
    title: "发送方式",
    dataIndex: "platform",
    key: "sendMethod",
  },
  {
    title: "发送状态",
    dataIndex: "sendState",
    key: "sendStatus",
  },
  {
    title: "已读状态",
    dataIndex: "readState",
    key: "readStatus",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];

export {
  centerColumns,
  gradeColumns,
  templateColumns,
  managerColumns,
  sendDetailsColumns,
};
