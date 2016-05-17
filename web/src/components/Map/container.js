import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {createSelector} from 'reselect';

const mapStateToProps = (state) => {
  return Object.assign({});
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
