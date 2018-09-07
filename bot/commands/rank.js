const Discord = require("discord.js");
const NodeCanvas = require("canvas");
const ImageUtils = require("../includes/imageUtils");

NodeCanvas.registerFont("./assets/fonts/Topic.ttf", { "family": "ProfileFont" });

module.exports = 
class RankCommand {
    constructor () {
        this.name = "rank";
        this.description = "Mostra os usuários com mais XP!";
        this.example = "rank"
        this.usage = "rank";
        this.aliases = [];
        this.user_must_be_owner = false; // somente os administradores do bot podem usar?
        this.guild_only = false; // só pode ser executado em uma guild?
        this.bot_permissions = []; // permissões que o bot precisa ter
        this.user_permissions = []; // permissões que o usuário precisa ter

        // inicialização do Canvas
        this.canvas = NodeCanvas.createCanvas(275, 480);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "20px 'ProfileFont'";
        this.image = new NodeCanvas.Image();
        this.image.src = "./assets/images/rank_user_base.png";
    }

    async exec (Navalia, client, msg, args) {
        const ctx = this.ctx;
        const canvas = this.canvas;

        const usersOnDB = Navalia.db.prepare("SELECT * FROM usuarios ORDER BY xp DESC LIMIT 10").all();
        const userlist = [];

        for(let i = 0; i < usersOnDB.length; i++) {
            let userdb = usersOnDB[i];
            console.log(userdb.id);
            let userid = userdb.id.toString();
            let userxp = userdb.xp;
            let user = await client.fetchUser(userid);
            let image = await ImageUtils.createImageFromURL(user.displayAvatarURL);
            userlist.push({ name: user.tag, image, xp: userxp });
        }

        for (let i = 0; i < userlist.length; i++) {
            let user = userlist[i];

            ctx.fillStyle = "rgba(255, 255, 255, 1)";

            ctx.drawImage(user.image, 1, this.image.height * i + 1, 46, 46);
            ctx.drawImage(this.image, 0, this.image.height * i);

            // se i for ímpar, deixar um pouco mais escuro o fundo
            if(i % 2) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                ctx.fillRect(0, this.image.height * i, canvas.width, (this.image.height * i) + this.image.height);    
            }

            ctx.fillStyle = "rgba(70, 70, 70, 1)";
            this.ctx.font = "20px 'ProfileFont'";
            ctx.fillText(user.name, 60, this.image.height * i + 25);
            this.ctx.font = "15px 'ProfileFont'";
            ctx.fillText(`XP TOTAL: ${user.xp}`, 60, this.image.height * i + 40);
        }

        this.canvas.toBuffer((err, buff) => {
            msg.channel.send("", { files: [{ attachment: buff, name: "rank.png" }] });
        });
    }
}