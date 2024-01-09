const { BaseClient } = require("../packages/ivycord.js/dist/index");

const client = new BaseClient({
  token: "YOUR_TOKEN",
  compress: true,
});

client.on("ready", () => {
  console.log("ready, latency " + client.shard.latency);
});

client.on("heartbeat", () => {
  console.log("heartbeat received");
});

client.connect();
