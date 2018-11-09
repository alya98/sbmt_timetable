import React, { Component } from 'react';
import {
  Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import ContainerItem from '../ContainerItem';
import Container from '../Container';
import ActionIcon from './ActionIcon';
import * as actions from '../../../../actions';
import styles from './styles';

class Header extends Component {
  state = {
    visibleGroupView: false,
  }

  changeTimetableView = (subgroup) => {
    Actions.refresh({ subgroup });
    this.setState({ visibleGroupView: false });
  };

  renderGroups = () => {
    const { subgroups } = this.props;
    return subgroups.map(subgroup => (
      <ContainerItem key={subgroup}>
        <TouchableOpacity onPress={() => this.changeTimetableView(subgroup)}>
          <Text>{subgroup}</Text>
        </TouchableOpacity>
      </ContainerItem>
    ));
  };

  changeGroupView = () => {
    this.setState(prev => ({ visibleGroupView: !prev.visibleGroupView }));
  }

  onRefreshButtonPress = async () => {
    const {
      downloadTimetable, currentGroupOrLecturer, toggleSpinner, initialRouteName, addGroupsAndLecturers,
    } = this.props;
    toggleSpinner(true);
    if (initialRouteName === '_searchTimetable') {
      console.log('add groups');
      await addGroupsAndLecturers();
    } else {
      console.log('download tt');
      await downloadTimetable(currentGroupOrLecturer);
    }
    toggleSpinner(false);
  }

  onTickButtonPress = () => {
    const { toggleModal, userFeedback, setFeedbackError } = this.props;
    if (this.unfilledFeedbackValues(userFeedback)) {
      setFeedbackError('Пожалуйста, заполните все поля формы.');
    } else if (this.checkValidEmail(userFeedback.email)) {
      setFeedbackError('');
      toggleModal(true);
    } else {
      setFeedbackError('Вы ввели некорректный e-mail.');
    }
  }

  onBackButtonPress = () => {
    const { initialRouteName, toggleModal } = this.props;
    if (initialRouteName === '_sendFeedback') toggleModal(false);
    Actions.timetable();
  }

  checkValidEmail = (email) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(mailformat);
  }

  unfilledFeedbackValues = userFeedback => (
    Object.values(userFeedback).includes('')
  );


  render() {
    const {
      headerText, showGroups, back, subgroups, refresh, initialRouteName,
    } = this.props;
    const {
      title, view, safeArea, hiddenIcon, backIcon, groupViewStyle,
    } = styles;
    const { visibleGroupView } = this.state;
    console.log('header props', this.props);
    return (
      <SafeAreaView style={safeArea}>
        <View style={view}>
          {
          showGroups && (
            <ActionIcon
              icon={require('../../../../images/groups.png')} // eslint-disable-line global-require
              hideIcon={(subgroups.length < 2) && hiddenIcon}
              onIconPress={this.changeGroupView}
              disabled={subgroups.length <= 2}
            />
          )
        }
          { visibleGroupView
        && (
        <Container styled={groupViewStyle}>
          {
          this.renderGroups()
          }
        </Container>
        )
      }
          {
          back && (
            <ActionIcon
              icon={require('../../../../images/back.png')} // eslint-disable-line
              backIcon={backIcon}
              onIconPress={this.onBackButtonPress}
            />
          )
        }
          <Text style={title}>{headerText}</Text>
          {
            initialRouteName === '_sendFeedback'
              ? (
                <ActionIcon
                  icon={require('../../../../images/tick.png')} // eslint-disable-line
                  onIconPress={this.onTickButtonPress}
                />
              )
              : (
                <ActionIcon
                  icon={require('../../../../images/refresh.png')} // eslint-disable-line
                  hideIcon={!refresh && hiddenIcon}
                  onIconPress={this.onRefreshButtonPress}
                  disabled={initialRouteName === '_savedTimetable'}
                />
              )
          }
        </View>
      </SafeAreaView>
    );
  }
}

Header.defaultProps = {
  showGroups: null,
  back: null,
  refresh: null,
};

Header.propTypes = {
  headerText: PropTypes.string.isRequired,
  showGroups: PropTypes.bool,
  back: PropTypes.bool,
  refresh: PropTypes.bool,
  subgroups: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialRouteName: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  userFeedback: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  subgroups: state.currentGroupOrLecturer.subgroups,
  currentGroupOrLecturer: state.currentGroupOrLecturer,
  userFeedback: state.feedback.userData,
});

const mapDispatchToProps = {
  downloadTimetable: actions.downloadTimetable,
  addGroupsAndLecturers: actions.addGroupsAndLecturers,
  toggleSpinner: actions.toggleSpinner,
  toggleModal: actions.toggleModal,
  setFeedbackError: actions.setFeedbackError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
