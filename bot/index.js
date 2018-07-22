const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const colors = require("chalk").default;

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Módulo de logging da Emma. Substitui o global console
global.console = new (require("./libs/emmalogger"))();


const clientOptions = require("./clientOptions.json");

const Emma = new Discord.Client(clientOptions);

Emma.on("ready", () => {
    console.log("✔️  Login feito!");
});

Emma.on("message", msg => {
    console.debug(colors.white(msg.author.tag), colors.gray(msg.cleanContent));
});

Emma.login(process.env.DISCORD_TOKEN);