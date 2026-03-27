let io;

function initializeSocket(server, clientUrl) {
  const { Server } = require('socket.io');

  io = new Server(server, {
    cors: {
      origin: clientUrl,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('join:trip', (tripId) => {
      if (tripId) {
        socket.join(`trip:${tripId}`);
      }
    });

    socket.on('leave:trip', (tripId) => {
      if (tripId) {
        socket.leave(`trip:${tripId}`);
      }
    });
  });

  return io;
}

function getSocket() {
  return io;
}

module.exports = {
  initializeSocket,
  getSocket,
};
