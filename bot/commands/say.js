const Discord = require("discord.js"


module.exports = 
class SayCommand {
    constructor () {
        this.name = "say";
        this.description = "Faça eu falar algo.";
        this.example = "say Olá mundo!"
        this.usage = "say Texto";
        this.aliases = ["falar"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Emma, client, msg, args) {
        var texto = args.join(' ')
        msg.channel.send(":loudspeaker: | "+ texto)
    }
}
