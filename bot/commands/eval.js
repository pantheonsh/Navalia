const Discord = require("discord.js");

module.exports = 
class EvalCommand {
    constructor () {
        this.name = "eval";
        this.description = "Executa JS arbitrário.";
        this.example = "eval console.log('eae men');"
        this.usage = "eval código";
        this.aliases = ["js"];
        this.user_must_be_owner = true; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        const code = args.join(" ");

        let result;
        const d1 = Date.now();
        try {
            result = eval(code);
        } catch (ex) {
            result = ex;
        }

        result = await Promise.resolve(result);
        const d2 = Date.now();

        const embed = new Discord.RichEmbed();
        embed.setColor(0x36393F);
        embed.setTitle("Resultados");
        embed.setDescription("```" + result + "```");
        embed.setFooter(`Tempo de execução: ${d2 - d1}ms`);
        msg.reply({ embed });
    }
}