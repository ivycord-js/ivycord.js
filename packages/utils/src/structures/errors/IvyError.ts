const messages = {
  // Client
  LARGE_THRESHOLD_INVALID: 'Large threshold must be between 50 and 250',

  // Gateway
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket',

  // REST
  FETCH_ERROR: 'An error occurred while fetching\n\n{message}'
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