/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Message } from '../services/chat/service';
import { ReduxState } from './state';
import { ThunkExtraArgument } from './types';
import * as Chance from 'chance';
import * as uuid from 'uuid/v1';

export type ReduxAction =
  | {
      type: 'ADD_MESSAGES';
      payload: { messages: Message[] };
    }
  | {
      type: 'ADD_OPTIMISTIC_MESSAGE';
      payload: { message: Message };
    }
  | { type: 'SET_NEW_MESSAGE'; payload: { newMessage: string } }
  | {
      type: 'SET_CONNECTION_ERROR';
      payload: { error?: boolean };
    };

export type ReduxThunk = (
  dispatch: ReduxDispatch,
  getState: () => ReduxState,
  extra: ThunkExtraArgument,
) => Promise<void>;

export interface ReduxDispatch {
  (action: ReduxAction): void;
  (thunk: ReduxThunk): Promise<void>;
}

export const subscribeToNewMessages = (): ReduxThunk => async (
  dispatch,
  getState,
  { chat },
) => {
  chat
    .subscribeToNewMessages(() => {
      const messageIds = getState().messageIds;
      return {
        afterDate: messageIds[messageIds[0]],
      };
    })
    .on('message', ({ messages }) => {
      dispatch({
        type: 'ADD_MESSAGES',
        payload: {
          messages,
        },
      });
    })
    .start();
};

export const sendNewMessage = (msg: string | Message): ReduxThunk => async (
  dispatch,
  _getState,
  { chat },
) => {
  const message: Message =
    typeof msg !== 'string'
      ? msg
      : {
          text: msg,
          id: uuid(),
          createdAt: new Date().toISOString(),
        };
  dispatch({
    type: 'ADD_OPTIMISTIC_MESSAGE',
    payload: {
      message,
    },
  });
  await chat.sendMessage(message);
};

export const sendGibberish = (): ReduxThunk => async (dispatch, _getState) => {
  const chance = new Chance();
  for (let i = 0; i < 10; ++i) {
    dispatch(sendNewMessage(chance.paragraph()));
  }
};

export const sendOptimisticMessages = (): ReduxThunk => async (
  dispatch,
  _getState,
) => {
  console.log('Send optimistic messages');
  const optimisticMessagesStr = localStorage.getItem('optimisticMessages');
  if (optimisticMessagesStr) {
    const optimisticMessages = JSON.parse(optimisticMessagesStr);
    for (const messageId in optimisticMessages) {
      dispatch(sendNewMessage(optimisticMessages[messageId]));
    }
  }
};
