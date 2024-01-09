import axios, { AxiosError } from 'axios';

import { BaseClient } from '../core/BaseClient';
import { VERSION } from '../utils/constants';
import { IvyError } from '../utils/errors/IvyError';

const BASE_URL = 'https://discord.com/api/v10';

/**
 * Request method type
 */
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Represents a request handler which is responsible for communicating with the REST API
 */
class RequestHandler {
  /**
   * The client that instantiates this request handler
   */
  private client: BaseClient;

  /**
   * Creates a new instance of the request handler
   * @param client The client that instantiates this request handler
   */
  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Sends a request to the Discord API
   * @param method Request method used
   * @param endpoint Endpoint the request is sent to
   * @param body Body of the request
   */
  async request<T>(
    method: RequestMethod,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': `DiscordBot (Ivycord/${VERSION})`,
        Authorization: `${this.client.token.startsWith('Bot ') ? '' : 'Bot '}${
          this.client.token
        }`
      };
      const res = await axios({
        url: `${BASE_URL}/${endpoint}`,
        method,
        headers,
        data: body ? JSON.stringify(body) : undefined
      });
      // TODO: dodati error handling
      return res.data;
    } catch (err) {
      throw new IvyError('FETCH_ERROR', (err as AxiosError).message);
    }
  }
}

export { RequestHandler };
