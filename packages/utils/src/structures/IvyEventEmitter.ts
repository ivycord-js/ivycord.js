import EventEmitter from 'events';

/**
 * Represents an event emitter with extended functionality.
 * @extends {EventEmitter}
 */
class IvyEventEmitter<
  K extends string,
  T extends Record<K, (...args: any[]) => void>
> extends EventEmitter {
  /**
   * Registers an event listener.
   * @param event The name of the event.
   * @param listener The callback function.
   * @returns The event emitter.
   */
  override on<U extends K>(event: U, listener: T[U]) {
    return super.on(event, listener);
  }

  /**
   * Registers an event listener that only runs once.
   * @param event The name of the event.
   * @param listener The callback function.
   * @returns The event emitter.
   */
  override once<U extends K>(event: U, listener: T[U]) {
    return super.once(event, listener);
  }

  /**
   * Removes an event listener.
   * @param event The name of the event.
   * @param listener The callback function.
   * @returns The event emitter.
   */
  override off<U extends K>(event: U, listener: T[U]) {
    return super.off(event, listener);
  }

  /**
   * Emits an event.
   * @param event The name of the event.
   * @param args Arguments to pass to the event listener.
   * @returns True if the event had listeners, otherwise false.
   */
  override emit<U extends K>(event: U, ...args: Parameters<T[U]>) {
    return super.emit(event, ...args);
  }
}

export { IvyEventEmitter };
