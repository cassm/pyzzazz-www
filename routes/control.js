const express = require('express');
const cors = require('cors');
const redis = require('../src/db/redis');
const winston = require('../src/utils/logger/winston');
const router = express.Router();

const r = redis.client.getInstance();

router.options('/', cors({credentials: true, origin: true}));

router.post('/', cors({credentials: true, origin: true}), async function(req, res, next) {
  const cmd = req.body;
  winston.debug(`client command received: ${JSON.stringify(cmd)}`);
  await r.rPush('pyzzazz:commands', JSON.stringify(cmd));
  res.sendStatus(201);
  next();
});

router.post('/clients', async function(req, res, next) {
  const cmd = req.body;
  winston.debug(`command received for all clients: ${cmd.value}`);
  await r.rPush('pyzzazz:clients:cmd', cmd.value);
  res.sendStatus(201);
  next();
});

router.post('/clients/:id', async function(req, res, next) {
  const id = req.params.id;
  const cmd = req.body;
  winston.debug(`command received for client ${id}: ${cmd.value}`);
  await r.rPush(`pyzzazz:clients:${id}:cmd`, cmd.value);
  res.sendStatus(201);
  next();
});

module.exports = router;
