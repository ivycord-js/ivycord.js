type Errors = 'WS_ALREADY_CONNECTED' | 'LARGE_THRESHOLD_INVALID';

const messages: Record<Errors, string> = {
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket',
  LARGE_THRESHOLD_INVALID: 'Large threshold must be between 50 and 250'
};

class IvyError extends Error {
  constructor(error: Errors) {
    const message = messages[error];
    super(message);
  }
}

export { IvyError };
