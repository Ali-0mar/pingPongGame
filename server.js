const http = require('http');
const fs = require("fs");
const path = require("path");
const io = require('socket.io');

//const options = {
//	key: fs.readFileSync(path.join(__dirname, "public", "key.pem")),
//	cert: fs.readFileSync(path.join(__dirname, "public", "cert.pem"))
//};
const apiServer = require('./api');
const httpServer = http.createServer(apiServer);
const socketServer = io(httpServer);

const sockets = require('./public/sockets');

const PORT = 3000;
httpServer.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
	sockets.listen(socketServer);
});
