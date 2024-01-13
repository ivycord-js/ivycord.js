/*

  NOTE: THIS IS NOT A 100% WORKING EXAMPLE. THIS IS ONLY USED FOR TESTING PURPOSES DURING LIBRARY DEVELOPMENT.

*/

/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('../packages/core/dist/index');
const { Rest } = require('../packages/rest/dist/index');
const { Gateway, GatewayIntents } = require('../packages/gateway/dist/index');

const TOKEN =
  'MTE1MzA1MDg2NjkzMzMwOTUwMA.GBsLfu.OSIzABkzZHEsO02wWuYcaQZCIMJOtwoVEPdYT8';

const rest = new Rest(TOKEN);
const gateway = new Gateway({
  token: TOKEN,
  rest,
  intents: [GatewayIntents.GUILDS]
});

const client = new Client({ rest, gateway });

client.on('ready', () => {
  console.log('ready');
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
client.gateway.connect();
