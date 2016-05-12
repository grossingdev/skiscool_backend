import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'redux/actions/UserActions';
import {user$} from 'redux/selectors/UserSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, user$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UserActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
