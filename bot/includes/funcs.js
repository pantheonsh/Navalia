class UtilFuncs {
    /**
     * Previne menções adicionando um caractere invisível após o @
     * @param {String} str
     */
    preventMentions (str) {
        if (typeof(str) === "string")
            return str.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return str;
    }

    /**
     * @param {String} str 
     */
    escapeRegExp (str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /**
     * Substitui todas as ocorrências de uma substring em uma string.
     * @param {String} str 
     * @param {String} search 
     * @param {String} replace 
     */
    replaceAll (str = "", search = "", replace = "") {
        return str.replace(new RegExp(this.escapeRegExp(search), "g"), replace);
    }

    /**
     * Substitui todas ocorrências de várias substrings.
     * @param {String} str 
     * @param {Object} replaceItems As chaves são o que procurar, e os valores são o que substituir.
     */
    bulkReplaceAll (str = "", replaceItems) {
        const search = Object.keys(replaceItems);

        search.forEach(s => {
            console.log(str, s, replaceItems[s]);
            str = this.replaceAll(str, s, replaceItems[s]);
            console.log(str);
        });

        return str;
    }
}

module.exports = new UtilFuncs();