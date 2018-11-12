/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import thunk from 'redux-thunk';
import {
  createStore as reduxCreateStore,
  applyMiddleware,
  compose,
  Unsubscribe,
  Reducer,
} from 'redux';
import { DEFAULT_REDUX_STATE, ReduxState } from './state';
import { reducer } from './reducer';
import { ReduxDispatch } from './actions';
import { ThunkExtraArgument } from './types';

export interface ReduxStore {
  dispatch: ReduxDispatch;
  getState(): ReduxState;
  subscribe(listener: () => void): Unsubscribe;
  replaceReducer(nextReducer: Reducer<ReduxState>): void;
}

export function createStore(thunkExtra: ThunkExtraArgument): ReduxStore {
  // This sets up Redux devtools if it is available
  // (see https://github.com/zalmoxisus/redux-devtools-extension).
  let composeEnhancers;
  /* tslint:disable strict-type-predicates */
  if (typeof window !== 'undefined') {
    /* tslint:enable strict-type-predicates */
    composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  if (!composeEnhancers) composeEnhancers = compose;

  return reduxCreateStore(
    reducer,
    DEFAULT_REDUX_STATE,
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(thunkExtra))),
  );
}
