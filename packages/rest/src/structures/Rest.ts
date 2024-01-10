import axios, { AxiosError } from 'axios';
import { APIGatewayBotInfo, Routes } from 'discord-api-types/v10';

import { Constants, IvyError } from '@ivycord-js/utils';

/**
 * Request method used for a specific request sent to the Discord API.
 */
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Represents a REST client used for sending requests to the Discord API.
 */
class Rest {
  /**
   * The authorization token of the client.
   */
  private token: string;

  /**
   * The headers used for sending requests to the Discord API.
   */
  private headers: any;

  /**
   * Creates a new instance of REST client.
   * @param token The authorization token of the client.
   */
  constructor(token: string) {
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': `DiscordBot (Ivycord/${Constants.VERSION})`,
      Authorization: `${this.token.startsWith('Bot ') ? '' : 'Bot '}${
        this.token
      }`
    };
  }

  /**
   * Sends a request to the Discord API.
   * @param method The request method used.
   * @param endpoint The endpoint the request is sent to.
   * @param [body] The body of the request.
   * @returns The response from the Discord API.
   */
  async request<T>(
    method: RequestMethod,
    endpoint: string,
    body?: any
  ): Promise<T> {
    try {
      const res = await axios({
        url: Constants.BASE_URL + endpoint,
        method,
        headers: this.headers,
        data: body ? JSON.stringify(body) : undefined
      });
      return res.data;
    } catch (err) {
      throw new IvyError('FETCH_ERROR', (err as AxiosError).message);
    }
  }

  /**
   * Gets the appropriate gateway URL for connecting to Discord gateway.
   * @returns The promise which holds the gateway bot info when resolved.
   */
  async getGatewayBotInfo() {
    return await this.request<APIGatewayBotInfo>('GET', Routes.gatewayBot());
  }
}

export { Rest };
