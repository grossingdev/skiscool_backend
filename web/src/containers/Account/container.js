import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {apiResultSelector$} from 'redux/selectors/ApiResultSelector';
import {apiWaitingStatus$} from 'redux/selectors/UISelector';

const mapStateToProps = (state) => {
  return Object.assign({}, apiResultSelector$(state), apiWaitingStatus$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
