const express = require('express');
const redis = require('../src/db/redis');
const winston = require('../src/utils/logger/winston');
const router = express.Router();

const r = redis.client.getInstance();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const colours = await JSON.parse(await r.get('pyzzazz:leds:colours'));
  const coords = await JSON.parse(await r.get('pyzzazz:leds:coords'));

  res.json({
    colours,
    coords
  })
});

router.get('/:resource', async function(req, res, next) {
  const resource = req.params.resource;

  let value = {};

  if (resource === 'coords') {
    value = await JSON.parse(await r.get('pyzzazz:leds:coords'));
  } else if (resource === 'colours') {
    value = await JSON.parse(await r.get('pyzzazz:leds:colours'));
  } else {
    winston.info(`Request for invalid resource "${resource}"`);
  }

  res.json(value);
});

module.exports = router;
