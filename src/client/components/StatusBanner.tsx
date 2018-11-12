/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';

export type Props = {
  connectionError: boolean;
};

export class StatusBanner extends React.Component<Props> {
  /** main render */
  render() {
    return (
      <div
        className={`StatusBanner ${
          this.props.connectionError ? 'Error' : 'Ok'
        }`}
      >
        <div className="Status">
          {this.props.connectionError && (
            <div className="ErrorText">
              Reconnecting... <div className="Spinner lds-dual-ring" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
