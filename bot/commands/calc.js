const Discord = require("discord.js");
const math = require("mathjs");

module.exports = 
class CalcCommand {
    constructor () {
        this.name = "calc";
        this.description = "Faz a tarefa de matemática para você";
        this.example = "calc 1 + 1"
        this.usage = "calc < expressão >";
        this.aliases = ["calculadora"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        const expressao = args.join(" ");

        let resultado = 0;

        try {
            resultado = math.format(math.eval(expressao), {notation: "fixed"});
        } catch (ex) {
            resultado = ex.message;
        }

        const embed = new Discord.RichEmbed();
        embed.setColor(0x36393F);
        embed.addField(`📥 Expressão`, `\`\`\`${expressao}\`\`\``, true);
        embed.addField(`📤 Resultado`, `\`\`\`js\n${resultado}\`\`\``, true);
        msg.reply({ embed });
    }
}