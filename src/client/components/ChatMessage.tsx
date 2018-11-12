/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';
import { MessageWithStatus } from '../state';

export type Props = {
  message: MessageWithStatus;
};

export class ChatMessage extends React.Component<Props> {
  /** main render */
  render() {
    return (
      <div className="ChatMessage">
        <div className="Text">{this.props.message.text}</div>
        <div className="Date">
          <div className="DateText">{this.props.message.createdAt}</div>
          <div className={`Status ${this.props.message.status}`}>✓</div>
        </div>
      </div>
    );
  }
}
