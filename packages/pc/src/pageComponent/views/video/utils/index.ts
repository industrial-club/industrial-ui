const createDom = (node: string) => {
  const { body } = document;
  const btn = document.createElement(node);
  btn.setAttribute('src', '/ht_/libs/ht.js');
  body.appendChild(btn);
};
const timestampToTime = (timestamp: number) => {
  var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = `${date.getFullYear()}-`;
  var M = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-`;
  var D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
  var h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
  var m = `${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }:`;
  var s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return Y + M + D + h + m + s;
};
// eslint-disable-next-line import/prefer-default-export
export { createDom, timestampToTime };
