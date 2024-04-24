const { Server } = require("socket.io");
const cors = require("cors");

// Export a function to create and configure the Socket.io server
module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",  // Allowing all origins for CORS (adjust in production)
    },
  });

  let currentTrackIndex = 0; // Keeps track of the current song index

  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    // Send the current track index to newly connected users
    socket.emit('track', currentTrackIndex);
    console.log("track:",currentTrackIndex)

    // Listen for 'changeTrack' events from clients
    socket.on('changeTrack', (index) => {
      currentTrackIndex = index; // Update the current track index
      io.emit('track', currentTrackIndex); // Broadcast the new track index to all clients
    });

      // Listen for 'PAUSE / PLAY' events from clients
      socket.on('play', () => {
       
        io.emit('play'); // Broadcast the new track index to all clients
      });

       // Listen for 'PAUSE / PLAY' events from clients
       socket.on('pause', () => {
       
        io.emit('pause'); // Broadcast the new track index to all clients
      });
  });
};
