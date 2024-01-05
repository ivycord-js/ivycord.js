// treba se pogledati dobro jer nisam siguran u ovo - camdzic

type MessageKey = 'WS_UNABLE_TO_CONNECT' | 'WS_ALREADY_CONNECTED';

type MessageFunction = (...args: any[]) => string;

const Messages: Record<MessageKey, string | MessageFunction> = {
  WS_UNABLE_TO_CONNECT: 'Unable to connect to the WebSocket',
  WS_ALREADY_CONNECTED: 'Already connected to the WebSocket'
};

class IvyError extends Error {
  constructor(key: MessageKey, ...args: any[]) {
    if (!(key in Messages)) {
      throw new TypeError(`Error key '${key}' does not exist`);
    }

    const message = Messages[key];

    super(typeof message === 'function' ? message(...args) : message);
  }
}