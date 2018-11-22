import React, { Component } from 'react';
import {
  Text, View, ScrollView, SafeAreaView,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Spinner from '@common/Spinner';
import generalStyles from '@styles/general';
// import { Actions } from 'react-native-router-flux';
import TimetableItem from './TimetableItem';
import Calendar from './Calendar';
import styles from './styles';

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

class ShowTimetable extends Component {
  state = {
    currentDate: moment(),
  }

  onSwipeLeftTimetable = () => this.setState(prevState => ({ currentDate: prevState.currentDate.add(1, 'd') }));

  onSwipeRightTimetable = () => this.setState(prevState => ({ currentDate: prevState.currentDate.subtract(1, 'd') }));

  renderTimetable = (currentDate) => {
    const { currentTimetable, subgroup } = this.props;
    const relevantTimetable = this.getCurrentTimetable(currentTimetable, currentDate);
    if (relevantTimetable.length === 0) {
      return (
        <View style={styles.defaultTextView}>
          <Text style={styles.defaultText}>Расписание не найдено:(</Text>
        </View>
      );
    }
    return relevantTimetable.map((ttItem) => {
      if (ttItem.subgroup === subgroup || ttItem.subgroup === 'вся группа' || subgroup === 'вся группа') {
        return (
          <TimetableItem
            key={ttItem.time + ttItem.lecturer}
            timetableForADay={ttItem}
          />);
      }
      return null;
    });
  }

  getCurrentTimetable = (timetable, currentDate) => {
    const currentTT = timetable.filter((tt) => {
      const ttDate = moment(tt.date, 'DD-MM-YYYY', 'ru').format('L');
      return ttDate === currentDate.format('L');
    });
    return currentTT;
  }

  onCurrentDayChange = (currentDate) => {
    this.setState({ currentDate });
  }

  getCurrentDate = () => {
    const { currentDate } = this.state;
    return currentDate.clone();
  }

  render() {
    const { currentTimetable, timetableError, isLoading } = this.props;
    const { currentDate } = this.state;
    return (
      <SafeAreaView style={generalStyles.fullSize}>
        {isLoading ? <Spinner />
          : (
            <React.Fragment>
              {currentTimetable.length > 0
              && (
              <Calendar
                chosenDay={this.getCurrentDate()}
                onDayChange={this.onCurrentDayChange}
              />
              )}
              <GestureRecognizer
                onSwipeLeft={this.onSwipeLeftTimetable}
                onSwipeRight={this.onSwipeRightTimetable}
                config={config}
                style={generalStyles.fullSize}
              >
                {
                  currentTimetable.length > 0
                    ? (
                      <ScrollView>
                        {this.renderTimetable(currentDate)}
                      </ScrollView>
                    )
                    : (
                      <View style={styles.defaultTextView}>
                        <Text style={styles.defaultText}>{timetableError}</Text>
                      </View>
                    )
              }
              </GestureRecognizer>
            </React.Fragment>
          )}
      </SafeAreaView>
    );
  }
}

ShowTimetable.defaultProps = {
  subgroup: 'вся группа',
  currentTimetable: [],
};

ShowTimetable.propTypes = {
  timetableError: PropTypes.string.isRequired,
  subgroup: PropTypes.string,
  currentTimetable: PropTypes.arrayOf(PropTypes.shape({})),
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  currentGroupOrLecturerName: state.timetable.currentGroupOrLecturer.groupOrLecturerName,
  currentTimetable: state.timetable.currentTimetable,
  timetableError: state.timetable.timetableError,
  isLoading: state.isLoading,
});


export default connect(mapStateToProps)(ShowTimetable);
