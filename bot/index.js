require("./includes/polyfills");

const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const colors = require("chalk").default;
const NavDB = require("./db");
const NavXPSystem = require("./includes/xp");
const NavaliaEventLoop = require("./includes/eventloop");

// Configurar variáveis de ambiente
try { require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); } catch (ex) { }

// Módulo de logging de Navalia.
const console = require("./includes/navalialogger");

class Navalia {
    /**
     * Inicializa uma instância de Navalia.
     * @param {Object} config Configurações dessa instância
     * @param {Object} clientData Opções para passar ao cliente Discord.js
     */
    constructor (config, clientData) {
        this.config = config;
        this.startedAt = Date.now();

        if(this.config.OWNERS) this.config.OWNERS = this.config.OWNERS.split(",");

        this.client = new Discord.Client(clientData);
        this.emojis = clientData.emojis;
        this.db = new NavDB(path.join("..", config.SQLITE_FILENAME || "db.sqlite"));

        // eventos
        this.client.on("ready", () => this.onReady());
        this.client.on("message", m => this.onMessage(m));
        this.client.on("error", err => this.handleWebSocketError(err));

        // manter referência à instância da instância através do cliente
        this.client.Navalia = this;

        // carregar os comandos
        this.commands = require("./includes/commandLoader")(path.join(__dirname, "commands/"));
        
        this.modules = {};
        this.modules.xp = new NavXPSystem(this);

        this.client.login(config.DISCORD_TOKEN).then(() => 
            this.postLogin());

        this.client.on("message", async msg => {
            try {
                if(msg.channel.id === "359313557667577857") {
                    if(msg.content.startsWith(".")) {
                        let n = (parseInt(msg.content.charAt(1)) || 2);
                        if(n < 1) n = 2;
                        if(n > 9) n = 9;
                        const emojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"].slice(0, n);
                        for(const emoji of emojis) {
                            await msg.react(emoji);
                        }
                    } else {
                        await msg.react("👍");
                        await msg.react("👎");
                    }
                }
            } catch(ex) {}
        });
    }

    /**
     * Executado após o primeiro login.
     */
    postLogin () {
        this.setStatusText(`-ajuda`, true);
    }

    /**
     * Quando o evento "ready" do Discord.js é executado
     */
    onReady () {
        console.log("✔️  Login feito!");

        this.eventLoop = new NavaliaEventLoop(this, 10);
    }

    /**
     * Quando uma mensagem é recebida.
     * @param {Discord.Message} msg 
     */
    onMessage (msg) {
        // só queremos lidar com mensagens que são enviadas por um humano
        if(msg.system || msg.author.bot) return;
        if(!this.isProduction()) console.log(`💬  ${msg.author.tag} ${colors.gray(msg.cleanContent)}`);

        if(!msg.content.startsWith(this.config.prefix)) return;

        const args = msg.content.split(" ");
        const cmd = args.shift().replace(this.config.prefix, "");

        if(!this.isProduction()) console.debug(`${colors.green(cmd)} ${colors.bgBlack.white(args.join(" "))}`);

        this.handleCommand(msg, cmd, args);
    }

    /**
     * Açúcar para a sintaxe de alterar os status.
     * @param {String} message 
     * @param {Boolean} purple Deixar roxo?
     */
    async setStatusText (message, purple) {
        return await 
            this.client.user.setPresence({ 
                game: { 
                    name: message, 
                    url: purple ? "https://www.twitch.tv/funkyblackcat" : null 
                } 
            });
    }

    /**
     * Executa os comandos.
     * @param {Discord.Message} msg 
     * @param {String} commandName 
     * @param {Array} args 
     */
    handleCommand (msg, commandName, args) {
        if(!this.commands.has(commandName)) return;

        const cmd = this.commands.get(commandName);
        const errorEmbed = new Discord.RichEmbed();
        errorEmbed.setColor(0x36393F);

        /* Verificar permissões */
        if(cmd.user_must_be_owner && !this.config.OWNERS.includes(msg.author.id)) {
            /* Usuário não é dono do bot */
            errorEmbed.setDescription(`
            ***⛔ Umm, não.***\n\n
            Você não tem as permissões necessárias para executar esse comando. O comando é restrito. Desculpe!`);
            return msg.reply({ embed: errorEmbed });
        } else if(cmd.guild_only && !msg.guild) {
            /* Não está em uma guild */
            errorEmbed.setDescription(`
            ***⛔ Aqui não!***\n\n
            O comando foi feito para ser executado específicamente em um servidor. Desculpe!`);
            return msg.reply({ embed: errorEmbed });
        } else if(msg.guild && !msg.guild.available) {
            /* Guild não disponível, ignorar */
            return;
        } else if(msg.guild && !msg.member.hasPermission(cmd.user_permissions)) {
            /* Usuário não tem as permissões necessárias */
            const missingPermissions = cmd.user_permissions.filter(perm => !msg.member.hasPermission(perm));

            errorEmbed.setDescription(`
            ***⛔ Você vai precisar de mais do que isso***\n\n
            Você não tem todas as permissões (${missingPermissions.join(", ")}) necessárias para executar o comando.`);
            return msg.reply({ embed: errorEmbed });
        } else if(msg.guild && !msg.guild.me.hasPermission(cmd.bot_permissions)) {
            /* Bot não tem as permissões necessárias */
            const missingPermissions = cmd.bot_permissions.filter(perm => !msg.guild.me.hasPermission(perm));

            errorEmbed.setDescription(`
            ***⛔ Falta permissões***\n\n
            Eu não tenho todas as permissões (${missingPermissions.join(", ")}) essenciais para executar o comando.`);
            return msg.reply({ embed: errorEmbed });
        }

        // Executar o comando e ficar atento a possíveis erros
        cmd.exec(this, this.client, msg, args)
            .catch(error => {
                console.error(
                    `Oof, erro no comando ${cmd.name} (params <${args.join(", ") || "<nada>"}>) user ${msg.author.id} canal `+
                    `${msg.channel.name}. Objeto:\n`,
                    error
                );

                errorEmbed.setDescription(`💔 *Oof!*\n\nAlguma coisa interrompeu a execução do comando. O incidente foi gravado e, se for um bug, será corrigido. Desculpe!`);
                msg.reply({ embed: errorEmbed });
            });
    }

    isProduction () {
        return process.env.NODE_ENV === "production";
    }

    /**
     * Lida com possíveis erros na conexão.
     * @param {Error} error 
     */
    handleWebSocketError (error) {
        console.error(`----------------------------------------------------`);
        console.error(colors.red("Oof, erro na conexão! Mais informações:"));
        console.error(`> Nome: ${colors.yellow(error.name)}`);
        console.error(`> Stack: ${error.stack}`);
        console.error(`----------------------------------------------------`);
    }
}

const clientData = require("./data.json");
const navInst = new Navalia(process.env, clientData);

module.exports = { Navalia }