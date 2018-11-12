/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';

export type Props = {
  newMessage: string;
  setNewMessage: (newMessage: string) => void;
  sendNewMessage: (newMessage: string) => Promise<void>;
  sendGibberish: () => Promise<void>;
};

export class MessageComposer extends React.Component<Props> {
  private handleNewMessageChange = e => {
    this.props.setNewMessage(e.target.value);
  };

  private handleSend = async e => {
    e.preventDefault();
    setTimeout(() => this.props.setNewMessage(''));
    await this.props.sendNewMessage(this.props.newMessage);
  };

  /** main render */
  render() {
    return (
      <form className="MessageComposer" onSubmit={this.handleSend}>
        <input
          className="NewMessage"
          type="text"
          aria-label="Write a new message here"
          value={this.props.newMessage}
          onChange={this.handleNewMessageChange}
        />
        <input className="Send" type="submit" value="Send" />
        <input
          className="Send"
          type="button"
          value="Send gibberish"
          onClick={this.props.sendGibberish}
        />
      </form>
    );
  }
}
