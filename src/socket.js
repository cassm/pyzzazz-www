const {Server} = require('socket.io');
const redis = require('./db/redis');
const winston = require('./utils/logger/winston');
const {clear} = require("winston");

const r = redis.client.getInstance();

function createSocketServer(http) {
  const socket = new Server(http);

  const colourSocket = socket.of('/resource/colours')

  colourSocket.on('connection', socket => {
    winston.info('Client connected to colour socket')

    // we want to do this differently to handle multiple clients
    async function updateColours() {
      socket.emit('colours', await r.get('pyzzazz:leds:colours'));
    }

    socket.on('ready', () => {
      winston.info('Client sent ready signal');
      // updateColours();
      let colourUpdateInterval = setInterval(updateColours, 1000 / 30);

      socket.on('disconnect', socket => {
        winston.info('Client disconnected from colour socket')
        clearInterval(colourUpdateInterval);
      })
    });
  })

  const controlSocket = socket.of('/control');

  controlSocket.on('connection', socket => {
    winston.info('Client connected to control socket')

    socket.on('control', async cmds => {
      winston.debug(`client command received: ${JSON.stringify(cmds)}`);
      await r.rPush('pyzzazz:commands', JSON.stringify(cmds));
    });

    socket.on('disconnect', socket => {
      winston.info('Client disconnected from control socket')
    })
  });
}

module.exports = createSocketServer;