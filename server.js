const server = require('http').createServer();
const io = require('socket.io')(server);

const PORT = 3000;

server.listen(PORT);
console.log(`Listening on port ${PORT}...`);
let playeresCount = 0;
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on("disconnect", (reason) => {
    console.log(`Player ${socket.id} disconnected, ${reason}`);
  });

  socket.on("ready", () => {
    console.log(`Player ${socket.id} is ready`);
    playeresCount++;

    if(playeresCount === 2) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("paddleMove", (cordinates) => {
    socket.broadcast.emit("paddleMove", cordinates);
  });

  socket.on("ballMove", (data) => {
    socket.broadcast.emit("ballMove", data);
  });
});

