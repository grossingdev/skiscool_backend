import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SocketActions from 'redux/actions/SocketActions';
import {socketSelector$} from 'redux/selectors/SocketSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, socketSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, SocketActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
