import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {createSelector} from 'reselect';
import * as MapActions from 'redux/actions/MapActions';
import {mapStatusSelector$, placeMarkersSelector$} from 'redux/selectors/MapSelector';
const mapStateToProps = (state) => {
  return Object.assign({}, mapStatusSelector$(state), placeMarkersSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, MapActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
