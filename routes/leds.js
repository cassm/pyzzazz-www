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

  switch (resource) {
    case 'coords':
      value = await JSON.parse(await r.get('pyzzazz:leds:coords'));
      break;
    case 'colours':
      value = await JSON.parse(await r.get('pyzzazz:leds:colours'));
      break;
    case 'fixtures':
      value = await JSON.parse(await r.get('pyzzazz:fixtures'));
      break;
    case 'patterns':
      value = await JSON.parse(await r.get('pyzzazz:patterns'));
      break;
    case 'palettes':
      value = await JSON.parse(await r.get('pyzzazz:palettes'));
      break;
    case 'overlays':
      value = await JSON.parse(await r.get('pyzzazz:overlays'));
      break;
    default:
      winston.info(`Request for invalid resource "${resource}"`);
  }

  res.json(value);
});

module.exports = router;
