/** @flow */

require('./styles.css');

import React, { Component, PropTypes } from 'react';
require('mapbox.js');
import {isEqual} from 'lodash';
import _ from 'lodash';

import MapCard from 'Map/MapCard';
import container from './container';

const customMarker = L.Marker.extend({
  options: {
    item: null,
  }
});

class Map extends Component {
  mapView = null;
  markers = [];

  state = {
    selectedDevice: null,
    flagShowOverlay: false,
    overlayX: 0,
    overlayY: 0
  };

  componentDidMount() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2ltb25tYXAiLCJhIjoiY2luNHcwaGhyMDBydXdlbTJwZTdza2NkbSJ9.GZGPRYUc8yeYNOFEaQfM0A';
    this.mapView = L.mapbox.map('map', 'mapbox.streets', { zoomControl: false,attributionControl: false}).setView([45.3007, 6.5800], 15);
    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.mapView);

    let component = this;
    this.mapView.on('mousedown', function(e) {
      component.setState({
        flagShowOverlay: false
      })
    });
  }

  removeOldMarkers() {
    _.forEach(this.markers, (marker) => {
      marker.off('click');
      this.mapView.removeLayer(marker)
    });
  }

  componentWillUnmount() {
    this.removeOldMarkers();
  }

  showMapOverlay(marker) {
    let transformMarker = marker._icon.style.transform;
    let transformMap = this.mapView._mapPane.style.transform;

    let results1 = transformMarker.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);
    let results2 = transformMap.match(/translate3d\((.+)px,(.+)px,(.+)px\)/);

    let translateValue = results1.slice(1, 3);
    let translateValue1 = results2.slice(1, 3);
    this.setState({
      selectedDevice: marker.options.item,
      overlayX: parseInt(translateValue[0]) + parseInt(translateValue1[0]) ,
      overlayY: parseInt(translateValue[1]) + parseInt(translateValue1[1]) ,
      flagShowOverlay: true
    })
  }

  addMarker(item) {
    let mapView = this.mapView;
    let component = this;

      let mapIcon = L.icon({
        iconUrl: "/public/icons/marker/marker.svg",
        iconSize: [50, 60],
        iconAnchor: [25, 60],
      });

      let locations = item.location.split(",");

      let marker = new customMarker([parseFloat(locations[0]), parseFloat(locations[1])], {icon: mapIcon, item: item})
        .addTo(mapView);
      this.markers.push(marker);

      marker.on('click', (e) => {
        component.showMapOverlay(e.target);
      });
      return marker;
    }

  getMarker(uuid) {
    let ret = null;
    _.forEach(this.markers, (marker) => {
      if (marker.options.item.listing_uuid == uuid) {
        ret = marker;
      }
    })
    return ret;
  }

  componentWillReceiveProps(nextProps) {
    let mapView = this.mapView;
    let component = this;

    if (!isEqual(this.props.socketMessage, nextProps.socketMessage) && nextProps.socketMessage.type == 'show_devices') {
      if (mapView) {
        this.removeOldMarkers();
        _.forEach(nextProps.socketMessage.data, (item) => {
          component.addMarker(item);
        })

      }
    }
  }

  renderMapOverlay() {
    let width = 400;
    let height = 300;
    let sidebarWidth = 0;
    if (this.props.sidebar) {
      sidebarWidth = this.props.sidebar.getWidth();
    }
    const markerOverlayStyle = {
      top: this.state.overlayY - height - 60,
      left: this.state.overlayX - width / 2 + sidebarWidth - 12.5,
    };
    if (this.state.selectedDevice) {
      if (this.state.flagShowOverlay ) {
        return (
          <MapCard
            className="markerOverlay"
            style={markerOverlayStyle}
            markerInfo={this.state.selectedDevice}
          />
        )
      }
    }

  }

  render() {
    return (
      <div>
        <div id="map"></div>
        {this.renderMapOverlay()}
      </div>
    );
  }

  static displayName = 'Map';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default container(Map);
