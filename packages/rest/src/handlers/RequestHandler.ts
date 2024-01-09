import axios, { AxiosError } from 'axios';

import { Constants, IvyError } from '@ivycord-js/utils';

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
   * The token of the bot
   */
  private token: string;

  /**
   * Creates a new instance of the request handler
   * @param token The token of the bot
   */
  constructor(token: string) {
    this.token = token;
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
        'User-Agent': `DiscordBot (Ivycord/${Constants.VERSION})`,
        Authorization: `${this.token.startsWith('Bot ') ? '' : 'Bot '}${
          this.token
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
