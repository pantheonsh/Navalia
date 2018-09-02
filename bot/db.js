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
            "id"	INTEGER NOT NULL PRIMARY KEY UNIQUE,
            "xp"	INTEGER
        );`).run();
    }
}

module.exports = NavDB;