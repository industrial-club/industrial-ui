/**
 * 随机字符
 */
export const randomKey = () => {
  return (
    (new Date().valueOf() + Math.ceil(Math.random() * 10000)).toString() +
    Math.random().toString(16).substring(2, 15)
  );
};
