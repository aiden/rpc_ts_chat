/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ModuleRpcCommon } from 'rpc_ts/lib/common';

export type ChatService = typeof chatServiceDefinition;

export const chatServiceDefinition = {
  getMessages: {
    request: {} as {
      beforeDate?: string;
      afterDate?: string;
      limit: number;
    },
    response: {} as {
      messages: Message[];
    },
  },
  subscribeToNewMessages: {
    type: ModuleRpcCommon.ServiceMethodType.serverStream,
    request: {} as {
      afterDate: string;
    },
    response: {} as {
      messages: Message[];
    },
  },
  sendMessage: {
    request: {} as Message,
    response: {},
  },
};

export type Message = {
  createdAt: string;
  text: string;
  id: string;
};
