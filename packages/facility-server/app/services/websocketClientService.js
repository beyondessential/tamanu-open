import { io } from 'socket.io-client';
import { WS_EVENTS } from '@tamanu/constants';

/**
 *
 * @param {{config: { sync: { host: string}, language: string}, websocketService: ReturnType<import('./websocketService').defineWebsocketService>, models: import('../../../shared/src/models')}} injector
 */
export const defineWebsocketClientService = injector => {
  const client = io(injector.config.sync.host, { transports: ['websocket'] });
  const getClient = () => client;

  //forward event to facility client
  client.on(
    WS_EVENTS.TELEGRAM_SUBSCRIBE,
    /**
     *
     * @param {{ contactId: string, chatId: string }} payload
     */
    async ({ chatId, contactId }) => {
      const contact = await injector.models?.PatientContact.findByPk(contactId);
      if (!contact) return;

      contact.connectionDetails = { chatId };
      await contact.save();

      injector.websocketService?.emit(WS_EVENTS.TELEGRAM_SUBSCRIBE_SUCCESS, { contactId, chatId });
    },
  );

  client.on(
    WS_EVENTS.TELEGRAM_UNSUBSCRIBE,
    /**
     *
     * @param {{ contactId: string }} payload
     */
    async ({ contactId }) => {
      const contact = await injector.models?.PatientContact.findByPk(contactId);
      if (!contact) return;

      await contact.destroy();
      injector.websocketService?.emit(WS_EVENTS.TELEGRAM_UNSUBSCRIBE_SUCCESS, { contactId });
    },
  );

  const emit = (eventName, ...args) => client.emit(eventName, ...args);

  const listenOnce = (eventName, callback) => client.once(eventName, callback);
  return {
    getClient,
    emit,
    listenOnce,
  };
};
