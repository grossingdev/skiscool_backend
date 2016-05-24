import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity,findNodeHandle} from 'react-native';


const WIDTH_MAP =100;
const HEIGHT_MAP =100;
var MapPage = React.createClass({
  packages:[],
  mixins: [MapboxGG.Mixin,Utilsmap],
  Layer_markers:[{x:0,y:0},{x:0,y:200},{x:175,y:0},{x:175,y:200}],