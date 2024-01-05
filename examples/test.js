const { BaseClient } = require('../packages/ivycord.js/dist/index');

const client = new BaseClient({
  token: 'YOUR_TOKEN_HERE'
});

client.connect();
