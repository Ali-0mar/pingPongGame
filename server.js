const https = require('https');
const fs = require("fs");
const io = require('socket.io');

const options = {
	key: fs.readFileSync("key.pem"),
	cert: fs.readFileSync("cert.pem")
};
const apiServer = require('./api');
const httpServer = https.createServer(options, apiServer);
const socketServer = io(httpServer);

const sockets = require('./sockets');

const PORT = 3000;
httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);

sockets.listen(socketServer);
;