import { BaseClient } from '../core/BaseClient';
import { IvyError } from '../errors/IvyError';
const BASE_URL = 'https://discord.com/api/v10';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
class RequestHandler {
  private client: BaseClient;
  constructor(client: BaseClient) {
    this.client = client;
  }
  async request(method: Method, endpoint: string, body: unknown) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': `DiscordBot (Ivycord/${
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('../../package.json').version
        })`,
        Authorization: `Bot ${this.client.token}`
      };
      const res = await fetch(BASE_URL + endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      if (res.status === 204) return;
      const data = await res.json();
      if (res.ok) return data;
    } catch (error: unknown) {
      throw new IvyError('FETCH_ERROR', (error as Error).message);
    }
  }
}

export { RequestHandler };
