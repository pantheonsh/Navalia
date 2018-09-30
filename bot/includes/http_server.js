/* Usado para manter o bot ligado em alguns serviços.

const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("200 OK");
});

server.listen(process.env.PORT || 3000);*/