import React, { Component } from 'react';
import {
  Text, View, FlatList, SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import TimetableItem from './TimetableItem';
import styles from './styles';

class Main extends Component {
  renderCurrentTimetable = (timetable = [], currentDate) => {
    const currentTT = timetable.filter((tt) => {
      const ttDate = moment(tt.date, 'DD-MM-YYYY', 'ru').format('L');
      return ttDate === currentDate;
    });
    return currentTT;
  }

  render() {
    const { currentTimetable, timetableError } = this.props;
    const currentDate = moment().format('L');
    return (
      <SafeAreaView>
        {
        currentTimetable
          ? (
            <FlatList
              data={this.renderCurrentTimetable(Object.values(currentTimetable)[0], currentDate)}
              renderItem={({ item }) => <TimetableItem timetableForADay={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          )
          : (
            <View style={[styles.container, styles.defaultTextView]}>
              <Text style={styles.defaultText}>{timetableError}</Text>
            </View>
          )
        }
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => console.log(state) || ({
  currentTimetable: state.currentTimetable,
  timetableError: state.timetableError,
});

export default connect(mapStateToProps)(Main);
