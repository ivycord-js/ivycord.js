import { merge } from 'lodash';

import { Client } from '../client/Client';

export default class BaseStructure {
  public client: Client;
  public id: string;
  public createdAt: number;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
    this.createdAt = Math.floor(Number(this.id) / 4194304) + 1420070400000;
  }

  toJSON(additionalProps?: string[]) {
    const baseProps = {
      client: this.client,
      id: this.id,
      createdAt: this.createdAt
    };

    if (additionalProps) {
      const mergedProps = merge(baseProps, additionalProps);
      return mergedProps;
    }

    return baseProps;
  }
}
