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
  StatusBanner as Component,
  Props as ComponentProps,
} from '../components/StatusBanner';
import { connect } from 'react-redux';
import { ReduxState } from '../state';
import { ReduxDispatch } from '../actions';

export type Props = {};

export const StatusBanner = connect(
  (state: ReduxState, _props: Props): Partial<ComponentProps> => ({
    connectionError: state.connectionError,
  }),
  (_dispatch: ReduxDispatch): Partial<ComponentProps> => ({}),
)(Component);
