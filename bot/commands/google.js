const GoogleSearch = require("google-searcher");
const errors = require("../includes/errors");

module.exports = 
class GoogleCommand {
    constructor () {
        this.name = "google";
        this.description = "Faz uma pesquisa no Google";
        this.example = "google 4shared"
        this.usage = "google <pesquisa>";
        this.aliases = ["g"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        const query = args.join(" ").substring(0, 128);
        
        new GoogleSearch()
        .lang("pt")
        .host("www.google.com.br")
        .query(query)
        .exec()
            .then(results => {
                let r = results[0];
                if(r) {
                    msg.reply(r);
                } else {
                    msg.reply("Nada encontrado!")
                }
            })
            .catch(err => {
                throw err;
            });
    }
}