/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ModuleRpcClient } from 'rpc_ts/lib/client';
import { ChatService } from '../services/chat/service';

export type ThunkExtraArgument = {
  chat: ModuleRpcClient.NiceService<ChatService>;
};
