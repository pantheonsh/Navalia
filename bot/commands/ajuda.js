const Discord = require("discord.js");

module.exports = 
class PingCommand {
    constructor () {
        this.name = "ajuda";
        this.description = "Mostra todos os meus comandos.";
        this.example = "ajuda"
        this.usage = "ajuda";
        this.aliases = ["comandos"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        let str = "";

        Navalia.commands.forEach(command => {
            str += `\`${command.name}\``;
        });

        const embed = new Discord.RichEmbed();
        embed.setColor(0x36393F);
        embed.setDescription(str);
        m.edit({ embed });
    }
}