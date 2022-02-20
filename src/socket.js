const { Server } = require('socket.io');
const redis = require('./db/redis');
const winston = require('./utils/logger/winston');
const {clear} = require("winston");

const r = redis.client.getInstance();

function createSocketServer (http) {
    const socket = new Server(http);

    socket.on('connection', socket => {
        winston.info('Client connected to Socket.io server')

        // we want to do this differently to handle multiple clients
        async function updateColours () {
            socket.emit('colours', await r.get('pyzzazz:leds:colours'));
        }

        socket.on('ready', () => {
            winston.info('Client sent ready signal');
            // updateColours();
            let colourUpdateInterval = setInterval(updateColours, 1000 / 30);

            socket.on('disconnect', socket => {
                winston.info('Client disconnected from Socket.io server')
                clearInterval(colourUpdateInterval);
            })
        });
    })
}

module.exports = createSocketServer;