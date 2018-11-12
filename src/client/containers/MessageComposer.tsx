/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//@ts-ignore
import * as React from 'react';
import {
  MessageComposer as Component,
  Props as ComponentProps,
} from '../components/MessageComposer';
import { connect } from 'react-redux';
import { ReduxState } from '../state';
import {
  sendNewMessage,
  sendGibberish,
  ReduxDispatch,
} from '../actions';

export type Props = {};

export const MessageComposer = connect(
  (state: ReduxState, _props: Props): Partial<ComponentProps> => ({
    newMessage: state.newMessage,
  }),
  (dispatch: ReduxDispatch): Partial<ComponentProps> => ({
    sendNewMessage(text: string) {
      return dispatch(sendNewMessage(text));
    },
    sendGibberish() {
      return dispatch(sendGibberish());
    },
    setNewMessage(newMessage: string) {
      dispatch({
        type: 'SET_NEW_MESSAGE',
        payload: {
          newMessage,
        },
      });
    },
  }),
)(Component);
