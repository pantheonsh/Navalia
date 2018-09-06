const Discord = require("discord.js");
const Table = require("table");

module.exports = 
class SQLEvalCommand {
    constructor () {
        this.name = "sqleval";
        this.description = "Executa código SQL diretamente no banco de dados. Restrito!";
        this.example = "sqleval SELECT * FROM tabela"
        this.usage = "sqleval <sqlstring>";
        this.aliases = ["sql"];
        this.user_must_be_owner = true; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter
    }

    async exec (Navalia, client, msg, args) {
        const sql = args.join(" ") || "SELECT * FROM guild_xp";
        const stmt = Navalia.db.prepare(sql);
        const rows = stmt.all();
        let s = "<nada>";

        if(rows) {
            const columns = Object.keys(rows[0]);
            const values = [];

            rows.forEach((row, i) => {
                let v = Object.values(row);
                values.push(v);
            });
            console.log(columns, values);

            s = Table.table([ columns, ...values ])
        }

        msg.reply(`\`\`\`\n${s}\`\`\``);
    }
}