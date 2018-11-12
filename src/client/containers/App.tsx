/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';
import { createStore, ReduxStore } from '../store';
import { chatServiceDefinition } from '../../services/chat/service';
import { ModuleRpcContextClient } from 'ts-rpc/lib/context/client';
import { Provider } from 'react-redux';
import { ChatWindow } from './ChatWindow';
import {
  subscribeToNewMessages,
  sendOptimisticMessages,
} from '../actions';
import { ModuleRpcProtocolClient } from 'ts-rpc/lib/protocol/client';

export type Props = {};

export class App extends React.Component<Props> {
  private store: ReduxStore;

  constructor(props: Props) {
    super(props);

    this.store = createStore({
      chat: ModuleRpcProtocolClient.getRpcClient(chatServiceDefinition, {
        remoteAddress: '/chat/api',
        clientContextConnector: new ModuleRpcContextClient.EmptyClientContextConnector(),
      })
        .withRetry()
        .on('serviceReady', (_method, _request) => {
          this.store.dispatch({
            type: 'SET_CONNECTION_ERROR',
            payload: {
              error: false,
            },
          });
        })
        .on('serviceError', (err, retries, _abandoned, method, request) => {
          console.log('ERR', err);
          this.store.dispatch({
            type: 'SET_CONNECTION_ERROR',
            payload: {
              error: true,
            },
          });
          if (method === 'sendMessage' && retries === 0) {
            localStorage.setItem(
              'optimisticMessages',
              JSON.stringify({
                ...JSON.parse(
                  localStorage.getItem('optimisticMessages') || '{}',
                ),
                [request.id]: request,
              }),
            );
          }
        })
        .on('serviceComplete', (method, request) => {
          if (method === 'sendMessage') {
            const optimisticMessages = JSON.parse(
              localStorage.getItem('optimisticMessages') || '{}',
            );
            delete optimisticMessages[request.id];
            localStorage.setItem(
              'optimisticMessages',
              JSON.stringify(optimisticMessages),
            );
          }
        })
        .service()
        .nice(),
    });
  }

  componentWillMount() {
    this.store.dispatch(subscribeToNewMessages());
    setTimeout(() => this.store.dispatch(sendOptimisticMessages()));
  }

  /** main render */
  render() {
    return (
      <Provider store={this.store}>
        <ChatWindow />
      </Provider>
    );
  }
}
