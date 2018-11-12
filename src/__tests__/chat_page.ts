/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as puppeteer from 'puppeteer';
import { MessageStatus } from '../client/state';

/**
 * Page Object Model for the whole Single Page Application.
 *
 * @see https://medium.com/tech-tajawal/page-object-model-pom-design-pattern-f9588630800b
 * for more info on this pattern.
 */
export class ChatPage {
  constructor(private readonly page: puppeteer.Page) {}

  /**
   * Type a message in the "New Message" text input.
   */
  async typeNewMessage(text: string) {
    const handle = await this.waitFor(ChatPageSelector.newMessage);
    await handle.type(text);
  }

  /**
   * Return the message currently in the "New Message" text input.
   */
  async getNewMessage(): Promise<string> {
    const handle = await this.waitFor(ChatPageSelector.newMessage);
    return (await handle.getProperty('value')).jsonValue();
  }

  /**
   * Click on "Send" to send the message in the "New Message" text input.
   */
  async sendNewMessage() {
    const handle = await this.waitFor(ChatPageSelector.sendNewMessage);
    await handle.click();
  }

  /** Return all the historical messages displayed in the chat. */
  async getChatHistory(): Promise<ChatMessage[]> {
    const chatHistory = await this.page.waitForSelector(
      ChatPageSelector.chatHistory,
    );
    const messages = await chatHistory.$$(ChatPageSelector.chatMessage);
    return Promise.all(
      messages.map(async message => {
        const [text, date, status] = await Promise.all([
          message.$(ChatPageSelector.text),
          message.$(ChatPageSelector.date),
          message.$(ChatPageSelector.status),
        ]);
        const statusClassName = !status
          ? ''
          : await (await status.getProperty('className')).jsonValue();
        return {
          text: !text
            ? ''
            : await (await text.getProperty('textContent')).jsonValue(),
          date: !date
            ? ''
            : await (await date.getProperty('textContent')).jsonValue(),
          status: statusClassName.replace('Status ', ''),
        };
      }),
    );
  }

  private async waitFor(selector: ChatPageSelector) {
    return this.page.waitForSelector(selector);
  }
}

/** A message in the chat history. */
export type ChatMessage = {
  text: string;
  date: string;
  status: MessageStatus;
};

/** Selectors available for the Chat page. */
enum ChatPageSelector {
  newMessage = '.MessageComposer .NewMessage',
  sendNewMessage = '.MessageComposer input[type="submit"]',
  chatHistory = '.ChatHistory',
  chatMessage = '.ChatMessage',
  text = '.Text',
  date = '.DateText',
  status = '.Status',
}
