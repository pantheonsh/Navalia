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
        this.config = navInst.config;
        this.api_key = navInst.config.nsa_news_api_key;

        this.categories = [
            /* { id: "entertainment", channel: "493844758058369064", endpoint: `https://newsapi.org/v2/top-headlines?category=entertainment&country=br&apiKey=${this.api_key}` }, */
            { id: "brazil", channel: this.config.nsa_news_channel_brazil, endpoint: `https://newsapi.org/v2/top-headlines?country=br&apiKey=${this.api_key}` },
            { id: "business", channel: this.config.nsa_news_channel_business, endpoint: `https://newsapi.org/v2/top-headlines?category=business&country=br&apiKey=${this.api_key}` },
            { id: "technology", channel: this.config.nsa_news_channel_technology, endpoint: `https://newsapi.org/v2/top-headlines?category=technology&country=br&apiKey=${this.api_key}` },
            { id: "science", channel: this.config.nsa_news_channel_science, endpoint: `https://newsapi.org/v2/top-headlines?category=science&country=br&apiKey=${this.api_key}` },
            { id: "health", channel: this.config.nsa_news_channel_health, endpoint: `https://newsapi.org/v2/top-headlines?category=health&country=br&apiKey=${this.api_key}` },
            { id: "sports", channel: this.config.nsa_news_channel_sports, endpoint: `https://newsapi.org/v2/top-headlines?category=sports&country=br&apiKey=${this.api_key}` }
        ]
    }

    /**
     * Retorna as notícias de uma determinada categoria.
     * 
     * @param {String} categoryID 
     */
    fetchNewsForCategory (categoryID) {
        let category = this.categories.find(cat => cat.id === categoryID);
        if(typeof(categoryID) !== "string" || !category) throw new Error("categoryID inválido");

        return new Promise(resolve => {
            fetch(category.endpoint)
                .then(response => response.json())
                .then(obj => resolve(obj.articles))
                .catch(err => { throw err });
        });
    }

    /**
     * Retorna as notícias de todas as categorias.
     */
    async fetchAll () {
        const news = {};

        for (let key in this.categories) {
            let cat = this.categories[key];
            
            news[cat.id] = await this.fetchNewsForCategory(cat.id);
        }

        return news;
    }
    
    /**
     * Checa se uma notícia já foi enviada.
     * 
     * @param {String} categoria Categoria da notícia
     * @param {*} noticia O primeiro objeto da Array retornada em fetchNews()
     */
    wasAlreadySent (categoria, noticia) {
        const ultimaNoticia = this.db.prepare(`SELECT * FROM news WHERE category = ? LIMIT 1`).get(categoria) || { title: "" };
        return ultimaNoticia.title === noticia.title;
    }

    /**
     * Atualiza na DB qual foi a última notícia enviada.
     * 
     * @param {String} categoria Categoria da notícia
     * @param {*} noticia O primeiro objeto da Array retornada em fetchNews()
     */
    updateDB (categoria, noticia) {
        try { this.db.prepare(`DELETE FROM news WHERE category = ?`).run(categoria); } catch (ex) {}
        this.db.prepare(`INSERT INTO news VALUES (?, ?)`).run(categoria, noticia.title);
    }

    /**
     * Envia uma notícia ao canal.
     */
    send (categoria, noticia) {
        if(!this.nav.isProduction()) console.log(`enviando notícia -- categoria ${categoria} título ${noticia.title}`);

        this.updateDB(categoria, noticia);

        let channel_id = this.categories.find(cat => cat.id === categoria).channel;

        if(this.guild.channels.has(channel_id))
            this.guild.channels.get(channel_id).send(`${noticia.title}\n${noticia.url}`);

        return true;
    }

    /**
     * Executado pelo NavEventLoop.
     */
    async main () {
        let news = await this.fetchAll();

        for (let categoria in news) {
            let newsCategoria = news[categoria];

            if(!this.wasAlreadySent(categoria, newsCategoria[0])) this.send(categoria, newsCategoria[0]);
        }
    }
}

module.exports = NSA_News;