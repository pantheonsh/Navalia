const events = require("events");

class EventLoop extends events.EventEmitter {
    /**
     * @param {Number} interval Em segundos, frequência para executar todas as tarefas.
     */
    constructor (Navalia, interval) {
        super();

        this.frequency = interval * 1000;
        this.Navalia = Navalia;
        this.interval = setInterval(() => this.processTasks(), this.frequency);
    }

    processTasks () {

    }
}

module.exports = EventLoop;