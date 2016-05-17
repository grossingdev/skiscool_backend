/** @flow */

import React, { Component, PropTypes } from 'react';


class MapCard extends Component {
  renderMarkerInfo(markerInfo, styles) {
    return(
      <div className={styles.info}>
        <div className={styles.info}>Device UUID: {markerInfo.device_uuid}</div>
        <div className={styles.info}>User Name: {markerInfo.email}</div>
        <div className={styles.info}>Updated: {markerInfo.updated}</div>
      </div>
    )
  }

  render() {
    const styles = require('./styles.scss');
    let {markerInfo} = this.props;
    if (markerInfo) {
      return (
        <div {...this.props}>
          <div className={styles.markerOverlay}>
            {this.renderMarkerInfo(markerInfo, styles)}
          </div>
          <div className={styles.closeIcon}></div>
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
