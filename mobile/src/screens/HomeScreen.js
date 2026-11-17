import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const HomeScreen = () => {
  const { t } = useLanguage();
  const { currentWeek, daysToGo, dueDateString, getCurrentWeekData, calculateDueDateFromLMP } = useApp();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lmpDate, setLmpDate] = useState(null);

  const weekData = getCurrentWeekData();

  const handleDateConfirm = (date) => {
    setLmpDate(date);
    calculateDueDateFromLMP(date);
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting')}</Text>
          <Text style={styles.subGreeting}>Semana {currentWeek} de 40</Text>
        </View>

        {/* Baby Size Card */}
        <LinearGradient
          colors={[theme.colors.primaryLight, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <Icon name="heart" size={32} color={theme.colors.white} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{t('home.babySize')}</Text>
              <Text style={styles.cardValue}>
                {weekData.babySize.length} · {weekData.babySize.weight}
              </Text>
              <Text style={styles.cardSubtext}>
                {weekData.babySize.comparison}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Days Counter Card */}
        <LinearGradient
          colors={[theme.colors.secondaryLight, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <Icon name="clock" size={32} color={theme.colors.white} />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{daysToGo} {t('home.daysToGo')}</Text>
              <Text style={styles.cardValue}>
                {dueDateString ? moment(dueDateString).format('DD/MM/YYYY') : 'Sin fecha'}
              </Text>
              <Text style={styles.cardSubtext}>{t('home.startDate')}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Calculator Button */}
        {!dueDateString && (
          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => setShowCalculator(true)}
          >
            <Icon name="calculator" size={20} color={theme.colors.primary} />
            <Text style={styles.calculatorText}>{t('home.calculator')}</Text>
            <Icon name="arrow-right" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}

        {/* Normal Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="check-circle" size={24} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>{t('home.normalSymptoms')}</Text>
          </View>
          <View style={styles.symptomsList}>
            {weekData.normalSymptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View style={[styles.symptomBullet, { backgroundColor: theme.colors.success }]} />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Warning Symptoms (if any) */}
        {weekData.warningSymptoms && weekData.warningSymptoms.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="alert-circle" size={24} color={theme.colors.warning} />
              <Text style={styles.sectionTitle}>{t('home.warningSymptoms')}</Text>
            </View>
            <View style={styles.symptomsList}>
              {weekData.warningSymptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <View style={[styles.symptomBullet, { backgroundColor: theme.colors.warning }]} />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        {weekData.tips && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="lightbulb" size={24} color={theme.colors.info} />
              <Text style={styles.sectionTitle}>💡 {t('week.tips')}</Text>
            </View>
            <Text style={styles.tipText}>{weekData.tips}</Text>
          </View>
        )}

        {/* Baby Development Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="smile" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('week.babyDevelopment')}</Text>
          </View>
          <Text style={styles.infoText}>{weekData.babyDevelopment}</Text>
        </View>

      </ScrollView>

      {/* Calculator Modal */}
      <Modal
        visible={showCalculator}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalculator(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCalculator(false)}>
                <Icon name="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('calculator.title')}</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar" size={20} color={theme.colors.primary} />
                <Text style={styles.dateInputText}>
                  {lmpDate ? moment(lmpDate).format('DD/MM/YYYY') : t('calculator.lastMenstruation')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { opacity: lmpDate ? 1 : 0.5 }]}
                disabled={!lmpDate}
                onPress={() => {
                  calculateDueDateFromLMP(lmpDate);
                  setShowCalculator(false);
                }}
              >
                <Text style={styles.buttonText}>{t('calculator.calculate')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        date={lmpDate || new Date()}
        maximumDate={new Date()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sizes.xxxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  card: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.white,
    opacity: 0.9,
  },
  cardValue: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
  },
  cardSubtext: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.white,
    opacity: 0.8,
    marginTop: theme.spacing.sm,
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundDark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  calculatorText: {
    flex: 1,
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  symptomsList: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  symptomBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  symptomText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    flex: 1,
  },
  tipText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  infoText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  modalBody: {
    padding: theme.spacing.md,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dateInputText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
});

export default HomeScreen;
