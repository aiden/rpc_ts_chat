/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ChatService } from './service';
import { MessageStore } from './message_store';
import { ModuleRpcServer } from 'ts-rpc/lib/server';
import * as Rx from 'rxjs';

export type ChatHandler = ModuleRpcServer.ServiceHandlerFor<ChatService>;

export const getChatHandler = (): ChatHandler => {
  const messageStore = new MessageStore();
  return {
    async getMessages(request) {
      return {
        messages: await messageStore.findAll(
          request.afterDate,
          request.beforeDate,
          request.limit,
        ),
      };
    },
    async subscribeToNewMessages(request, { onReady, onMessage }) {
      let canceled = false;
      let subscription: Rx.Subscription;
      onReady(() => {
        if (subscription) subscription.unsubscribe();
        canceled = true;
      });

      const initialMessages = await messageStore.findAll(request.afterDate);
      if (canceled) {
        return;
      }
      onMessage({ messages: initialMessages });

      await new Promise((accept, reject) => {
        subscription = messageStore.getObservable().subscribe(
          message => {
            console.log('Sending message', message);
            onMessage({ messages: [message] });
          },
          err => {
            reject(err);
          },
          () => {
            accept();
          },
        );
      });
    },
    async sendMessage(request) {
      await messageStore.put(request);
      return {};
    },
  };
};
