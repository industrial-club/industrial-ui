const centerColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "通道名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "通道密钥",
    dataIndex: "secretKey",
    width: 250,
    key: "secretKey",
  },
  {
    title: "通道状态",
    dataIndex: "state",
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
    dataIndex: "grade",
    key: "grade",
  },
  {
    title: "是否投用",
    dataIndex: "isUse",
    key: "isUse",
  },
  {
    title: "选择通知方式",
    dataIndex: "mode",
    key: "mode",
  },
];
const templateColumns = [
  {
    title: "模板编号",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "模板名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "最后修改人",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
  },
  {
    title: "最后修改时间",
    dataIndex: "modifiedTime",
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
    dataIndex: "passageway",
    key: "passageway",
  },
  {
    title: "通知标题",
    dataIndex: "notificationTitle",
    key: "notificationTitle",
  },
  {
    title: "通知等级",
    dataIndex: "notificationLevel",
    key: "notificationLevel",
  },
  {
    title: "发送人",
    dataIndex: "sender",
    key: "sender",
  },
  {
    title: "发送类型",
    dataIndex: "sendType",
    key: "sendType",
  },
  {
    title: "创建时间",
    dataIndex: "creationTime",
    key: "creationTime",
  },
  {
    title: "记录状态",
    dataIndex: "recordStatus",
    key: "recordStatus",
  },
  {
    title: "发送量（失败）",
    dataIndex: "volumeSent",
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
    dataIndex: "addressee",
    key: "addressee",
  },
  {
    title: "发送时间",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "发送方式",
    dataIndex: "sendMethod",
    key: "sendMethod",
  },
  {
    title: "发送状态",
    dataIndex: "sendStatus",
    key: "sendStatus",
  },
  {
    title: "已读状态",
    dataIndex: "readStatus",
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
