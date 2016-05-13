import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'redux/actions/UserActions';
import * as APIResultActions from 'redux/actions/APIResultActions';
import {userSelector$} from 'redux/selectors/UserSelector';
import {apiResultSelector$} from 'redux/selectors/ApiResultSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, userSelector$(state), apiResultSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UserActions, APIResultActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
