const Discord = require("discord.js");

module.exports = 
class PingCommand {
    constructor () {
        this.name = "ping";
        this.description = "Verifica se eu estou online!";
        this.example = "ping"
        this.usage = "ping";
        this.aliases = ["r_u_alive"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Emma, client, msg, args) {
        const time1 = Date.now();
        const m = await msg.reply("<:holdit:470632153529450507>!");
        const time2 = Date.now();

        const embed = new Discord.RichEmbed();
        embed.setColor(0x36393F);
        embed.addField(`⏰ Ping daqui: ${time2 - time1}ms`, `Gateway: ${Math.floor(client.ping)}ms`);
        m.edit(embed);
    }
}