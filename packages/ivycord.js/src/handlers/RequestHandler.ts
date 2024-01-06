import axios, { AxiosError, AxiosResponse } from 'axios';

import { BaseClient } from '../core/BaseClient';
import { VERSION } from '../utils/constants';
import { IvyError } from '../utils/errors/IvyError';

const BASE_URL = 'https://discord.com/api/v10';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

class RequestHandler {
  private client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  async request<T>(
    method: RequestMethod,
    endpoint: string,
    body: unknown
  ): Promise<AxiosResponse<T>> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': `DiscordBot (Ivycord/${VERSION})`,
        Authorization: `Bot ${this.client.token}`
      };
      const res = await axios({
        url: `${BASE_URL}/${endpoint}`,
        method,
        headers,
        data: body ? JSON.stringify(body) : undefined
      });
      return res.data;
    } catch (err) {
      throw new IvyError('FETCH_ERROR', (err as AxiosError).message);
    }
  }
}

export { RequestHandler };
