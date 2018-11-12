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
  ChatMessage as Component,
  Props as ComponentProps,
} from '../components/ChatMessage';
import { connect } from 'react-redux';
import { ReduxState } from '../state';

export type Props = {
  id: string;
};

export const ChatMessage = connect(
  (state: ReduxState, props: Props): ComponentProps => ({
    message: state.messages[props.id],
  }),
  _dispatch => ({}),
)(Component);
