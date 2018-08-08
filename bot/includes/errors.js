const Discord = require("discord.js");

class CommandError extends Error {
    /**
     * Quando um comando dá erro.
     * @param {String} reason Motivo do erro ocorrer.
     * @param {*} command Num comando, isto será `this`.
     * @param {Discord.Message} discordMessage 
     */
    constructor (reason, command, discordMessage) {
        super(
            `No comando ${command.name}, executado por ${discordMessage.author.tag} ${discordMessage.author.id} `+
            `em um canal do tipo ${discordMessage.channel.type} com os argumentos [${discordMessage.content.split(" ").slice(1).join(",")}]:`+
            `Oof!\n${reason}`
        );
    }
}

module.exports = { CommandError }