import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MapPackageActions from '../../../redux/actions/MapPackageActions';
import * as UIActions from '../../../redux/actions/UIActions';
import * as SocketActions from '../../../redux/actions/SocketActions';
import * as MapActions from '../../../redux/actions/MapActions';
import {createSelector} from 'reselect';

import {showPackageDialog$} from '../../../redux/selectors/UISelector';
import {packageRegion$, packageRunning$, packageMessage$} from '../../../redux/selectors/MapPackageSelector';
import {user$} from '../../../redux/selectors/UserSelector';
import {deviceInfo$} from '../../../redux/selectors/DeviceSelector';
import {placeMarkersSelector$} from '../../../redux/selectors/MapSelector';

export const selector$ = createSelector(showPackageDialog$, packageRegion$, packageRunning$, packageMessage$, deviceInfo$, user$,
  (showPackageDialog, packageRegion, packageRunning, packageMessage, deviceInfo, user) => {
    return {
      showPackageDialog, packageRegion, packageRunning, packageMessage, deviceInfo, user
    }
  });

const mapStateToProps = (state) => {
  return Object.assign({}, selector$(state), placeMarkersSelector$(state));
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UIActions, MapPackageActions, SocketActions, MapActions), dispatch);
};

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);


