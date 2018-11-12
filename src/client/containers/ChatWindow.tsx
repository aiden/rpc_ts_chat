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
  ChatWindow as Component,
  Props as ComponentProps,
} from '../components/ChatWindow';
import { connect } from 'react-redux';
import { ReduxState } from '../state';

export type Props = {};

export const ChatWindow = connect(
  (state: ReduxState, _props: Props): ComponentProps => ({
    messageIds: state.messageIds,
  }),
  _dispatch => ({}),
)(Component);
