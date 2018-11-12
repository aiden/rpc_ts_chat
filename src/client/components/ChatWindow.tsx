/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';
import * as screenfull from 'screenfull';
import { ChatMessage } from '../containers/ChatMessage';
import { MessageComposer } from '../containers/MessageComposer';
import { StatusBanner } from '../containers/StatusBanner';
import { Screenfull } from './Screenfull';

export type Props = {
  messageIds: string[];
};

export type State = {
  screenfull: boolean;
};

export class ChatWindow extends React.Component<Props, State> {
  _history: HTMLElement | null = null;
  _window: HTMLElement | null = null;
  state = {
    screenfull: false,
  };

  _scrollBottom = () => {
    if (this._history) {
      this._history.scrollTop = this._history.scrollHeight;
    }
  };

  _onScroll = () => {
    if (this._window) {
      this._window.scrollTop = 0;
    }
  };

  _onHistoryScroll = () => {
    this.setState({ screenfull: !screenfull.isFullscreen });
  };

  constructor(props: Props) {
    super(props);
    setTimeout(this._scrollBottom);
  }

  componentWillMount() {
    screenfull.on('change', this._onScreenfull);
  }

  componentWillUnmount() {
    screenfull.off('change', this._onScreenfull);
  }

  _onScreenfull = () => {
    this.setState({ screenfull: !screenfull.isFullscreen });
  };

  componentWillReceiveProps(_nextProps: Props) {
    setTimeout(this._scrollBottom);
  }

  /** main render */
  render() {
    return (
      <div
        className="ChatWindow"
        onScroll={this._onScroll}
        ref={c => (this._window = c)}
      >
        <StatusBanner />
        <div
          className="ChatHistory"
          ref={c => (this._history = c)}
          onScroll={this._onHistoryScroll}
        >
          {this.props.messageIds.map(id => <ChatMessage key={id} id={id} />)}
        </div>
        {this.state.screenfull && <Screenfull />}
        <MessageComposer />
      </div>
    );
  }
}
