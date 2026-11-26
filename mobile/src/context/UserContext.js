import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    dueDateString: null,
    entryWeek: 1,
    profilePhoto: null,
    createdAt: null
  });

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedMedical = await AsyncStorage.getItem('medicalHistory');
      const savedGallery = await AsyncStorage.getItem('gallery');
      const savedSymptoms = await AsyncStorage.getItem('symptoms');
      const savedMeds = await AsyncStorage.getItem('medications');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedMedical) setMedicalHistory(JSON.parse(savedMedical));
      if (savedGallery) setGalleryPhotos(JSON.parse(savedGallery));
      if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
      if (savedMeds) setMedications(JSON.parse(savedMeds));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addMedicalVisit = async (visitData) => {
    try {
      const newVisit = {
        id: Date.now().toString(),
        date: visitData.date,
        doctorName: visitData.doctorName,
        notes: visitData.notes,
        weight: visitData.weight,
        bloodPressure: visitData.bloodPressure,
        nextVisitDate: visitData.nextVisitDate,
        createdAt: new Date().toISOString()
      };

      const updated = [...medicalHistory, newVisit];
      await AsyncStorage.setItem('medicalHistory', JSON.stringify(updated));
      setMedicalHistory(updated);
      return newVisit;
    } catch (error) {
      console.error('Error adding medical visit:', error);
    }
  };

  const addSymptom = async (symptomData) => {
    try {
      const newSymptom = {
        id: Date.now().toString(),
        name: symptomData.name,
        severity: symptomData.severity, // 1-5
        description: symptomData.description,
        date: new Date().toISOString(),
        actions: symptomData.actions || []
      };

      const updated = [...symptoms, newSymptom];
      await AsyncStorage.setItem('symptoms', JSON.stringify(updated));
      setSymptoms(updated);
      return newSymptom;
    } catch (error) {
      console.error('Error adding symptom:', error);
    }
  };

  const addMedication = async (medicationData) => {
    try {
      const newMedication = {
        id: Date.now().toString(),
        name: medicationData.name,
        dose: medicationData.dose,
        frequency: medicationData.frequency, // daily, twice, etc
        reason: medicationData.reason,
        startDate: medicationData.startDate,
        endDate: medicationData.endDate || null,
        reminders: medicationData.reminders || []
      };

      const updated = [...medications, newMedication];
      await AsyncStorage.setItem('medications', JSON.stringify(updated));
      setMedications(updated);
      return newMedication;
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const addGalleryPhoto = async (photoData) => {
    try {
      const newPhoto = {
        id: Date.now().toString(),
        uri: photoData.uri,
        week: photoData.week,
        date: new Date().toISOString(),
        caption: photoData.caption || '',
        mood: photoData.mood || null
      };

      const updated = [...galleryPhotos, newPhoto];
      await AsyncStorage.setItem('gallery', JSON.stringify(updated));
      setGalleryPhotos(updated);
      return newPhoto;
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const getSymptomsByWeek = (week) => {
    return symptoms.filter(s => {
      const symptomWeek = Math.ceil(
        (new Date(s.date) - new Date(user.createdAt)) / (7 * 24 * 60 * 60 * 1000)
      );
      return symptomWeek === week;
    });
  };

  const getPhotosByWeek = (week) => {
    return galleryPhotos.filter(p => p.week === week);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        medicalHistory,
        galleryPhotos,
        symptoms,
        medications,
        loading,
        updateProfile,
        addMedicalVisit,
        addSymptom,
        addMedication,
        addGalleryPhoto,
        getSymptomsByWeek,
        getPhotosByWeek
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
