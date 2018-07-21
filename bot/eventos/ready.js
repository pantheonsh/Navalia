const Discord = require("discord.js");

const id = "ready";
// se for true, é usado <client>.on, senão é usado <client>.once
const once = false;

/**
 * Executado quando o evento acontece.
 * @param {Discord.Client} Emma 
 */
const callback = (Emma) => {
    console.log("Login feito <3");
}

module.exports = { id, once, callback }