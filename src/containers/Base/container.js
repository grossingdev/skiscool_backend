import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SocketActions from 'redux/actions/SocketActions';

const mapStateToProps = () => {
  return Object.assign({});
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, SocketActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
