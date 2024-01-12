import { calculateBitfield } from './functions/calculateBitfield';
import { sleep } from './functions/sleep';
import { Collection } from './structures/Collection';
import { IvyEventEmitter } from './structures/IvyEventEmitter';
import { IvyError } from './structures/errors/IvyError';

const Constants = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VERSION: require('../../core/package.json').version,
  BASE_URL: 'https://discord.com/api/v10'
} as const;

export {
  // Structure
  Collection,
  IvyEventEmitter,
  IvyError,

  // Non-structure
  Constants,

  // Functions
  sleep,
  calculateBitfield
};
