/*
    Módulo de logging da Emma.
    
    Substitui funções globais.
*/

const chalk = require("chalk").default;
const moment = require("moment");

// fazer "backup" das funções originais
const clog = console.log;
const cerr = console.error;

const emmaConsole = {};

emmaConsole.log = (...params) => clog( chalk.gray( moment().format("HH:mm:ss"), "INFO " ), ...params );
emmaConsole.debug = (...params) => clog( chalk.green( moment().format("HH:mm:ss"), "DEBUG" ), ...params );
emmaConsole.warn = (...params) => cerr( chalk.yellow( moment().format("HH:mm:ss"), "WARN " ), ...params );
emmaConsole.error = (...params) => cerr( chalk.red( moment().format("HH:mm:ss"), "ERROR" ), ...params );

global.console = Object.assign(global.console, emmaConsole);

module.exports = global.console;