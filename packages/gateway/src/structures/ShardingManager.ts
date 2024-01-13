import { Collection } from '@ivycord-js/utils';

import { Gateway } from './Gateway';
import { Shard } from './Shard';

/**
 * Represents a Discord shard manager.
 */
class ShardingManager {
  /**
   * The gateway that manages this sharding manager.
   */
  public gateway: Gateway;

  /**
   * A collection of all shards.
   */
  public shards: Collection<number, Shard>;

  /**
   * The number of shards that this sharding manager manages.
   */
  public shardCount = 0;

  /**
   * The shard IDs that this sharding manager manages.
   */
  private shardIDs: number[] = [];

  /**
   * Creates a new instance of the sharding manager.
   * @param gateway The gateway that manages this sharding manager.
   */
  constructor(gateway: Gateway) {
    this.gateway = gateway;
    this.shards = new Collection<number, Shard>();
  }

  /**
   * Returns the shard IDs that this sharding manager manages.
   * @returns The shard IDs.
   */
  async getShardIDs() {
    const shardIDs: number[] = [];
    await this.gateway.fetchGatewayData();
    if (this.gateway.shardCount === 'auto') {
      for (let i = 0; i < this.gateway._gatewayData!.shards; i++) {
        shardIDs.push(i);
      }
      this.shardCount = this.gateway._gatewayData!.shards;
      return shardIDs;
    }
    for (let i = 0; i < this.gateway.shardCount; i++) {
      shardIDs.push(i);
    }
    return shardIDs;
  }

  /**
   * Spawns all shards.
   */
  async spawnShards() {
    this.shardIDs = await this.getShardIDs();
    for (const id of this.shardIDs) {
      if (this.shards.has(id)) continue;
      const shard = new Shard(id, this);
      this.handleShardEvents(shard);
    }
    await this.connectShards();
  }

  /**
   * Connects all shards to the gateway.
   * @returns A promise that resolves when all shards are connected.
   */
  connectShards() {
    const promises: void[] = [];
    for (const shard of this.shards.values()) {
      promises.push(shard.initWS());
    }
    return Promise.all(promises);
  }

  /**
   * Handles the events emitted by a shard.
   * @param shard The shard object.
   */
  handleShardEvents(shard: Shard) {
    shard
      .on('shardReady', (id) => {
        if (this.allShardsReady()) {
          this.gateway.ready = true;
          this.gateway.emit('shardReady', id);
          this.gateway.emit('ready');
        } else this.gateway.emit('shardReady', id);
      })
      .on('shardDisconnect', (id) => {
        this.gateway.emit('shardDisconnect', id);
      })
      .on('shardClose', (id, code, reason) => {
        this.gateway.emit('shardClose', id, code, reason);
      })
      .on('shardError', (id, err) => {
        this.gateway.emit('shardError', id, err);
      })
      .on('rawEvent', (id, data) => {
        this.gateway.emit('rawEvent', id, data);
      });
    this.shards.add(shard.id, shard);
  }

  /**
   * Checks if all shards are ready.
   * @returns True if all shards are connected, false otherwise.
   */
  allShardsReady() {
    return this.shards.every((shard) => shard.status === 'CONNECTED');
  }
}

export { ShardingManager };
