const fetch = require("node-fetch");
const canvas = require("canvas");

class ImageUtils {
    createImageFromURL (url) {
        return new Promise(async (res) => {
            let bufferimg = await this.getImageFromURL(url);
            let image = await this.BufferToCanvasImage(bufferimg);
            res(image);
        });
    }
    
    /**
     * Baixa uma imagem de uma URL.
     * @param {String} url 
     */
    getImageFromURL (url) {
        if(!url) throw new Error("URL não especificada.");
        return new Promise((res, rej) => {
            fetch(url)
            .then(r => r.buffer())
            .then(buf => res(buf))
            .catch(err => rej(err));
        });
    }

    /**
     * Converte um Buffer para uma imagem do Node-Canvas.
     * @param {Buffer} buff 
     */
    BufferToCanvasImage (buff) {
        return new Promise((res, rej) => {
            const im = new canvas.Image();
 
            im.onload = () => res(im);
            im.onerror = err => rej(err);

            im.src = buff;
        });
    }
}

module.exports = new ImageUtils();