import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SocketActions from 'redux/actions/SocketActions';
import * as UserActions from 'redux/actions/UserActions';

import {socketSelector$} from 'redux/selectors/SocketSelector';
import {userSelector$} from 'redux/selectors/UserSelector';
const mapStateToProps = (state) => {
  return Object.assign({}, socketSelector$(state), userSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, SocketActions, UserActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
