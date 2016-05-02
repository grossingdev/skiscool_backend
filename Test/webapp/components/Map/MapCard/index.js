/** @flow */

require('./styles.css');

import React, { Component, PropTypes } from 'react';


class MapCard extends Component {
  renderMarkerInfo(markerInfo) {
    return(
      <div className="info">
        <div className="label">Device UUID: {markerInfo.uuid}</div>
        <div className="label">User Name: {markerInfo.username}</div>
        <div className="label">Updated: {markerInfo.updated_at}</div>
      </div>
    )
  }

  render() {
    let {markerInfo} = this.props;
    if (markerInfo) {
      return (
        <div {...this.props}>
          <div className="markerOverlay">
            {this.renderMarkerInfo(markerInfo)}
          </div>
          <div className="closeIcon"></div>
        </div>
      );
    } else {
      return (<div></div>)
    }

  }

  static displayName = 'MapCard';
  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default MapCard;
