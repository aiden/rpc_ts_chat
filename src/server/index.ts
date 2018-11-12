/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as express from 'express';
import * as http from 'http';
import { chatServiceDefinition } from '../services/chat/service';
import { getChatHandler } from '../services/chat/handler';
import { ModuleRpcContextServer } from 'rpc_ts/lib/context/server';
import * as fs from 'fs';
import * as path from 'path';
import * as compression from 'compression';
import { ModuleRpcProtocolServer } from 'rpc_ts/lib/protocol/server';

/**
 * Start the backend server.
 *
 * @param port The port to start the server on.  If unspecified, the server is started
 * on a random, available port.  The port can be retrieved with `.address().port`
 * on the return value.
 */
export async function startServer(port?: number): Promise<http.Server> {
  const app = express();

  app.use(
    '/chat/api',
    ModuleRpcProtocolServer.registerRpcRoutes(
      chatServiceDefinition,
      getChatHandler(),
      {
        captureError: err => {
          console.log(err);
        },
        serverContextConnector: new ModuleRpcContextServer.EmptyServerContextConnector(),
      },
    ),
  );

  const staticRoot = path.join(__dirname, '../client/public');
  app.use(compression());
  app.use(express.static(staticRoot));

  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('User-agent: *\nDisallow: /\n');
  });

  app.get('/', (_req, res) => {
    // Redirect to chat app
    res.redirect('/chat/');
  });

  const html = fs.readFileSync(path.join(staticRoot, 'chat/index.html'));
  app.get('*', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  const server = http.createServer(app).listen(port);
  console.log('Listening on port', server.address().port);
  return server;
}

/**
 * Get the port from the environment variable `PORT`.
 */
function getPortFromEnv(): number | undefined {
  // 'random' is used, e.g., for end-to-end tests
  if (process.env.PORT === 'random') {
    return undefined;
  } else if (process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

if (require.main === module) {
  startServer(getPortFromEnv()).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
