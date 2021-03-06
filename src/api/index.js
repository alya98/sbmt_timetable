import axios from 'axios';
import config from '../config/config.json';

export const fetchAllGroupsTimetable = async () => {
  const { data } = await axios.get('http://timetable.sbmt.by/groups/');
  return data;
};

export const fetchAllLecturersTimetable = async () => {
  const { data } = await axios.get('http://timetable.sbmt.by/lecturers/');
  return data;
};

export const getGroupTimetable = async (groupFile) => {
  const { data } = await axios.get(`${config.serverApi}${config.query.groupTimetableQuery}${groupFile}`);
  return data.schedule.lesson;
};

export const getLecturerTimetable = async (lecturerFile) => {
  const { data } = await axios.get(`${config.serverApi}${config.query.lecturerTimetableQuery}${lecturerFile}`);
  return data.lecturer.lesson;
};

export const sendFeedback = userFeedback => axios.post(`${config.serverApi}${config.query.sendFeedbackQuery}`, userFeedback);
