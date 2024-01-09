const { BaseClient } = require('ivycord.js');

const client = new BaseClient({
  token: 'YOUR_TOKEN',
  compress: true
});

client.on('ready', () => {
  console.log('ready, latency: ' + client.shard.latency);
});

client.connect();
