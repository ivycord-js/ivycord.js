const { BaseClient } = require('../packages/ivycord.js/dist/index');

const client = new BaseClient({
  token: 'YOUR_TOKEN',
  compress: true
});

client.on('heartbeat', () => {
  console.log('heartbeat received');
});

client.connect();
