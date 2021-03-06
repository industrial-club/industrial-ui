// 报警等级过滤
export const alarmLevelFilter = (
  val: string,
  data: Array<{ code: string; name: string }>
) => {
  return data.find((n) => n.code === val)?.name;
};

/**
 * 根据等级 返回点的颜色
 * @param level 等级
 */
export function alarmColor(level: 1 | 2 | 3 | 4) {
  let color;
  switch (level) {
    case 1:
      color = "#EA5858";
      break;
    case 2:
      color = "#FF9214";
      break;
    case 3:
      color = "#FFC414";
      break;
    case 4:
      color = "#3E7EFF";
      break;

    default:
      break;
  }
  return color;
}

export const alarmTypeFilter = (val: number) => {};

export const sendStatusFilter = (val) => {
  switch (val) {
    case "SUCCESS":
      return "成功";
      break;
    case "FAILURE":
      return "失败";
      break;
    default:
      return "--";
      break;
  }
};

export const readStateFilter = (val) => {
  switch (val) {
    case "READ":
      return "已读";
      break;
    case "UNREAD":
      return "未读";
      break;
    default:
      return "--";
      break;
  }
};

export const resendTypeFilter = (val) => {
  switch (val) {
    case "IMMEDIATELY":
      return "立即发送";
      break;
    case "DELAY":
      return "延迟发送";
      break;
    case "TIMING":
      return "定时发送";
      break;
    default:
      return "--";
      break;
  }
};

export const sendMethodFilter = (val, data) => {
  if (data.length > 0) {
    const { name } = data.find((v) => v.code === val);
    return name;
  }
};

export const channelFilter = (val, data) => {
  if (data.length > 0) {
    const { channelName } = data.find((v) => v.id === val);
    return channelName;
  }
};

export const receiverNameFilter = (val, data) => {
  // const receiverNames = data.filter()
};

export const sendStateFilter = (val, data) => {
  if (val && data.length > 0) {
    const sendState = data.find((n) => n.code === val).name;
    return sendState;
  }
};

// 配电柜数据处理
export const elcRoomFilter = (data) => {
  function loopStatusF(v) {
    switch (v) {
      case "0" || 0:
        return "unknown";
        break;
      case "1" || 1:
        return "charged";
        break;
      case "2" || 2:
        return "blackout";
        break;
      default:
        return "unknown";
        break;
    }
  }
  let datas: any = [];
  for (const key in data) {
    const list = data[key].cabinetListDtos.map((item, index) => ({
      row: data[key].row,
      col: index + 1,
      prepareOffAndOnCount: item.layerCount,
      cabinetName: "配电柜",
      cabinetCode: item.cabinetName,
      child: item.cardDtos.map((val) => ({
        powerOffPlateCount: val.loopLockCount,
        loopStatus: loopStatusF(val.loopStatus),
      })),
    }));
    datas = [...datas, ...list];
  }
  return datas;
};
