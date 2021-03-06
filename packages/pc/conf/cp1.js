var fs = require("fs");
var path = require("path");

const getPath = (p = "./") => {
  return path.resolve(__dirname, p);
};
var copyFile = function (srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on("error", function (err) {
    if (err) {
      console.log("read error", srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on("error", function (err) {
    if (err) {
      console.log("write error", tarPath);
    }
    cb && cb(err);
  });
  ws.on("close", function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
};
var copyFolder = function (srcDir, tarDir, cb) {
  fs.readdir(srcDir, function (err, files) {
    var count = 0;
    var checkEnd = function () {
      ++count == files.length && cb && cb();
    };

    if (err) {
      checkEnd();
      return;
    }

    files.forEach(function (file) {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);

      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log("mkdir", tarPath);
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(err);
              return;
            }

            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
};
const createDir = () => {
  const path = getPath("../dist/theme");
  fs.stat(path, async (err, res) => {
    if (err) {
      await fs.mkdirSync(path);
    }
    copyFolder(
      getPath("../../../theme/theme"),
      getPath("../dist/theme"),
      function (err) {
        if (err) {
          return;
        }

        //continue
      }
    );
  });
};
createDir();
