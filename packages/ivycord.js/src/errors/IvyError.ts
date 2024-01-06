type Errors =
  | 'WS_ALREADY_CONNECTED'
  | 'LARGE_THRESHOLD_INVALID'
  | 'FETCH_ERROR';

const messages: Record<Errors, string> = {
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket',
  LARGE_THRESHOLD_INVALID: 'Large threshold must be between 50 and 250',
  FETCH_ERROR: 'An error occurred while fetching\n\n{message}'
};

class IvyError extends Error {
  constructor(error: Errors, message?: string) {
    const errorMessage = messages[error].replace(/{message}/g, message ?? '');
    super(errorMessage);
  }
}

export { IvyError };
