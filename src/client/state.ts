/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Message } from '../services/chat/service';

export type ReduxState = {
  messages: { [id: string]: MessageWithStatus };
  messageIds: string[];
  newMessage: string;
  connectionError?: boolean;
  loading?: boolean;
};

export type MessageWithStatus = Message & { status?: MessageStatus };

export enum MessageStatus {
  optimistic = 'optimistic',
  optimisticReceived = 'optimisticReceived',
  received = 'received',
}

export const DEFAULT_REDUX_STATE: ReduxState = {
  messages: {},
  messageIds: [],
  newMessage: '',
};
