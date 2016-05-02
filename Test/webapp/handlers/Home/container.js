import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SocketActions from 'SocketActions';
import {socketSelector$} from 'SocketSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, socketSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, SocketActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
