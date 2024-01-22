/*

  NOTE: THIS IS NOT A 100% WORKING EXAMPLE. THIS IS ONLY USED FOR TESTING PURPOSES DURING LIBRARY DEVELOPMENT.

*/

const { Client } = require('../packages/core/dist/index');
const { Rest } = require('../packages/rest/dist/index');
const { Gateway, GatewayIntents } = require('../packages/gateway/dist/index');
const { MemoryCache } = require('../packages/cache/dist');

const TOKEN =
  'MTE1MzA1MDg2NjkzMzMwOTUwMA.GSm-BR.hY9i_USw2WFtmkstI223244p-AA40c5Cr021ME';

const rest = new Rest(TOKEN);
const gateway = new Gateway({
  token: TOKEN,
  rest,
  intents: [GatewayIntents.GUILDS]
});

const client = new Client({
  rest,
  gateway,
  cacheOptions: {
    
  }
});

client.on('ready', (bot) => {
  console.log('READY');
  console.log(bot.user.toJSON());
});

client.gateway.connect();
