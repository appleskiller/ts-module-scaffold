var chalk = require('chalk');

var logger = {
    log: (level, msg, submsg) => {
        if (!logger[level]) return;
        logger[level](msg, submsg);
    },
    info: (msg, submsg) => {
        console.log(chalk.cyan('\u003E'), msg);
        submsg && console.log(chalk.gray(submsg));
    },
    warn: (msg, submsg) => {
        console.log(chalk.yellow('!'), msg);
        submsg && console.log(chalk.gray(submsg));
    },
    error: (msg, submsg) => {
        console.log(chalk.red('\u2718'), msg);
        if (!submsg) return;
        if (typeof submsg === "string") {
            console.log(chalk.gray(submsg));
        } else {
            ('message' in submsg) && console.log(chalk.gray(submsg.message))
            if (process.argv.indexOf("--verbose") !== -1) {
                ('stack' in submsg) && console.log(chalk.gray(submsg.stack))
            }
        }
    },
    ok: (msg, submsg) => {
        console.log(chalk.green('\u2714'), msg);
        submsg && console.log(chalk.gray(submsg));
    },
    fail: (msg, submsg) => {
        logger.error(msg, submsg);
        process.exit();
    },
}

module.exports = logger;