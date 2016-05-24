import React, {
  Dimensions,
  StyleSheet,
  View,
  Component,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
// import mapPropsOnChange from 'recompose/mapPropsOnChange';
import { Motion } from 'react-motion';
import { clusterMarkerHOC } from './ClusterMarker.js'; 
let srchot =require('./mapIcon-hotel.png');
let srcchal =require('./mapIcon-chalet.png');
let srcresto =require('./mapIcon-resto.png');
jewelStyle = function(scale,styles) {
let tr=[
            { "scale": scale}, 
            { "rotateX": "0 deg" },
            { "rotateY": "0 deg" },
            { "rotateZ": "0 deg" }
        ];
 obj={marker:{...styles,transform:tr}};

   return obj.marker;
 }
 
export const simpleMarker = ({
  source,style,stylechild,
  defaultMotionStyle, motionStyle,
}) => (  
  <Motion
    defaultStyle={defaultMotionStyle}
    style={motionStyle}>
  {  
 ({ scale }) => {
 if(source=='mapIcon-hotel.png')
 src=srchot;
 else if (source=='mapIcon-chalet.png')
 src=srcchal;
 else
 src=srcresto;
 return (
 <View style={style}>
      <Image source={src} style={jewelStyle(scale,stylechild)}/> 
   </View>
  )
  }
  }
  </Motion>
);

export const simpleMarkerHOC = compose(
 defaultProps({
  source: 'mapIcon-hotel.png',
 style: {},
stylechild: {
  width: 49,
  height: 64,
  top: -64,
  left: -25,
  transform:[]
   },
    initialScale: 0.3,
    defaultScale: 0.6,
    hoveredScale: 0.7,
  }),
  // resuse HOC
  clusterMarkerHOC
);

export default simpleMarkerHOC(simpleMarker);
