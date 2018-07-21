const Discord = require("discord.js");

const id = "message";
// se for true, é usado <client>.on, senão é usado <client>.once
const once = false;

/**
 * Executado quando o evento acontece.
 * @param {Discord.Client} Emma 
 * @param {Discord.Message} msg
 */
const callback = (Emma, msg) => {
    if(msg.author.bot || msg.system) return;
    
    console.debug(`Mensagem recebida -- de ${msg.author.tag}: ${msg.cleanContent}`);
}

module.exports = { id, once, callback }