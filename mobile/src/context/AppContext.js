import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import weeksData from '../data/weeks.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dueDateString, setDueDateString] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [daysToGo, setDaysToGo] = useState(280);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState({});

  useEffect(() => {
    loadAppData();
  }, []);

  useEffect(() => {
    if (dueDateString) {
      calculateCurrentWeek();
    }
  }, [dueDateString]);

  const loadAppData = async () => {
    try {
      const savedDueDate = await AsyncStorage.getItem('dueDate');
      const savedReminders = await AsyncStorage.getItem('reminders');

      if (savedDueDate) {
        setDueDateString(savedDueDate);
      }

      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentWeek = () => {
    if (!dueDateString) return;

    const dueDate = moment(dueDateString);
    const today = moment();
    const daysLeft = dueDate.diff(today, 'days');
    const week = Math.max(1, 40 - Math.floor(daysLeft / 7));

    setCurrentWeek(Math.min(40, week));
    setDaysToGo(Math.max(0, daysLeft));
  };

  const setDueDate = async (date) => {
    try {
      const dateString = moment(date).format('YYYY-MM-DD');
      await AsyncStorage.setItem('dueDate', dateString);
      setDueDateString(dateString);
    } catch (error) {
      console.error('Error setting due date:', error);
    }
  };

  const calculateDueDateFromLMP = (lmpDate) => {
    const dueDate = moment(lmpDate).add(280, 'days');
    setDueDate(dueDate);
  };

  const getCurrentWeekData = () => {
    return weeksData.weeks.find(w => w.week === currentWeek) || weeksData.weeks[0];
  };

  const getWeekData = (week) => {
    return weeksData.weeks.find(w => w.week === week);
  };

  const toggleReminder = async (reminderId) => {
    try {
      const updatedReminders = {
        ...reminders,
        [reminderId]: !reminders[reminderId]
      };
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const setReminderTime = async (reminderId, time) => {
    try {
      const updatedReminders = {
        ...reminders,
        [`${reminderId}_time`]: time
      };
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error setting reminder time:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        dueDateString,
        currentWeek,
        daysToGo,
        loading,
        reminders,
        setDueDate,
        calculateDueDateFromLMP,
        getCurrentWeekData,
        getWeekData,
        toggleReminder,
        setReminderTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
