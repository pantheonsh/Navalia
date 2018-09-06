const Navalia = require("..").Navalia;
const Discord = require("discord.js");
const console = require("./navalialogger");

const SEGUNDOS = 1000;

class NavXPSystem {
    /**
     * Sistema de XP
     * @param {Navalia} instance Instância Navalia
     */
    constructor (instance) {
        this.navalia = instance;
        this.DEFAULT_XP = 0;

        this.disableNSFWChannels = true;
        this.cooldownTime = 5*SEGUNDOS;
        this.cooldown = new Map();

        this.navalia.client.on("message", msg => this.onMessage(msg));
    }

    /**
     * Retorna o XP de um usuário.
     * @param {String} id 
     */
    getGlobalXP (id) {
        const s = this.navalia.db.prepare("SELECT * FROM usuarios WHERE id = ? LIMIT 1");

        try {
            return s.get(id).xp || 0;
        } catch (ex) {
            console.error(`Erro ao ler o XP do usuário ${id}. Ele está no banco de dados?`, ex.stack);
            return 0;
        }
    }

    /**
     * Retorna o XP de um usuário em um determinado servidor.
     * @param {String} guild_id 
     * @param {String} user_id 
     */
    getXPInGuild (guild_id, user_id) {
        const s = this.navalia.db.prepare("SELECT * FROM guild_xp WHERE guild_id = ? AND user_id = ? LIMIT 1");

        try {
            return s.get(guild_id, user_id).xp || 0;
        } catch (ex) {
            // Não falou nada na guild ainda.
            return 0;
        }
    }
    
    /**
     * Seta o XP de um usuário.
     * @param {String} id 
     * @param {Number} xp 
     */
    setGlobalXP (id, xp) {
        const defaultValues = this.navalia.db.prepare(`INSERT OR IGNORE INTO usuarios (id, xp) VALUES (?, ?);`);
        const newValues = this.navalia.db.prepare(`UPDATE usuarios SET xp = ? WHERE id = ?`);

        try {
            defaultValues.run(id, this.DEFAULT_XP);
            return newValues.run(xp, id);
        } catch(ex) {
            console.error(`Erro ao alterar XP do usuário ${id} para ${xp}. Stack:`, ex.stack);
            return false;
        }
    }

    /**
     * Seta o XP de um usuário em uma guild.
     * @param {String} guild_id 
     * @param {String} user_id
     * @param {Number} xp 
     */
    setXPInGuild (guild_id, user_id, xp) {
        const defaultValues = this.navalia.db.prepare(`INSERT OR IGNORE INTO guild_xp (guild_id, user_id, xp) VALUES (?, ?, ?);`);
        const newValues = this.navalia.db.prepare(`UPDATE guild_xp SET xp = ? WHERE guild_id = ? AND user_id = ?`);

        try {
            defaultValues.run(guild_id, user_id, this.DEFAULT_XP);
            return newValues.run(xp, guild_id, user_id);
        } catch(ex) {
            console.error(`Erro ao alterar XP do usuário ${id} para ${xp} na guild ${guild_id}. Stack:`, ex.stack);
            return false;
        }
    }

    /**
     * Usa o total de XP para calcular o nível do usuário.
     * Ex: > 9 XP é nível 1, > 81 é nível 2
     * @param {Number} xp 
     */
    parseLvl (xp) {
        return Math.floor(xp / 1000) + 1;
    }

    onMessage (msg) {
        const user = msg.author.id;
        if(msg.system || msg.author.bot) return false;

        if(this.cooldown.has(user)) {
            let timeDiff = Date.now() - this.cooldown.get(user);

            if(timeDiff < this.cooldownTime) return false;
        }

        this.cooldown.set(user, Date.now());

        const oldXP = this.getGlobalXP(user);
        const newXP = oldXP + 1;
        this.setGlobalXP(user, newXP);

        if(msg.guild) {
            const guild = msg.guild.id;
            const oldXP = this.getXPInGuild(guild, user);
            const newXP = oldXP + 1;
            this.setXPInGuild(guild, user, newXP);
        }
    }
}

module.exports = NavXPSystem;