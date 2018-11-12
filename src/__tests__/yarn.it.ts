/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as child_process from 'child_process';
import * as path from 'path';
import * as pathIsInside from 'path-is-inside';

describe('ts-rpc-chat', () => {
  describe('yarn commands run properly', () => {
    it('"yarn back" spins off the backend server @ossOnly', async () => {
      await yarnServer(['back'], /Listening on port/);
    }).timeout(5000);

    it('"yarn web" compiles the project successfully', async () => {
      await yarnServer(['web'], /Compiled successfully/, /Failed to compile/, {
        DO_NOT_OPEN_WEB_PAGE: 'true',
      });
    }).timeout(20000);
  });
});

/**
 * Execute a yarn command that starts a server and wait for some specific text on
 * stdout/stderr, then kill the child process.  A Regex for unexpected errors can
 * also be provided to fail early if an error was encountered.
 */
async function yarnServer(
  command: string[],
  expectedText: RegExp,
  unexpectedErrorText?: RegExp,
  env?: { [envVarName: string]: string },
) {
  const projectRoot = getProjectRoot();
  const proc = child_process.spawn('yarn', command, {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: 'random',
      TS_NODE_PROJECT: projectRoot,
      ...env,
    },
  });

  await new Promise((resolve, reject) => {
    proc.stdout.on('data', processData);
    proc.stderr.on('data', processData);
    proc.on('error', err => reject(err));
    proc.on('close', code => {
      reject(new Error(`exited before ready with exit code: ${code}`));
    });

    function processData(data) {
      const str = data.toString();
      console.log(str);
      if (expectedText.test(str)) {
        proc.kill('SIGTERM');
        resolve();
      } else if (unexpectedErrorText && unexpectedErrorText.test(str)) {
        proc.kill('SIGTERM');
        reject(new Error(`unexpected error text encountered: "${str.trim()}"`));
      }
    }
  });
}

/** Root of the project (directory of the `package.json` file). */
function getProjectRoot() {
  const projectRoot = path.resolve(__dirname, '../..');
  if (process.env.AIDEN_BUILD_ROOT) {
    // Useful for people that place their build artifact differently in the
    // context of a monorepo.
    if (pathIsInside(projectRoot, process.env.AIDEN_BUILD_ROOT)) {
      const monorepoRoot = process.env.AIDEN_MONOREPO_ROOT;
      if (!monorepoRoot) {
        throw new Error(
          `expected environment variable AIDEN_MONOREPO_ROOT to be set when AIDEN_BUILD_ROOT is set`,
        );
      }
      return path.resolve(
        monorepoRoot,
        path.relative(process.env.AIDEN_BUILD_ROOT, projectRoot),
      );
    }
  }
  return projectRoot;
}
