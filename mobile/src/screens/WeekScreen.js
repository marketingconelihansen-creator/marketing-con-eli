import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Slider } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const WeekScreen = () => {
  const { t } = useLanguage();
  const { currentWeek, getWeekData } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weekData = getWeekData(selectedWeek);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('week.title')}</Text>
          <Text style={styles.weekNumber}>Semana {selectedWeek}</Text>
        </View>

        {/* Week Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>1</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={40}
            step={1}
            value={selectedWeek}
            onValueChange={setSelectedWeek}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <Text style={styles.sliderLabel}>40</Text>
        </View>

        {/* Baby Size Card */}
        <LinearGradient
          colors={[theme.colors.primaryLight, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View>
            <Text style={styles.cardTitle}>{t('home.babySize')}</Text>
            <View style={styles.sizeRow}>
              <View>
                <Text style={styles.sizeLabel}>Largo</Text>
                <Text style={styles.sizeValue}>{weekData.babySize.length}</Text>
              </View>
              <View>
                <Text style={styles.sizeLabel}>Peso</Text>
                <Text style={styles.sizeValue}>{weekData.babySize.weight}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sizeLabel}>Como</Text>
                <Text style={[styles.sizeValue, { fontSize: theme.typography.sizes.medium }]}>
                  {weekData.babySize.comparison}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Baby Development */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="smile" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('week.babyDevelopment')}</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{weekData.babyDevelopment}</Text>
          </View>
        </View>

        {/* Mother Changes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="heart" size={24} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>{t('week.motherChanges')}</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{weekData.motherChanges}</Text>
          </View>
        </View>

        {/* Normal Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="check-circle" size={24} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>Síntomas normales</Text>
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

        {/* Warning Symptoms */}
        {weekData.warningSymptoms && weekData.warningSymptoms.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="alert-circle" size={24} color={theme.colors.warning} />
              <Text style={styles.sectionTitle}>Síntomas de alerta</Text>
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
              <Text style={styles.sectionTitle}>Recomendación</Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{weekData.tips}</Text>
            </View>
          </View>
        )}

      </ScrollView>
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
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  weekNumber: {
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sliderLabel: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: theme.spacing.md,
  },
  card: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.white,
    opacity: 0.9,
  },
  sizeRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    justifyContent: 'space-between',
  },
  sizeLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.white,
    opacity: 0.8,
  },
  sizeValue: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
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
  contentBox: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
  },
  contentText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed,
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
  },
});

export default WeekScreen;
