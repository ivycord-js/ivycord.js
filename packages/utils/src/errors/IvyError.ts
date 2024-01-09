const messages = {
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket',
  LARGE_THRESHOLD_INVALID: 'Large threshold must be between 50 and 250',
  FETCH_ERROR: 'An error occurred while fetching\n\n{message}'
};

/**
 * Error keys for IvyError
 */
type ErrorKeys = keyof typeof messages;

/**
 * Represents a standard error of the library
 * @extends {Error}
 */
class IvyError extends Error {
  /**
   * Creates a new instance of IvyError
   * @param error Error key
   * @param [message] Optional error message
   */
  constructor(error: ErrorKeys, message?: string) {
    const errorMessage = messages[error].replace(/{message}/g, message ?? '');
    super(errorMessage);
  }
}

export { IvyError };
