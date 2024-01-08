const { BaseClient } = require('../packages/ivycord.js/dist/index');

const client = new BaseClient({
  token:
    'MTE1MzA1MDg2NjkzMzMwOTUwMA.GKn0YM.5nlA4n2Q6kICBPIe-kjk5Vt2yxj-CCHf2n5keY',
  compress: true
});
client.on('heartbeat', () => {
  console.log('heartbeat received');
});

client.on('ready', () => {
  console.log('ready, latency ' + client.shard.latency);
});

client.connect();
