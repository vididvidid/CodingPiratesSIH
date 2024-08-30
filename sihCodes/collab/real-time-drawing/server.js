const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Y = require('yjs');
const path = require('path');  // Import path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Create a Yjs document
const doc = new Y.Doc();
const yMap = doc.getMap('drawing');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Sync the Yjs document with the client
  const awareness = new Y.Awareness(doc);
  const yDoc = new Y.Doc();

  // Listen for updates from clients
  socket.on('update', (update) => {
    Y.applyUpdate(doc, update);
  });

  // Send updates to all clients
  doc.on('update', (update) => {
    io.emit('update', update);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3030, () => {
  console.log('Server is running on http://localhost:3030');
});
