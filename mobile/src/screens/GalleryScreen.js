import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';

import theme from '../data/theme.json';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';

const GalleryScreen = () => {
  const { t } = useLanguage();
  const { galleryPhotos, addGalleryPhoto } = useUser();
  const { currentWeek } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('happy');

  const moods = ['happy', 'excited', 'tired', 'emotional', 'anxious'];
  const moodEmojis = {
    happy: '😊',
    excited: '🤩',
    tired: '😴',
    emotional: '😭',
    anxious: '😰'
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedPhoto(result.assets[0].uri);
        setShowModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedPhoto(result.assets[0].uri);
        setShowModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedPhoto) {
      Alert.alert('Error', 'Por favor selecciona una foto');
      return;
    }

    await addGalleryPhoto({
      uri: selectedPhoto,
      week: currentWeek,
      caption,
      mood
    });

    setShowModal(false);
    setSelectedPhoto(null);
    setCaption('');
    setMood('happy');
    Alert.alert('Éxito', '¡Foto guardada!');
  };

  const renderPhotoCard = ({ item }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
      <View style={styles.photoInfo}>
        <Text style={styles.photoWeek}>Semana {item.week}</Text>
        <Text style={styles.photoMood}>{moodEmojis[item.mood] || '📸'}</Text>
        {item.caption && <Text style={styles.photoCaption}>{item.caption}</Text>}
        <Text style={styles.photoDate}>
          {new Date(item.date).toLocaleDateString('es-ES')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📸 Tu Galería</Text>
          <Text style={styles.subtitle}>Semana {currentWeek} - Recuerda estos momentos</Text>
        </View>

        {/* Add Photo Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={takePhoto}>
            <Icon name="camera" size={24} color={theme.colors.white} />
            <Text style={styles.addButtonText}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Icon name="image" size={24} color={theme.colors.white} />
            <Text style={styles.addButtonText}>Galería</Text>
          </TouchableOpacity>
        </View>

        {/* Photos Grid */}
        {galleryPhotos.length > 0 ? (
          <FlatList
            data={galleryPhotos}
            renderItem={renderPhotoCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="camera" size={48} color={theme.colors.textLighter} />
            <Text style={styles.emptyText}>
              Aún no tienes fotos. ¡Captura tu embarazo!
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Modal para agregar foto */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Tu foto - Semana {currentWeek}</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedPhoto && (
                <Image
                  source={{ uri: selectedPhoto }}
                  style={styles.previewImage}
                />
              )}

              <View style={styles.formSection}>
                <Text style={styles.label}>¿Cómo te sentís hoy?</Text>
                <View style={styles.moodSelector}>
                  {moods.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.moodButton,
                        mood === m && styles.moodButtonActive
                      ]}
                      onPress={() => setMood(m)}
                    >
                      <Text style={styles.moodEmoji}>{moodEmojis[m]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Nota o comentario (opcional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Escribe algo sobre este momento..."
                  placeholderTextColor={theme.colors.textLighter}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePhoto}
              >
                <Icon name="check" size={20} color={theme.colors.white} />
                <Text style={styles.saveButtonText}>Guardar foto</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  subtitle: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.sizes.medium,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  photoCard: {
    width: '48%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 150,
  },
  photoInfo: {
    padding: theme.spacing.md,
  },
  photoWeek: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  photoMood: {
    fontSize: 24,
    marginTop: theme.spacing.sm,
  },
  photoCaption: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  photoDate: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textLighter,
    marginTop: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    textAlign: 'center',
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
    fontSize: theme.typography.sizes.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  modalBody: {
    padding: theme.spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.medium,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonActive: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  moodEmoji: {
    fontSize: 32,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.text,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.sizes.medium,
  },
});

export default GalleryScreen;
