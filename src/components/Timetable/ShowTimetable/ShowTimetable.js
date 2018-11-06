import React, { Component } from 'react';
import {
  Text, View, ScrollView, SafeAreaView,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import TimetableItem from './TimetableItem';
import Calendar from './Calendar';
import Spinner from '../common/Spinner';
import styles from './styles';


const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

class ShowTimetable extends Component {
  state = {
    currentDate: moment(),
  }

  checkTimetable = (swipeDirection, currentDate) => {
    const { currentTimetable } = this.props;
    const day = swipeDirection === 'left' ? currentDate.clone().add(1, 'd') : currentDate.clone().subtract(1, 'd');
    const timetableExist = currentTimetable.find((tt) => {
      const ttDate = moment(tt.date, 'DD-MM-YYYY', 'ru').format('L');
      return ttDate === day.format('L') || day.day() === 0;
    });
    return timetableExist;
  }

  onSwipeLeftTimetable = () => {
    this.setState(prevState => ({ currentDate: prevState.currentDate.add(1, 'd') }));
  }

  onSwipeRightTimetable = () => {
    this.setState(prevState => ({ currentDate: prevState.currentDate.subtract(1, 'd') }));
  }

  renderTimetable = (currentDate) => {
    const { currentTimetable, subgroup } = this.props;
    const relevantTimetable = this.renderCurrentTimetable(currentTimetable, currentDate);
    if (relevantTimetable.length === 0) {
      return (
        <View style={styles.defaultTextView}>
          <Text style={styles.defaultText}>Расписание не найдено:(</Text>
        </View>
      );
    }
    return relevantTimetable.map((ttItem, index) => {
      if (ttItem.subgroup === subgroup || ttItem.subgroup === 'вся группа' || subgroup === 'вся группа') {
        return (
          <TimetableItem
            // eslint-disable-next-line react/no-array-index-key
            key={ttItem.time + index}
            timetableForADay={ttItem}
          />);
      }
    });
  }

  renderCurrentTimetable = (timetable, currentDate) => {
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
    console.log('ShowTimetable props', this.props, this.state);
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
                style={{ flex: 1 }}
              >
                {
                  currentTimetable.length > 0
                    ? (
                      <ScrollView style={{ borderWidth: 1 }}>
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
  currentTimetable: state.currentTimetable,
  timetableError: state.timetableError,
  isLoading: state.isLoading,
});


export default connect(mapStateToProps)(ShowTimetable);