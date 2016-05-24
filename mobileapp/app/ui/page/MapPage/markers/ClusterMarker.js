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
import withPropsOnChange from 'recompose/withPropsOnChange';
import pure from 'recompose/pure';
import { Motion, spring } from 'react-motion';
//import clusterMarkerStyles from './ClusterMarker.sass';
/*      <View style={jewelStyle(scale,stylechild)} >
        <Text>
          {text}
        </Text>
      </View> 
      
      */
 
jewelStyle = function(scale,styles) {
let tr=[
            { "scale": scale},
            { "translateY": 0 },
            { "translateX": 0 },
            { "rotateX": "0deg" },
            { "rotateY": "0deg" },
            { "rotateZ": "0deg" }
        ];
        
 obj={marker:{...styles.marker,transform:tr}};
console.log('2');console.log(obj);
   return obj.marker;
 }
 
export const clusterMarker = ({
  stylechild, text,
  defaultMotionStyle, motionStyle,
}) => (
   <Motion defaultStyle={defaultMotionStyle} style={motionStyle}>
  {

  }
  </Motion> 
);

export const clusterMarkerHOC = compose(
 defaultProps({ 
stylechild: {
  // marker:{ 
  cursor: 'pointer',
 borderWidth: 1,
 borderColor: '#004336',
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#333',
  fontSize: 14,
  fontWeight: 'bold',
     transform:[]
 //   }
    },
    text: '0', 
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    
    stiffness: 320,
    damping: 7,
    precision: 0.001,
  }),
  // pure optimization can cause some effects you don't want,
  // don't use it in development for markers
  pure,
  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale },
    })
  ),
  withPropsOnChange(
    ['hovered'],
    ({
      hovered, hoveredScale, defaultScale,
      stiffness, damping, precision,
    }) => ({
      hovered,
      motionStyle: {
        scale: spring(
          hovered ? hoveredScale : defaultScale,
          { stiffness, damping, precision }
        ),
      },
    })
  )
);

export default clusterMarkerHOC(clusterMarker);
