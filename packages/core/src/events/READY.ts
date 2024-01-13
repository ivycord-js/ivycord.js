import { Client } from '../structures/client/Client';

export const run = (client: Client, data: unknown) => {
  client.emit('ready', data);
};
