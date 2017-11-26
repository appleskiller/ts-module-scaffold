var inquirer = require('inquirer');
var glob = require('glob');
var path = require('path');
var fs = require('fs-extra');
var handlebars = require('handlebars');
var logger = require('./logger');

var templateDir = path.resolve(`${__dirname}/../template`);
function copyFile(source, dest, data, relativeFile) {
    return fs.ensureFile(dest).then(() => {
        var content = fs.readFileSync(source, 'utf-8');
        content = handlebars.compile(content)(data);
        fs.writeFileSync(dest, content, 'utf-8');
        
        logger.ok(relativeFile);
    })
}
function generateFile(file, destDir, data, args) {
    var relativeFile = path.relative(templateDir, file);
    var destFile = path.resolve(path.join(destDir, relativeFile))
    if (args.force || !fs.existsSync(destFile)) {
        return copyFile(file, destFile, data, relativeFile);
    } else {
        return inquirer.prompt({
            type: 'confirm',
            message: `overwrite this file ${relativeFile} ?`,
            name: 'overwrite',
            default: true
        }).then((answer) => {
            if (answer.overwrite) {
                return copyFile(file, destFile, data, relativeFile);
            } else {
                return Promise.resolve(relativeFile);
            }
        })
    }
}

function map(array, handle) {
    if (!array || !array.length) return Promise.resolve();
    var item = array.shift();
    return handle(item).then(() => {
        return map(array, handle);
    }).catch((err) => {
        return Promise.reject(err);
    })
}

module.exports = {
    generate: (data, args) => {
        return new Promise((resolve, reject) => {
            var destDir = process.cwd();
            glob(`${templateDir}/**/*`, (error, matches) => {
                map(matches, (file) => {
                    if (fs.statSync(file).isFile()) {
                        return generateFile(file, destDir, data, args)
                    } else {
                        return Promise.resolve();
                    }
                })
            })
        })
    }
}