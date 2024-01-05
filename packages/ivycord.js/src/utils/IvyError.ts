type Errors = 'WS_ALREADY_CONNECTED';

<<<<<<< HEAD
type MessageKey =
  | 'WS_UNABLE_TO_CONNECT'
  | 'WS_ALREADY_CONNECTED'
  | 'LARGE_THRESHOLD_INVALID';

type MessageFunction = (...args: any[]) => string;

const Messages: Record<MessageKey, string | MessageFunction> = {
  WS_UNABLE_TO_CONNECT: 'Unable to connect to the WebSocket',
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket',
  LARGE_THRESHOLD_INVALID:
    "Large threshold can't be lower than 50 or higher than 250"
=======
const messages: Record<Errors, string> = {
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket'
>>>>>>> 97fcf6981569ec9052b49cb71cc5afea88f86273
};

class IvyError extends Error {
  constructor(error: Errors) {
    const message = messages[error];
    super(message);
  }
}
<<<<<<< HEAD
=======

export { IvyError };
>>>>>>> 97fcf6981569ec9052b49cb71cc5afea88f86273
