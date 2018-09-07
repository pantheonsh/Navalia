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
        this.canvas = NodeCanvas.createCanvas(275 * 2, 480 / 2);
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

            let userid = userdb.id.toString();
            let userxp = userdb.xp;
            let user = await client.fetchUser(userid);
            let image = await ImageUtils.createImageFromURL(user.displayAvatarURL);
            // o nome mostrado é o nome sem caracteres não-ASCII
            userlist.push({ name: user.tag.replace(/[^\x00-\x7F]/g, " "), image, xp: userxp });
        }

        for (let i = 0; i < userlist.length; i++) {
            let basex = i > 4 ? (this.canvas.width / 2) : 0;
            let basey = i % 5;

            let user = userlist[i];

            ctx.fillStyle = "rgba(255, 255, 255, 1)";

            ctx.drawImage(user.image, basex + 1, this.image.height * basey + 1, 46, 46);
            ctx.drawImage(this.image, basex, this.image.height * basey);

            // se i for ímpar, deixar um pouco mais escuro o fundo
            if(i % 2) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
                ctx.fillRect(basex, this.image.height * basey, canvas.width, (this.image.height * basey) + this.image.height);    
            }

            ctx.fillStyle = "rgba(30, 30, 30, 1)";
            this.ctx.font = "20px 'ProfileFont'";
            ctx.fillText(user.name, basex + 60, this.image.height * basey + 25);
            this.ctx.font = "15px 'ProfileFont'";
            ctx.fillStyle = "rgba(70, 70, 70, 1)";
            ctx.fillText(`#${(i + 1).toString().padStart(2, "0")} XP TOTAL: ${user.xp}`, basex + 60, this.image.height * basey + 40);
        }

        this.canvas.toBuffer((err, buff) => {
            msg.channel.send("", { files: [{ attachment: buff, name: "rank.png" }] });
        });
    }
}