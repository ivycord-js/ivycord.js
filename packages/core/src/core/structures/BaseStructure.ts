import { merge } from 'lodash';

import { Client } from '../client/Client';

class BaseStructure {
  public client: Client;
  public id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  public get createdAtTimestamp() {
    return Math.floor(Number(BigInt(this.id) / 4194304n)) + 1420070400000;
  }

  public get createdAtUnix() {
    return Math.floor(this.createdAtTimestamp / 1000);
  }

  public get createdAt() {
    return new Date(this.createdAtTimestamp);
  }

  public toJSON(additionalProps?: string[]) {
    const baseProps = {
      client: this.client,
      id: this.id,
      createdAtTimestamp: this.createdAtTimestamp,
      createdAtUnix: this.createdAtUnix,
      createdAt: this.createdAt
    };

    if (additionalProps) {
      const mergedProps = merge(baseProps, additionalProps);
      return mergedProps;
    }

    return baseProps;
  }
}
export { BaseStructure };
