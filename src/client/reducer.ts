/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as _ from 'lodash';
import { Reducer } from 'redux';
import { ReduxState, MessageStatus, DEFAULT_REDUX_STATE } from './state';
import { ReduxAction } from './actions';
import { Message } from '../services/chat/service';

export const reducer: Reducer<ReduxState> = (
  state = DEFAULT_REDUX_STATE,
  action: ReduxAction,
) => {
  switch (action.type) {
    case 'ADD_MESSAGES': {
      const messages = action.payload.messages.reduce(
        (acc, message) => ({
          ...acc,
          [message.id]: {
            ...message,
            status: acc[message.id]
              ? MessageStatus.optimisticReceived
              : MessageStatus.received,
          },
        }),
        state.messages,
      );
      return {
        ...state,
        messages,
        messageIds: getMessageIds(messages),
      };
    }

    case 'ADD_OPTIMISTIC_MESSAGE': {
      const messages = {
        ...state.messages,
        [action.payload.message.id]: {
          ...action.payload.message,
          status: MessageStatus.optimistic,
        },
      };
      return {
        ...state,
        messages,
        messageIds: getMessageIds(messages),
      };
    }

    case 'SET_NEW_MESSAGE': {
      return {
        ...state,
        newMessage: action.payload.newMessage,
      };
    }

    case 'SET_CONNECTION_ERROR':
      return {
        ...state,
        connectionError: action.payload.error,
      };
  }

  return state;
};

function getMessageIds(messages: { [id: string]: Message }) {
  return _.sortBy(_.map(messages, 'id'), id =>
    new Date(messages[id].createdAt).getTime(),
  );
}
