/** @flow */

import React, { Component, PropTypes } from 'react';
let L = null;
__CLIENT__ ? L = require( 'mapbox.js') : undefined;

import {isEqual} from 'lodash';
import _ from 'lodash';

import MapCard from './MapCard';
import container from './container';
import Copy from 'utils/copy';

let flagMapInitialized = false;
class Map extends Component {
  static propTypes = {
    socketConnected: PropTypes.bool,
    socketMessage: PropTypes.object
  };

  mapView = null;
  positionMarkers = [];
  placeMarkers = [];
  flagUnmounted = false;

  state = {
    selectedDevice: null,
    flagShowOverlay: false,
    overlayX: 0,
    overlayY: 0
  };

  componentDidMount() {
    setTimeout(()=> {
      if (__CLIENT__ && this.mapView == null && !this.flagUnmounted) {
        if (flagMapInitialized === false) {
          L.mapbox.accessToken = 'pk.eyJ1Ijoic2ltb25tYXAiLCJhIjoiY2luNHcwaGhyMDBydXdlbTJwZTdza2NkbSJ9.GZGPRYUc8yeYNOFEaQfM0A';
          this.mapView = L.mapbox.map('map', 'simonmap.023dca42', {zoomControl: false, attributionControl: false}).setView([45.3007, 6.5800], 15);
          flagMapInitialized = true;
          new L.Control.Zoom({ position: 'bottomright' }).addTo(this.mapView);
          this.mapView.on('mousedown', (event)=> {
            if (this.props.markerStyle > 0) {
              this.props.addNewMarker({
                type: this.props.markerStyle,
                position: event.latlng
              });
            }
            this.setState({
              flagShowOverlay: false
            });
          });

          this.removeOldPositionMarkers();
          if (this.props.socketMessage.data.devices) {
            _.forEach(this.props.socketMessage.data.devices, (item) => {
              this.addPositionMarker(item);
            });
          }

        }
      }
    }, 1000);
  }

  removeOldPositionMarkers() {
    _.forEach(this.positionMarkers, (marker) => {
      marker.off('click');
      this.mapView.removeLayer(marker)
    });
  };

  removeOldPlaceMarkers() {
    _.forEach(this.placeMarkers, (marker) => {
      this.mapView.removeLayer(marker)
    });
  };

  componentWillUnmount() {
    this.removeOldPositionMarkers();
    this.removeOldPlaceMarkers();

    if (this.mapView != null) {
      this.mapView.remove();
      this.mapView = null;
    }

    this.flagUnmounted = true;
    flagMapInitialized = false;
  }

  showMapOverlay(marker) {
    const transformMarker = marker._icon.style.transform;
    const transformMap = this.mapView._mapPane.style.transform;

    const results1 = transformMarker.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);
    const results2 = transformMap.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);

    const translateValue = results1.slice(1, 3);
    const translateValue1 = results2.slice(1, 3);
    this.setState({
      selectedDevice: marker.options.item,
      overlayX: parseInt(translateValue[0]) + parseInt(translateValue1[0]) ,
      overlayY: parseInt(translateValue[1]) + parseInt(translateValue1[1]) ,
      flagShowOverlay: true
    })
  }

  addPlaceMarker(marker) {
    const customMarker = L.Marker.extend({
      options: {
        item: null,
      }
    });

    let icon = Copy.markerMenuItems[marker.type - 1].icon;
    let mapIcon = L.icon({
      iconUrl: icon + '.svg',
      iconSize: [50, 60],
      iconAnchor: [25, 60],
    });
    this.placeMarkers.push(new customMarker(marker.position, {icon: mapIcon}).addTo(this.mapView));
  }

  addPositionMarker(item) {
    let mapView = this.mapView;
    let component = this;
    if (__CLIENT__) {
      const customMarker = L.Marker.extend({
        options: {
          item: null,
        }
      });

      let mapIcon = L.icon({
        iconUrl: '/icons/marker/marker.svg',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
      });

      let marker = new customMarker(item.location, {icon: mapIcon, item: item})
        .addTo(mapView);
      this.positionMarkers.push(marker);

      marker.on('click', (e) => {
        component.showMapOverlay(e.target);
      });
      return marker;
    }
  }

  getMarker(uuid) {
    let ret = null;
    _.forEach(this.positionMarkers, (marker) => {
      if (marker.options.item.listing_uuid == uuid) {
        ret = marker;
      }
    });
    return ret;
  }

  componentWillReceiveProps(nextProps) {
    let mapView = this.mapView;
    let component = this;

    if (!isEqual(this.props.socketMessage, nextProps.socketMessage) && nextProps.socketMessage.type == 'show_devices') {
      if (mapView) {
        this.removeOldPositionMarkers();
        if (nextProps.socketMessage.data.devices) {
          _.forEach(nextProps.socketMessage.data.devices, (item) => {
            component.addPositionMarker(item);
          });
        }
      }
    }

    if (!isEqual(this.props.placeMarkers, nextProps.placeMarkers) || this.props.markerStyle != nextProps.markerStyle) {
      if (mapView) {
        this.removeOldPlaceMarkers();
        _.forEach(nextProps.placeMarkers, (marker) => {
          if (marker.type == nextProps.markerStyle) {
            component.addPlaceMarker(marker);
          }
        });
      }
    }

  }

  renderMapOverlay(styles) {
    let width = 400;
    let height = 300;
    let sidebarWidth = 0;
    if (this.props.sidebar) {
      sidebarWidth = this.props.sidebar.getWidth();
    }
    const markerOverlayStyle = {
      position: 'absolute',
      top: this.state.overlayY - height - 60,
      left: this.state.overlayX - width / 2 + sidebarWidth - 12.5,
    };
    if (this.state.selectedDevice) {
      if (this.state.flagShowOverlay ) {
        return (
          <MapCard
            className={styles.markerOverlay}
            style={markerOverlayStyle}
            markerInfo={this.state.selectedDevice}
          />
        )
      }
    }
  }

  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.mapContainer}>
        <div id='map' className={styles.map}></div>
        {this.renderMapOverlay(styles)}
      </div>
    );
  }


}

export default container(Map);
