const colors = require("chalk").default;
const moment = require("moment");

class EmmaLogger {
    constructor () {
        this.console = global.console;
    }

    getTime () {
        return moment().format("HH:mm:ss");
    }

    log (...params) {
        this.console.log(colors.gray(this.getTime(), "INFO  "), ...params);
    }

    error (...params) {
        this.console.error(colors.red(this.getTime(), "ERROR "), ...params);
    }

    debug (...params) {
        this.console.log(colors.gray(this.getTime(), "DEBUG "), ...params);
    }
}

const c = new EmmaLogger();

module.exports = c;