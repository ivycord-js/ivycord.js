/*

  NOTE: THIS IS NOT A 100% WORKING EXAMPLE. THIS IS ONLY USED FOR TESTING PURPOSES DURING LIBRARY DEVELOPMENT.

*/

/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('../packages/core/dist/index');
const { Rest } = require('../packages/rest/dist/index');
const { Gateway } = require('../packages/gateway/dist/index');

const TOKEN = 'YOUR_TOKEN';

const rest = new Rest(TOKEN);
const gateway = new Gateway({
  token: TOKEN,
  rest
});

const client = new Client({ rest, gateway });

client.gateway.on('ready', () => {
  console.log('Client is online.');
});

client.gateway.connect();
