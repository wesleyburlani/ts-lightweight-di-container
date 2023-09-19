const io = require("socket.io-client");

const socket = io("ws://localhost:3000", {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123"
  },
  path: '/sockets'
});

socket.on('connected', () => console.log('conectado'));
socket.on('health', () => console.log('health'));