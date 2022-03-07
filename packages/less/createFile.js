const fs = require("fs");

module.exports = (path, str) => {
  path = path || "./";
  str = str || "";

  const lastPath = path.substring(0, path.lastIndexOf("/"));

  fs.mkdir(lastPath, { recursive: true }, (err) => {
    if (err) return err;
    fs.writeFile(path, str, (err) => {
      if (err) return err;
    });
  });
};
