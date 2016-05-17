import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UIActions from '../../../redux/actions/UIActions';
import * as UserActions from '../../../redux/actions/UserActions';
import * as APIResultActions from '../../../redux/actions/APIResultActions'
import {createSelector} from 'reselect';
import {sidebarStatus$, apiWaitingStatus$} from '../../../redux/selectors/UISelector';
import {apiResultSelector$} from '../../../redux/selectors/ApiResultSelector';
import {user$} from '../../../redux/selectors/UserSelector';
export const userSelector$ = createSelector(user$,
  (user) => {
    return {
      user
    }
  });

const mapStateToProps = (state) => {
  return Object.assign({}, sidebarStatus$(state), apiWaitingStatus$(state), userSelector$(state), apiResultSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UIActions, UserActions, APIResultActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);


