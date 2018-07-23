const mongoose = require("mongoose");
const console = require("./includes/emmalogger");

class DB {
    constructor (Emma) {
        console.log(Emma.config.MONGODB_URL)
        mongoose.connect(Emma.config.MONGODB_URL)
            .then(() => this.onConnect())
            .catch(err => this.onConnectionError(err));

        this.mongoose = mongoose;

        this.userSchema = 
            new mongoose.Schema({ 
                _id: String, // -> ID no Discord
                afk: {
                    isAfk: { type: Boolean, default: false },
                    reason: { type: String, default: "Nenhum" },
                    since: { type: Number, default: Date.now }
                }
            }, { collection: "users" });
    }

    /**
     * Retorna um modelo a partir de um schema.
     * @param {String} name 
     * @param {mongoose.Schema} schema 
     */
    getModel (name, schema) {
        return mongoose.model(name, schema);
    }

    onConnect () {
        console.log("✔️  Conexão ao banco de dados realizada!");
    }

    onConnectionError (err) {
        console.error("❌  Houve um erro na conexão com o banco de dados. Oof");
        console.error(err);
    }
}

module.exports = DB;