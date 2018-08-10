const Discord = require("discord.js");

module.exports = 
class PingCommand {
    constructor () {
        this.name = "github";
        this.description = "Um link para ver meu código e contribuir.";
        this.example = "github"
        this.usage = "github";
        this.aliases = ["sourcecode"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        m.edit(`https://github.com/pantheonsh/Navalia`);
    }
}