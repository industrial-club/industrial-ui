const createDom = (node: string) => {
  const { body } = document;
  const btn = document.createElement(node);
  btn.setAttribute("src", "/ht_/libs/ht.js");
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
const datatype = (data: any): string => {
  const toString = Object.prototype.toString;
  const typeMap: any = {
    "[object Boolean]": "boolean",
    "[object String]": "string",
    "[object Number]": "number",
    "[object Array]": "array",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Function]": "function",
    "[object Object]": "object",
    "[object RegExp]": "regExp",
    "[object Date]": "date",
    "[object Set]": "set",
    "[object Map]": "map",
    "[object HTMLDivElement]": "html",
  };

  return typeMap[toString.call(data)];
};
const deepclone = (data: any): any => {
  const type = datatype(data);
  let o: any = undefined;
  if (type === "array") {
    o = [];
    data.forEach((item: any) => {
      o.push(deepclone(item));
    });
  } else if (type === "object") {
    o = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        o[key] = deepclone(data[key]);
      }
    }
  } else if (type === "set") {
    o = new Set();
    data.forEach((item: any) => {
      o.add(deepclone(item));
    });
  } else if (type === "map") {
    o = new Map();

    for (const key in data) {
      o.set(key, deepclone(data[key]));
    }
  } else {
    o = data;
  }

  return o;
};

// eslint-disable-next-line import/prefer-default-export
export { createDom, setRem, datatype, deepclone };
