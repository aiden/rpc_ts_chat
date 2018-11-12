/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';
import * as screenfull from 'screenfull';

export type Props = {};

export class Screenfull extends React.Component<Props> {
  /** main render */
  render() {
    return (
      <div className="FullScreen">
        <button onClick={() => screenfull.request()}>Go full screen</button>
      </div>
    );
  }
}
