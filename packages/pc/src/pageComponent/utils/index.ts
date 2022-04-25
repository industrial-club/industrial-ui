const createDom = (node: string) => {
  const { body } = document;
  const btn = document.createElement(node);
  btn.setAttribute('src', '/ht_/libs/ht.js');
  body.appendChild(btn);
};

const setRem = () => {
  // 设计稿以1920px为宽度
  const baseSize = 14; // 这个是设计稿中1rem的大小。
  const scale = document.documentElement.clientWidth / 1920;
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = `${
    baseSize * Math.min(scale, 2)
  }px`;
};

// eslint-disable-next-line import/prefer-default-export
export { createDom, setRem };
