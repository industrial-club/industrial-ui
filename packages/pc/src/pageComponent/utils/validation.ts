export const phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/;

/**
 * 创建必填的规则对象
 * @param label 表单项中文名称
 */
export function getRequiredRule(label: string) {
  return {
    required: true,
    message: `${label}是必填项`,
  };
}

/**
 * 创建最大长度规则对象
 * @param label 名称
 * @param max 最大长度
 */
export function getMaxRule(label: string, max: number) {
  return {
    max,
    message: `${label}长度不能超过${max}个字符`,
  };
}

export default {};
