// 报警等级过滤
export const alarmLevelFilter = (
  val: string,
  data: Array<{ code: string; name: string }>,
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
      color = '#EA5858';
      break;
    case 2:
      color = '#FF9214';
      break;
    case 3:
      color = '#FFC414';
      break;
    case 4:
      color = '#3E7EFF';
      break;

    default:
      break;
  }
  return color;
}

export const alarmTypeFilter = (val: number) => {};
