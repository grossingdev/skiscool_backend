import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
 
import * as UserActions from './redux/actions/UserActions'; 
import * as DeviceActions from './redux/actions/DeviceActions'; 
import {deviceInfo$} from './redux/selectors/DeviceSelector';
import {userSelector$} from './redux/selectors/UserSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, userSelector$(state),deviceInfo$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UserActions,DeviceActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);

