import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import pdfsData from '../data/pdfs-mapping.json';

const PDFsScreen = () => {
  const { t, language } = useLanguage();
  const [searchText, setSearchText] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'getting-started', 'medical', 'wellness', 'birth', 'postpartum', 'admin', 'community'];

  const filteredPDFs = pdfsData.pdfs.filter(pdf => {
    const matchesSearch = pdf.titleEs.toLowerCase().includes(searchText.toLowerCase()) ||
                         pdf.titleEn.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pdf.section === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat) => {
    const labels = {
      'all': 'Todos',
      'getting-started': 'Primeros pasos',
      'medical': 'Salud médica',
      'wellness': 'Bienestar',
      'birth': 'Parto',
      'postpartum': 'Posparto',
      'admin': 'Administración',
      'community': 'Comunidad'
    };
    return labels[cat] || cat;
  };

  const renderPDFItem = ({ item }) => {
    const title = language === 'es' ? item.titleEs : item.titleEn;
    const description = language === 'es' ? item.descriptionEs : item.descriptionEn;

    return (
      <TouchableOpacity
        style={styles.pdfItem}
        onPress={() => setSelectedPDF(item)}
      >
        <View style={[styles.pdfIcon, { backgroundColor: theme.colors.primaryLight }]}>
          <Icon name="file-text" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.pdfInfo}>
          <Text style={styles.pdfTitle}>{title}</Text>
          <Text style={styles.pdfDescription} numberOfLines={2}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={theme.colors.textLighter} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('pdfs.title')}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textLighter} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('pdfs.search')}
            placeholderTextColor={theme.colors.textLighter}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                filterCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setFilterCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filterCategory === cat && styles.categoryChipTextActive
                ]}
              >
                {getCategoryLabel(cat)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PDFs List */}
        <FlatList
          data={filteredPDFs}
          renderItem={renderPDFItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          nestedScrollEnabled
        />

      </ScrollView>

      {/* PDF Detail Modal */}
      {selectedPDF && (
        <Modal
          visible={!!selectedPDF}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedPDF(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedPDF(null)}>
                  <Icon name="x" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {language === 'es' ? selectedPDF.titleEs : selectedPDF.titleEn}
                </Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  {language === 'es' ? selectedPDF.descriptionEs : selectedPDF.descriptionEn}
                </Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Icon name="tag" size={20} color={theme.colors.primary} />
                    <Text style={styles.infoLabel}>Categoría</Text>
                    <Text style={styles.infoValue}>{getCategoryLabel(selectedPDF.section)}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Icon name="calendar" size={20} color={theme.colors.primary} />
                    <Text style={styles.infoLabel}>Semanas relevantes</Text>
                    <Text style={styles.infoValue}>Semana {Math.min(...selectedPDF.relevantWeeks)} - {Math.max(...selectedPDF.relevantWeeks)}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.downloadButton}>
                  <Icon name="download" size={20} color={theme.colors.white} />
                  <Text style={styles.downloadText}>Descargar PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.viewButton}>
                  <Icon name="eye" size={20} color={theme.colors.primary} />
                  <Text style={styles.viewText}>Ver en la app</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundLight,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  categoryChipTextActive: {
    color: theme.colors.white,
  },
  pdfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  pdfIcon: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfInfo: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  pdfTitle: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  pdfDescription: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: 60,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
  },
  modalBody: {
    padding: theme.spacing.md,
  },
  modalDescription: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  infoItem: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  infoValue: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  downloadText: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundLight,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  viewText: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default PDFsScreen;
