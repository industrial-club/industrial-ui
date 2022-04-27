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

export default {};
