const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");

// Colocar as variáveis encontradas no arquivo ../.env no objeto process.env
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// Módulo de logging da Emma. Substitui o global console
require("./libs/emmalogger");
// opções do cliente
const clientOptions = require("./clientOptions.json");

const Emma = new Discord.Client(clientOptions || {});

fs.readdir("./eventos/", (err, filenames) => {
    filenames.forEach(filename => {
        const event = require(path.resolve("./eventos/", filename));
        
        if(event.once) {
            Emma.once(event.id, (...params) => event.callback(Emma, ...params));
        } else {
            Emma.on(event.id, (...params) => event.callback(Emma, ...params));
        }
    });
});

Emma.login(process.env.DISCORD_TOKEN);