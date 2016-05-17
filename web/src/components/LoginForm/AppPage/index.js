/** @flow */


import React, { Component, PropTypes } from 'react';

class AppPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  render() {

    let styles = require('./styles.scss');
    return (
      <div className={styles.AppPage}>
        <div className={styles.container}>

          <div className={styles.Top}>
            {"Skiscool"}
          </div>

          <img
            onClick={()=>{this.context.router.push('/')}}
            src="/icons/logo.svg"
            className={styles.app}
          />
        </div>
      </div>
    );
  }

}

export default AppPage;
