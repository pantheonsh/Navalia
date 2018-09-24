const events = require("events");

const nsaNews = require("./nsa_news.js");

class EventLoop extends events.EventEmitter {
    /**
     * @param {Number} interval Em segundos, frequência para executar todas as tarefas.
     */
    constructor (Navalia, interval) {
        super();

        this.frequency = interval * 1000;
        this.Navalia = Navalia;
        this.interval = setInterval(() => this.processTasks(), this.frequency);
    
        this.news_task = new nsaNews(Navalia);
    }

    async processTasks () {
        await this.news_task.main();
    }
}

module.exports = EventLoop;