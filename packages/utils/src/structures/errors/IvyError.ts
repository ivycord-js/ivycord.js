const messages = {
  // Client
  LARGE_THRESHOLD_INVALID: 'Large threshold must be between 50 and 250.',
  EVENTS_LOAD_FAILED:
    'Failed to load events. Try reinstalling the package or contact the developer.',

  // Gateway
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket.',
  SHARD_COUNT_SHARDS_START_FROM_MISMATCH:
    'Cannot use "auto" as the shard count when shardsStartFrom option is not 0.',

  // REST
  FETCH_ERROR: 'An error occurred while fetching:\n\n{message}',

  NOT_IMPLEMENTED: 'This method is not implemented yet.'
};

/**
 * Error keys for IvyError.
 */
type ErrorKeys = keyof typeof messages;

/**
 * Represents a standard error of the library.
 * @extends {Error}
 */
class IvyError extends Error {
  /**
   * Creates a new instance of IvyError.
   * @param error The error key.
   * @param [message] The optional error message.
   */
  constructor(error: ErrorKeys, message?: string) {
    const errorMessage = messages[error].replace(/{message}/g, message ?? '');
    super(errorMessage);
  }
}

export { IvyError };
