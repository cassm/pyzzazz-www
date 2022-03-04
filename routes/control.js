const express = require('express');
const redis = require('../src/db/redis');
const winston = require('../src/utils/logger/winston');
const router = express.Router();

const r = redis.client.getInstance();

router.post('/', async function(req, res) {
  const cmd = req.body;
  console.log(cmd);
  await r.rPush('pyzzazz:commands', JSON.stringify(cmd));
  res.sendStatus(201);
});

module.exports = router;
