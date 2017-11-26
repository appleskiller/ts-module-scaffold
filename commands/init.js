var inquirer = require('inquirer');
var template = require('../util/template');
var logger = require('../util/logger');

module.exports = (commander) => {
    commander.command("init")
        .description('generate all project files in current dir')
        .option('-f --force', 'force to overwrite all existing files')
        .action((args) => {
            inquirer.prompt([{
                type: 'input',
                message: 'project name',
                name: 'name'
            }, {
                type: 'input',
                message: 'author',
                name: 'author'
            }]).then((answer) => {
                answer.currentYear = (new Date()).getFullYear();
                template.generate(answer, args).then((remains) => {
                    logger.ok('Done.')
                }).catch((err) => {
                    logger.fail('generate fail.', err);
                });
            })
        })
}