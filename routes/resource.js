const express = require('express');
const redis = require('../src/db/redis');
const winston = require('../src/utils/logger/winston');
const router = express.Router();

const r = redis.client.getInstance();

router.post('/nodes/', async function(req, res) {
  const currentValues = await r.hGetAll('pyzzazz:clients');

  for (const [key, entry] of Object.entries(req.body)) {
    if (req.body.hasOwnProperty(key)) {
      if (entry !== currentValues[key]) {
        winston.info(`Setting node ${key} to fixture ${entry}`);
        await r.hSet('pyzzazz:clients', key, entry);
      }
    }
  }

  res.sendStatus(201);
})

router.post('/nodes/:node', async function(req, res) {
  const node = req.params.node;
  const value = req.body.value;

  await r.hSet('pyzzazz:clients', node, value);
  res.sendStatus(201);
})

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
    case 'fps':
      value = await JSON.parse(await r.get('pyzzazz:fps'));
      break;
    case 'sliders':
      value = await JSON.parse(await r.get('pyzzazz:sliders'));
      break;
    case 'nodes':
      value = await r.hGetAll('pyzzazz:clients');
      break;
    default:
      winston.info(`Request for invalid resource "${resource}"`);
  }

  res.json(value);
});

module.exports = router;
