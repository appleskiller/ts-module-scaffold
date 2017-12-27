const fs = require('fs-extra');
const path = require('path');
const logger = require('terminal-log');
const shell = require('shelljs');
const glob = require("glob");

const resolve = _path => path.resolve(__dirname, '../', _path);

if (fs.existsSync(resolve("types"))) {
    fs.removeSync(resolve("types"));
}
fs.mkdirSync("types");
shell.exec("tsc --rootDir src -d --outDir types", (code, stdout, stderr) => {
    code ? logger.error(stderr || stdout) : logger.info(stdout);
    glob.sync(resolve("types/**/*.js")).forEach((file) => {
        fs.removeSync(file);
    });
})