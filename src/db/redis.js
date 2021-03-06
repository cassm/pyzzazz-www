'use strict';

const {createClient} = require('redis');
const winston = require('../utils/logger/winston');

let client = null;

function onError(err) {
  client = null;
  winston.error(`RedisLabs connection error: ${err}`);
}

function onConnect() {
  winston.log('debug', 'Connected to RedisLabs!');
}

function onReconnecting() {
  winston.warn('Reconnected to RedisLabs!');
}

function onEnd() {
  client = null;
  winston.warn('Connection to RedisLabs closed');
}

function onSIGINT() {
  client.quit(() => {
    client = null;
    winston.warn('RedisLabs default connection disconnected through app termination');
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
}

function create() {
  if (client) winston.warn('New Redis client will be created');
  console.log("starting redis client")

  const redisUrl = `redis://default:${process.env.REDIS_PW}@${process.env.REDIS_IP}:${process.env.REDIS_PORT}`;

  client = createClient({
    url: redisUrl,
    retry_strategy: () => config.get('db.redis.retryStrategy'),
  });

  client.on('error', onError);
  client.on('connect', onConnect);
  client.on('reconnecting', onReconnecting);
  client.on('end', onEnd);

  process.on('SIGINT', onSIGINT);

  return client;
}

function getInstance() {
  return client || create();
}

module.exports = {
  create,
  client: {
    getInstance,
  },
};