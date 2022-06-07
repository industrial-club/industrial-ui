// cp 文件
const fs = require("fs");
const path = require("path");

const gitPath = (p = "./") => {
  return path.resolve(__dirname, p);
};

const cpFiles = (file1, file2) => {
  fs.readFile(file1, "utf8", (err, res) => {
    if (!err) {
      fs.writeFile(file2, res, (err, rr) => {
        if (err) {
          throw Error("写入文件失败.");
        }
      });
    } else {
      throw Error("读取主题文件失败.");
    }
  });
};

const readDir = () => {
  const pp = gitPath("../../../test-theme/style");
  const pp2 = gitPath("../dist/theme");
  fs.readdir(pp, (err, res) => {
    if (!err) {
      for (let i of res) {
        const ll = i.split(".");

        if (ll.length > 1) {
          const item = {
            file1: `${pp}/${ll[0]}.less`,
            file2: `${pp2}/${ll[0]}.less`,
          };
          cpFiles(item.file1, item.file2);
        }
      }
    }
  });
};
const createDir = () => {
  const path = gitPath("../dist/theme");
  fs.stat(path, (err, res) => {
    if (err) {
      fs.mkdirSync(path);
    }
    readDir();
  });
};
createDir();
