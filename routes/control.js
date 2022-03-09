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

module.exports = router;
