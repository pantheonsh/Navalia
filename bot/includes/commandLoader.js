const fs = require("fs");
const path = require("path");

/**
 * Carrega todos os comandos em um diretório
 * @param {String} commandsPath 
 * @returns {Map<string>} Map que contém os comandos.
 */
function commandLoader (commandsPath) {
    const Commands = new Map();
    Commands.aliases = [];
    Commands.notaliases = [];
    const commandFiles = fs.readdirSync(commandsPath);

    commandFiles.forEach(commandFile => {
        if(commandFile.endsWith(".disabled.js")) return;

        const commandPath = path.resolve(commandsPath, commandFile);
        const command = new (require(commandPath))();

        Commands.set(command.name, command);
        Commands.notaliases.push(command);
        
        // aliases são comandos também
        command.aliases.forEach(aliasName => {
            Commands.aliases.push(aliasName);
            Commands.set(aliasName, command);
        });
    });

    return Commands;
}

module.exports = commandLoader;