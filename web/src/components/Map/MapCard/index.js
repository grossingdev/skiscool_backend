/** @flow */

import React, { Component, PropTypes } from 'react';
import Button from 'components/common/button';

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
      let {user} = this.props;
      let flagShowRemoveButton = false;
      if (user && user.profile && user.profile.userType == 'instructor') {
        flagShowRemoveButton = true;
      }
      return (
        <div {...this.props}>
          <div className={styles.markerOverlay}>
            <div className={styles.btnContainer}>
              {flagShowRemoveButton && <Button type='label' className={styles.btnDelete} onClick={()=>{this.props.removeMarker()}}>{'Delete this marker'}</Button>}
            </div>
          </div>
          <div className={styles.closeIcon}></div>
        </div>
      )
    }

  }

  static displayName = 'MapCard';
  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default MapCard;
