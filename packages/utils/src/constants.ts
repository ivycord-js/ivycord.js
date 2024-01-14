const Constants = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VERSION: require('../../core/package.json').version as number,
  BASE_URL: 'https://discord.com/api/v10'
} as const;

export { Constants };
