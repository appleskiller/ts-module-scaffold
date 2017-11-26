#!/usr/bin/env node --harmony
/**
 * Supported Node versions (>=6.11.4)
 * @Author: appleskiller@163.com 
 * @Date: 2017-11-26 18:02:38 
 */
// -------------------------------------------------------------------
// verify node version
// ===================================================================
var semver = require('semver');
var logger = require('../util/logger');
var version = semver(process.version);
if (!semver.gte(version, '6.11.0')) {
    logger.fail('Unsupported Node version', 'Please upgrade to Node v6.11.0 or higher. https://nodejs.org/')
}
// -------------------------------------------------------------------
// final exception handling
// ===================================================================
process.on('unhandledRejection', on_unhandled_error);
process.on('uncaughtException', on_unhandled_error);

var warned = false;
function on_unhandled_error(err) {
    if (!warned) {
        warned = true;
        logger.error(`Unhandled exception`, err);
    }
}
// -------------------------------------------------------------------
// import commands
// ===================================================================
var commander = require('commander');
var path = require('path');
var glob = require('glob');

var cliVersion = require(path.resolve(__dirname + '/../package.json')).version;

glob.sync(path.resolve(__dirname + "/../commands/*.js"))
    .forEach(function (file) {
        require(file)(commander);
    });
// -------------------------------------------------------------------
// parse args
// ===================================================================
commander.version(cliVersion, '-v --version')
    .option('--verbose', 'log more details')
if (!process.argv.slice(2).length) {
    commander.help();
} else {
    commander.parse(process.argv);
    var notfound = "",i , j;
    if (commander.args) {
        for (i = 0; i < commander.args.length; i++) {
            if (typeof commander.args[i] === 'string') {
                notfound = commander.args[i];
                break;
            }
        }
    }
    if (notfound) {
        logger.error(`'${notfound}' is not a tsmp command. See 'tsmp --help'.`);
    }
}