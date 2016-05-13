import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {apiResultSelector$} from 'redux/selectors/ApiResultSelector';

const mapStateToProps = (state) => {
  return Object.assign({}, apiResultSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
