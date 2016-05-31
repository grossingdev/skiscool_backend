import React, {Component, Image, Text, TouchableOpacity, View, StyleSheet, TextInput} from 'react-native';
import Modal from '../../../component/modal/Modal';
import PickerField from '../../../component/picker/PickerField';
import SkiResorts from '../constant';

const states = ['Instructor', 'Player'];
export default class CreatePackageConfirm extends Component {
  state = {
    boundary: null,
    regionName: '',
    regionError: ''
  };

  componentDidMount() {
    if (this.props.isAdmin == false) {
      this.setState({
        boundary: this.props.boundary,
        regionName: this.props.userProfile.email + '_package'
      })
    }
  }

  updateSkiResortBounds(name) {
    let ret = null;
    _.forEach(SkiResorts, (item) => {
      if (item.name == name) {
        ret = item.boundary;
      }
    });
    if (ret != null) {
      this.setState({
        boundary: {
          ne_lat: ret[0],
          ne_lon: ret[1],
          sw_lat: ret[2],
          sw_lon: ret[3]
        }
      })
    } else {
      this.setState({
        boundary: null
      })
    }
  }

  getSkiResortName() {
    let ret = [];
    _.forEach(SkiResorts, (item) => {
      ret.push(item.name)
    });
    return ret;
  }
  onConfirm() {
    if (this.state.regionName.length > 0 && this.state.boundary != null) {
      this.props.onConfirm(this.state.regionName, this.state.boundary)
    } else {
      this.setState({
        regionError: 'Select Region'
      })
    }
  }
  renderButtons() {
    let component = this;
    let buttons = [
      {label: 'Cancel', onPress: () => {component.props.onCancel()}},
      {label: 'Save', theme: 'info', onPress: () => {component.onConfirm()}}
    ];

    return buttons.map((button) => {
      let theme = {
        button: null,
        text: null
      };
      if (button.theme === 'danger') {
        theme.button = {backgroundColor: 'rgb(252, 110, 110)'};
      } else if (button.theme === 'info') {
        theme.button = {backgroundColor: 'rgb(23, 153, 204)'};
      }
      return (
        <TouchableOpacity key={button.label} style={[styles.button, theme.button]}>
          <TouchableOpacity onPress={button.onPress} style={styles.touchable}>
            <Text style={[styles.buttonText, theme.text]}>{button.label}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )
    })
  }

  renderRegionArea() {
    if (this.props.isAdmin == false) {
      return (
        <Text style={styles.confirmMessage}>{'Save current map area into offline package'}</Text>
      )
    } else {
      return (
        <PickerField
          containerStyle={styles.userTypeSelect}
          placeholder="              "
          value={this.state.regionName}
          onValueChange={(regionName) => {this.setState({regionName, regionError: ''}); this.updateSkiResortBounds(regionName)}}
          errorText={this.state.regionError}
          options={this.getSkiResortName()}/>
      )
    }
  }
  render() {
    let region = null;
    let message = '';
    let title = '';
    if (this.props.isAdmin == false) {
      title = 'Save user offline package';
    } else {
      title = 'Save ski resorts offline package';
    }
    if (this.state.boundary != null) {
      region = this.state.boundary;
      message = 'region ' + region.sw_lat.toFixed(4) + ", " + region.sw_lon.toFixed(4) + ", " + region.ne_lat.toFixed(4) + ", " + region.ne_lon.toFixed(4);
    }
    return (
      <Modal>
        <View style={styles.confirmDialogContainer}>
          <Text style={styles.confirmTitle}>{title}</Text>
          {this.renderRegionArea()}
          <Text style={styles.confirmMessage1}>{message}</Text>
          <View style={styles.buttonArea}>
            {this.renderButtons()}
          </View>
        </View>
      </Modal>
    )
  }
}

let styles = StyleSheet.create({
  confirmDialogContainer: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  confirmTitle: {
    marginVertical: 10,
    fontSize: 19
  },
  confirmMessage: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center'
  },
  confirmMessage1: {
    fontSize: 12,
    marginTop: 5,
    color: '#AAAAAA',
    textAlign: 'center'
  },

  buttonArea: {
    marginTop: 20,
    marginBottom: 10,
    height: 30,
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 10,
    marginHorizontal: 30,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: '#C5C4C4', // not in stylesheet
    marginRight: 1
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 21
  }
});