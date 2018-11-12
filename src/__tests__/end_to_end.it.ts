/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as http from 'http';
import * as puppeteer from 'puppeteer';
import { startServer } from '../server';
import { expect } from 'chai';
import * as moment from 'moment';
import { MessageStatus } from '../client/state';
import { ChatPage } from './chat_page';

describe('rpc_ts_chat', () => {
  describe('end-to-end', () => {
    describe('headless browser tests', function() {
      this.timeout(50000);

      let server: http.Server;
      let browser: puppeteer.Browser;
      let page: puppeteer.Page;

      beforeEach(async () => {
        server = await startServer();
        console.log('Server started');
        browser = await puppeteer.launch();
        console.log('Browser launched');
        page = await browser.newPage();
        console.log('New page opened');
        //page.goto(getPageUrl(server));
        page.goto('https://www.google.com');
      });

      afterEach(async () => {
        await browser.close();
        server.close();
      });

      it('can send a new message', async () => {
        const chatPage = new ChatPage(page);

        expect(
          await chatPage.getChatHistory(),
          'chat history is initially empty',
        ).to.have.length(0);
        await chatPage.typeNewMessage('Hello, world');
        expect(
          await chatPage.getNewMessage(),
          'new message was correctly typed',
        ).to.equal('Hello, world');
        await chatPage.sendNewMessage();

        expect(
          await chatPage.getNewMessage(),
          'new message input is reset after a message is sent',
        ).to.equal('');

        const chatHistory = await chatPage.getChatHistory();
        expect(chatHistory, 'one message has been produced').to.have.length(1);
        expect(
          chatHistory[0].text,
          'the message has the correct text',
        ).to.equal('Hello, world');
        const date = chatHistory[0].date;
        expect(moment(date).isValid(), `the date "${date}" should be valid`).to
          .be.true;
        expect(
          chatHistory[0].status,
          'the message has been successfully sent',
        ).to.be.equal(MessageStatus.optimisticReceived);

        const send = await page.waitForSelector(
          '.MessageComposer input[type="submit"]',
        );
        await send.click();
      }).timeout(30000);
    });
  });
});

function getPageUrl(server: http.Server) {
  return `http://localhost:${server.address().port}`;
}
