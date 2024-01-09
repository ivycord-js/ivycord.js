import { IvyError } from './errors/IvyError';

const Constants = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VERSION: require('../../core/package.json').version
} as const;

export { Constants, IvyError };
