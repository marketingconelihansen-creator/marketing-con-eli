import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Switch, TouchableOpacity, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import remindersData from '../data/reminders.json';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const RemindersScreen = () => {
  const { t } = useLanguage();
  const { reminders, toggleReminder } = useApp();

  const sections = [
    {
      title: 'Salud',
      data: remindersData.reminders.filter(r => r.category === 'health')
    },
    {
      title: 'Nutrición',
      data: remindersData.reminders.filter(r => r.category === 'nutrition')
    },
    {
      title: 'Ejercicio',
      data: remindersData.reminders.filter(r => r.category === 'exercise')
    },
    {
      title: 'Bienestar',
      data: remindersData.reminders.filter(r => r.category === 'wellness')
    }
  ];

  const renderReminder = (item) => {
    const isEnabled = reminders[item.id] !== false;

    return (
      <View style={styles.reminderItem}>
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderTitle}>{item.titleEs}</Text>
          <Text style={styles.reminderDesc}>{item.descriptionEs}</Text>
          <View style={styles.reminderMeta}>
            <Icon name="clock" size={14} color={theme.colors.textLighter} />
            <Text style={styles.reminderTime}>{item.time}</Text>
          </View>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={() => toggleReminder(item.id)}
          trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
          thumbColor={isEnabled ? theme.colors.primary : theme.colors.textLighter}
        />
      </View>
    );
  };

  const renderSection = ({ section }) => {
    if (section.data.length === 0) return null;

    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <View>
          {section.data.map(item => (
            <View key={item.id}>
              {renderReminder(item)}
            </View>
          ))}
        </View>
      </>
    );
  };

  const enabledCount = Object.values(reminders).filter(v => v === true).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('reminders.title')}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.statText}>{enabledCount} {t('reminders.enabled')}</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={theme.colors.info} />
          <Text style={styles.infoText}>
            Activa los recordatorios que desees. Recibirás notificaciones a las horas que selecciones.
          </Text>
        </View>

        {/* Reminders Sections */}
        {sections.map((section, index) => (
          <View key={index}>
            {renderSection({ section })}
          </View>
        ))}

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
  stats: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  infoCard: {
    backgroundColor: theme.colors.backgroundLight,
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  reminderDesc: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  reminderTime: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLighter,
    marginLeft: theme.spacing.sm,
  },
});

export default RemindersScreen;
