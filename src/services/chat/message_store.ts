/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Rx from 'rxjs';
import * as btree from 'btreejs';
import { Message } from './service';

const Tree = btree.create();

export class MessageStore {
  private readonly messages = new Tree();
  private readonly observable = new Rx.Subject<Message>();

  async put(message: Message): Promise<void> {
    const createdAt = new Date(message.createdAt);
    this.messages.put(createdAt.getTime(), message);
    this.observable.next(message);
  }

  async findAll(
    afterDate?: string,
    beforeDate?: string,
    limit?: number,
  ): Promise<Message[]> {
    const messages: Message[] = [];
    try {
      this.messages.walkDesc(
        afterDate && new Date(afterDate).getTime(),
        beforeDate && new Date(beforeDate).getTime(),
        (_timestamp: number, message: Message) => {
          messages.push(message);
          return limit && messages.length >= limit;
        },
      );
    } catch (err) {
      console.log(err);
    }
    return messages;
  }

  getObservable(): Rx.Observable<Message> {
    return this.observable;
  }
}
