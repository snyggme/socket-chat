const server = require('http').createServer();
const io = module.exports.io = require('socket.io')(server);

const PORT = process.env.PORT || 3001;

const socketManager = require('./socketManager');

io.on('connection', socketManager)

server.listen(PORT, function (err) {
  if (err) throw err
  console.log(`listening on port ${3001}`)
})