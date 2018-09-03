const Discord = require("discord.js");
const moment = require("moment");
const UtilFuncs = require("../includes/funcs");

moment.locale("pt-br");

module.exports = 
class SayCommand {
    constructor () {
        this.name = "say";
        this.description = "Repete algo. Variáveis: $NOW";
        this.example = "say Olá mundo!"
        this.usage = "say Texto";
        this.aliases = ["falar"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        let texto = args.join(" ");

        texto = UtilFuncs.bulkReplaceAll(texto, { "$NOW": moment().format("HH:mm:ss") });
        texto = UtilFuncs.preventMentions(texto);

        msg.channel.send(`<@${msg.author.id}> ${texto}`);

        if(msg.deletable)
            msg.delete();
    }
}
