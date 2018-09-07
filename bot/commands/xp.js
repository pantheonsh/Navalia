const Discord = require("discord.js");
const NodeCanvas = require("canvas");
const ImageUtils = require("../includes/imageUtils");

NodeCanvas.registerFont("./assets/fonts/Topic.ttf", { "family": "ProfileFont" });

module.exports = 
class ProfileCommand {
    constructor () {
        this.name = "profile";
        this.description = "Mostra o perfil de alguém ou de um usuário";
        this.example = "profile @NaN#2404"
        this.usage = "profile [@menção]";
        this.aliases = ["xp", "perfil"];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter

        // inicialização do Canvas
        this.canvas = NodeCanvas.createCanvas(250, 300);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "20px 'ProfileFont'";
        this.image = new NodeCanvas.Image();
        this.image.src = "./assets/images/profile_bg.png";
    }

    async exec (Navalia, client, msg, args) {
        const ctx = this.ctx;
        const xpSystem = Navalia.modules.xp;

        const user = msg.mentions.users.first() || msg.author;
        let xpGlobal = xpSystem.getGlobalXP(user.id) || 0;
        let lvlGlobal = xpSystem.parseLvl(xpGlobal);
        let xpLocal = xpGlobal;

        if(msg.guild) xpLocal = xpSystem.getXPInGuild(msg.guild.id, user.id);

        const avatarBuffer = await ImageUtils.getImageFromURL(user.displayAvatarURL);
        const avatar = await ImageUtils.BufferToCanvasImage(avatarBuffer);

        // Limpar canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(avatar, 33, 7, 176, 176);
        ctx.drawImage(this.image, 0, 0);

        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(76, 76, 76);";

        ctx.font = "24px 'ProfileFont'";
        ctx.fillText("XP AQUI", 55, 210);

        ctx.font = "34px 'ProfileFont'";
        ctx.fillText(xpGlobal, 55, 237);

        ctx.font = "24px 'ProfileFont'";
        ctx.fillText("XP GLOBAL", 55, 265);

        ctx.font = "34px 'ProfileFont'";
        ctx.fillText(xpGlobal, 55, 293);



        ctx.font = "34px 'ProfileFont'";
        ctx.fillText("NÍVEL", 180, 230);
        ctx.font = "48px 'ProfileFont'";
        ctx.fillText(lvlGlobal, 180, 270);   

        this.canvas.toBuffer((err, buff) => {
            msg.channel.send(`Perfil de ${user}:`, { files: [{ attachment: buff, name: "perfil.png" }] });
        });
    }
}