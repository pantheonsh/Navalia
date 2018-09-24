const NavaliaClass = require("../index.js").Navalia;
const fetch = require("node-fetch");

class NSA_News {
    /**
     * Controla o sistema de notícias
     * 
     * @param {NavaliaClass} navInst Instância da Navalia
     */
    constructor (navInst) {
        this.nav = navInst;
        this.db = navInst.db;
        this.guild = navInst.client.guilds.get(navInst.config.nsa_news_guild);
        this.channel = this.guild.channels.get(navInst.config.nsa_news_channel);
        this.api_key = navInst.config.nsa_news_api_key;
        this.news_source = `https://newsapi.org/v2/top-headlines?country=br&apiKey=${this.api_key}`;
    }

    fetchNews () {
        return new Promise(resolve => {
            fetch(this.news_source)
                .then(response => response.json())
                .then(obj => resolve(obj.articles))
                .catch(err => { throw err });
        });
    }
    
    /**
     * Checa se uma notícia já foi enviada.
     * 
     * @param {*} noticia O primeiro objeto da Array retornada em fetchNews()
     */
    wasAlreadySent (noticia) {
        const ultimaNoticia = this.db.prepare(`SELECT * FROM news LIMIT 1`).get() || { title: "" };
        return ultimaNoticia.title === noticia.title;
    }

    /**
     * Atualiza na DB qual foi a última notícia enviada.
     * @param {*} noticia O primeiro objeto da Array retornada em fetchNews()
     */
    updateDB (noticia) {
        this.db.prepare(`DELETE FROM news`).run();
        this.db.prepare(`INSERT INTO news VALUES (?)`).run(noticia.title);
    }

    /**
     * Envia uma notícia ao canal.
     */
    send (data) {
        if(this.wasAlreadySent(data)) return false;

        if(!this.nav.isProduction()) console.log(`nova notícia: ${data.title}`);

        this.updateDB(data);
        this.channel.send(`${data.title}\n${data.url}`);

        return true;
    }
}

module.exports = NSA_News;