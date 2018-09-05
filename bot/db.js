const SQLite = require("better-sqlite3");

class NavDB extends SQLite {
    /**
     * Inicializa uma nova instância do banco de dados.
     * @param {String} filename 
     * @param {SQLite.DatabaseOptions}
     */
    constructor(filename, options) {
        super(filename, options);

        // Inicialização
        this.prepare(`CREATE TABLE IF NOT EXISTS "usuarios" (
            "id"	TEXT NOT NULL PRIMARY KEY UNIQUE,
            "xp"	INTEGER
        );`).run();

        this.prepare(`CREATE TABLE IF NOT EXISTS "guild_xp" (
            "guild_id"	TEXT NOT NULL,
            "user_id"   TEXT NOT NULL,
            "xp"	    INTEGER,
            UNIQUE (guild_id, user_id)
        );`).run();
    }
}

module.exports = NavDB;