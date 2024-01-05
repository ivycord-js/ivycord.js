type Errors = 'WS_ALREADY_CONNECTED';

const messages: Record<Errors, string> = {
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket'
};

class IvyError extends Error {
  constructor(error: Errors) {
    const message = messages[error];
    super(message);
  }
}

export { IvyError };
