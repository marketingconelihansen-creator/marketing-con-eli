import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

const ProfileScreen = () => {
  const { t, language, changeLanguage } = useLanguage();
  const { dueDateString, currentWeek } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={[theme.colors.primaryLight, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Icon name="heart" size={40} color={theme.colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mi Embarazo</Text>
              <Text style={styles.profileSubtitle}>Semana {currentWeek} de 40</Text>
            </View>
          </View>

          {dueDateString && (
            <>
              <View style={styles.divider} />
              <View style={styles.profileDetails}>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={20} color={theme.colors.white} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>{t('profile.dueDate')}</Text>
                    <Text style={styles.detailValue}>
                      {moment(dueDateString).format('DD MMM YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </LinearGradient>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ {t('profile.settings')}</Text>

          {/* Language */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="globe" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{t('profile.language')}</Text>
                <Text style={styles.settingValue}>
                  {language === 'es' ? 'Español' : 'English'}
                </Text>
              </View>
            </View>
            <Switch
              value={language === 'en'}
              onValueChange={(value) => changeLanguage(value ? 'en' : 'es')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={language === 'en' ? theme.colors.primary : theme.colors.textLighter}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Notificaciones</Text>
                <Text style={styles.settingValue}>Activadas</Text>
              </View>
            </View>
            <Switch
              value={true}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Acerca de</Text>

          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="heart" size={24} color={theme.colors.primary} />
            <View style={styles.aboutText}>
              <Text style={styles.aboutTitle}>Primer Latido</Text>
              <Text style={styles.aboutVersion}>Versión 1.0.0</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.descriptionBox}>
            <Text style={styles.description}>
              Primer Latido es una app diseñada para acompañarte durante tu embarazo con información semana a semana, recordatorios personalizables y acceso a recursos completos.
            </Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <Text style={styles.featureText}>Información de 40 semanas de embarazo</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <Text style={styles.featureText}>20 PDFs descargables incluidos</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <Text style={styles.featureText}>Recordatorios diarios personalizables</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <Text style={styles.featureText}>Calculadora de fecha probable de parto</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contacto</Text>

          <TouchableOpacity style={styles.contactItem}>
            <Icon name="mail" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>soporte@primerlatido.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <Icon name="instagram" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>@primerlatido</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <TouchableOpacity>
            <Text style={styles.legalLink}>Términos y Condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: theme.spacing.sm }}>
            <Text style={styles.legalLink}>Política de Privacidad</Text>
          </TouchableOpacity>
          <Text style={styles.copyright}>
            © 2024 Primer Latido. Todos los derechos reservados.
          </Text>
        </View>

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
  profileCard: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
  profileSubtitle: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.white,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: theme.spacing.md,
  },
  profileDetails: {
    paddingTop: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.white,
    opacity: 0.8,
  },
  detailValue: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.white,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  settingValue: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
  },
  aboutText: {
    marginLeft: theme.spacing.md,
  },
  aboutTitle: {
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  aboutVersion: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  descriptionBox: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  featuresList: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
  },
  legalSection: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
  },
  legalLink: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  copyright: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});

export default ProfileScreen;
