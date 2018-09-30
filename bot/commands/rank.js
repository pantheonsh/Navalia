const Discord = require("discord.js");
const NodeCanvas = require("canvas");
const ImageUtils = require("../includes/imageUtils");
const path = require("path");

NodeCanvas.registerFont(path.join(__dirname, "../assets/fonts/Topic.ttf"), { "family": "ProfileFont" });

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
        this.image = new NodeCanvas.Image();
        this.image.src = path.resolve(__dirname, "../assets/images/rank_user_base.png");
        this.top_image = new NodeCanvas.Image();
        this.top_image.src = path.resolve(__dirname, "../assets/images/rank_top.png");
        this.canvas = NodeCanvas.createCanvas(this.image.width * 2, (this.image.height * 10 / 2) + this.top_image.height);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "20px 'ProfileFont'";
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
            userlist.push({ name: user.username.replace(/[^\x00-\x7F]/g, " "), discrim: user.discriminator, image, xp: userxp });
        }

        ctx.drawImage(this.top_image, 0, 0);

        for (let i = 0; i < userlist.length; i++) {
            let basex = i > 4 ? (this.canvas.width / 2) : 0;
            let basey = (i % 5);
            let toph = this.top_image.height;

            let user = userlist[i];

            ctx.fillStyle = "rgba(0, 0, 0, 1)";

            ctx.drawImage(user.image, basex + 1, this.image.height * basey + 8 + toph, 54, 54);
            ctx.drawImage(this.image, basex, this.image.height * basey + toph);

            // se i for ímpar, deixar um pouco mais escuro o fundo
            if(i % 2) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
                ctx.fillRect(basex, this.image.height * basey + toph, canvas.width, (this.image.height * basey) + this.image.height + toph);    
            }

            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            this.ctx.font = "27px 'ProfileFont'";
            ctx.fillText(user.name, basex + 80, this.image.height * basey + 30 + toph);
            let uwidth = ctx.measureText(user.name);

            // discriminator
            ctx.fillStyle = "rgba(200, 200, 200, 1)";
            this.ctx.font = "19px 'ProfileFont'";
            ctx.fillText(`#${user.discrim}`, basex + 80 + uwidth.width, this.image.height * basey + 30 + toph);

            this.ctx.font = "24px 'ProfileFont'";
            ctx.fillStyle = "rgba(160, 160, 160, 1)";
            ctx.fillText(`#${(i + 1).toString().padStart(2, "0")} XP TOTAL: ${user.xp}`, basex + 80, this.image.height * basey + 60 + toph);
        }

        this.canvas.toBuffer((err, buff) => {
            msg.channel.send("", { files: [{ attachment: buff, name: "rank.png" }] });
        });
    }
}