// components/screens/main/NovaOcorrenciaScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Switch, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AccessibleText from '../../common/AccessibleText';
import Input from '../../common/Input';
import AccessibleButton from '../../common/AccessibleButton';
import Header from '../../layout/Header';
// Import FONTS from theme
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../../../theme';
import { useApp } from '../../../context/AppContext';

const NovaOcorrenciaScreen = ({ navigation }) => {
  const { categorias, criarOcorrencia } = useApp();
  const mapRef = useRef(null);

  const [fotoUri, setFotoUri] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [ocorrenciaLocation, setOcorrenciaLocation] = useState(null); // { latitude, longitude, address }
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorLocation, setErrorLocation] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [pontoPublico, setPontoPublico] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState('');

  // Get initial location
  useEffect(() => {
    (async () => {
      setLoadingLocation(true);
      setErrorLocation('');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorLocation('Permissão de localização negada.');
        Alert.alert('Permissão Negada', 'Precisamos da sua localização para registrar a ocorrência. Você pode ajustar manualmente no mapa.');
        // Set a default location (e.g., São Paulo center)
        const defaultCoords = { latitude: -23.55052, longitude: -46.633308 };
        setOcorrenciaLocation({ ...defaultCoords, address: 'Ajuste o marcador no mapa' });
        setMapRegion({ ...defaultCoords, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
        setLoadingLocation(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        const region = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setMapRegion(region);
        await updateOcorrenciaLocation(latitude, longitude);
      } catch (error) {
        setErrorLocation('Não foi possível obter a localização. Ajuste manualmente.');
        const defaultCoords = { latitude: -23.55052, longitude: -46.633308 };
        setOcorrenciaLocation({ ...defaultCoords, address: '' });
        setMapRegion({ ...defaultCoords, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // Function to get address from coordinates
  const updateOcorrenciaLocation = async (latitude, longitude) => {
    try {
      let addressResult = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = 'Endereço não encontrado';
      if (addressResult && addressResult.length > 0) {
        const { street, name, city, region, postalCode } = addressResult[0];
        address = `${street || name || ''}, ${city || ''} - ${region || ''}, ${postalCode || ''}`.replace(/^, |, $/g, ''); // Basic formatting
      }
      setOcorrenciaLocation({ latitude, longitude, address });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setOcorrenciaLocation({ latitude, longitude, address: 'Erro ao buscar endereço' });
    }
  };

  // Handle marker drag
  const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    updateOcorrenciaLocation(latitude, longitude);
    // Center map on new marker position
    if (mapRef.current) {
      mapRef.current.animateToRegion({ ...mapRegion, latitude, longitude }, 500);
    }
  };

  // Handle camera access
  const handleTirarFoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso à câmera para tirar a foto.');
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduce quality slightly for faster uploads
      });

      if (!result.canceled) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const handleSelecionarCategoria = (cat) => {
    setCategoria(cat);
  };

  const handleEnviar = async () => {
    if (!categoria) {
      setErrorSubmit('Por favor, selecione uma categoria');
      return;
    }
    if (!descricao) {
      setErrorSubmit('Por favor, descreva o problema');
      return;
    }
    if (!ocorrenciaLocation) {
      setErrorSubmit('Localização não definida. Ajuste o marcador no mapa.');
      return;
    }

    setErrorSubmit('');
    setLoadingSubmit(true);

    try {
      // NOTE: Sending fotoUri directly. Backend needs to handle file upload.
      await criarOcorrencia({
        categoriaId: categoria.id,
        descricao,
        endereco: ocorrenciaLocation.address,
        latitude: ocorrenciaLocation.latitude,
        longitude: ocorrenciaLocation.longitude,
        imagemUrl: fotoUri, // Pass the local URI
        urgente,
        pontoPublico,
      });

      Alert.alert('Sucesso', 'Ocorrência registrada com sucesso!');
      navigation.navigate('Início'); // Navigate back to Dashboard or MinhasOcorrencias
    } catch (err) {
      setErrorSubmit(err.message || 'Erro ao criar ocorrência. Tente novamente.');
      console.error("Submit error:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Nova Ocorrência" showBackButton={true} navigation={navigation} />

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
        {/* Foto Section */}
        <View style={styles.sectionContainer}>
          <AccessibleText variant="titleSmall" style={styles.sectionTitle}>Foto (Opcional)</AccessibleText>
          <TouchableOpacity
            style={styles.fotoTouchable}
            onPress={handleTirarFoto}
            accessibilityLabel={fotoUri ? "Trocar foto" : "Tirar foto"}
            accessibilityRole="button"
          >
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Ionicons name="camera" size={40} color={COLORS.primary} />
                <AccessibleText color="accent" style={styles.fotoText}>Tirar Foto</AccessibleText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Categoria Section */}
        <View style={styles.sectionContainer}>
          <AccessibleText variant="titleSmall" style={styles.sectionTitle}>Categoria *</AccessibleText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriaScrollView}>
            {categorias?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoriaItem,
                  categoria?.id === cat.id && styles.categoriaItemSelected
                ]}
                onPress={() => handleSelecionarCategoria(cat)}
                accessibilityLabel={`Categoria ${cat.nome}`}
                accessibilityRole="button"
                accessibilityState={{ selected: categoria?.id === cat.id }}
              >
                <AccessibleText color={categoria?.id === cat.id ? 'light' : 'primary'}>
                  {cat.nome}
                </AccessibleText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Descrição Section */}
        <View style={styles.sectionContainer}>
          <Input
            label="Descrição *"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema de acessibilidade..."
            multiline
            numberOfLines={4}
            style={styles.input}
            labelStyle={styles.inputLabel} // Use specific label style if needed
          />
        </View>

        {/* Localização Section */}
        <View style={styles.sectionContainer}>
          <AccessibleText variant="titleSmall" style={styles.sectionTitle}>Localização *</AccessibleText>
          <View style={styles.mapContainer}>
            <Image
              source={require('../../../assets/images/static-map-placeholder.png')} // substitua pelo caminho real da sua imagem
              style={styles.staticMap}
            />
          </View>
          <AccessibleText variant="bodySmall" color="secondary" style={styles.enderecoText}>
            {ocorrenciaLocation ? ocorrenciaLocation.address : 'Ajuste o marcador no mapa...'}
          </AccessibleText>
        </View>

        {/* Opções Section */}
        <View style={[styles.sectionContainer, styles.opcoesContainer]}>
          <View style={styles.opcaoItem}>
            <Switch
              value={urgente}
              onValueChange={setUrgente}
              trackColor={{ false: COLORS.border, true: COLORS.accent.error }}
              thumbColor={COLORS.secondary}
              ios_backgroundColor={COLORS.border}
              accessibilityLabel="Marcar como Urgente"
            />
            <AccessibleText style={styles.opcaoText}>Urgente</AccessibleText>
          </View>
          <View style={styles.opcaoItem}>
            <Switch
              value={pontoPublico}
              onValueChange={setPontoPublico}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.secondary}
              ios_backgroundColor={COLORS.border}
              accessibilityLabel="É um Ponto Público"
            />
            <AccessibleText style={styles.opcaoText}>Ponto Público</AccessibleText>
          </View>
        </View>

        {/* Submit Section */}
        {errorSubmit ? (
          <AccessibleText color="error" style={styles.errorText}>
            {errorSubmit}
          </AccessibleText>
        ) : null}
        <AccessibleButton
          title="Registrar Ocorrência"
          onPress={handleEnviar}
          loading={loadingSubmit}
          style={styles.submitButton}
          disabled={loadingSubmit}
        />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.large, // Add padding to bottom for scroll
  },
  sectionContainer: {
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    marginBottom: SPACING.medium,
    color: COLORS.text.primary,
    fontWeight: FONTS.weights.semiBold, // Use FONTS imported from theme
  },
  // Foto Styles
  fotoTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    width: '100%',
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    overflow: 'hidden', // Ensure image fits bounds
  },
  fotoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
  },
  fotoText: {
    marginTop: SPACING.small,
  },
  // Categoria Styles
  categoriaScrollView: {
    // Add styles if needed, e.g., margins
  },
  categoriaItem: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.large, // More rounded
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.small,
    backgroundColor: COLORS.secondary,
  },
  categoriaItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  // Input Styles
  input: {
    // Keep default Input component margin or override here
    // marginBottom: SPACING.large, // Already in section container
  },
  inputLabel: {
    // Style for Input labels if needed, otherwise uses Input's default
  },
  // Localização Styles
  mapContainer: {
    height: 250, // Increased height
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    marginBottom: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.border, // Placeholder background
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapErrorText: {
    textAlign: 'center',
    padding: SPACING.medium,
  },
  enderecoText: {
    marginTop: SPACING.tiny,
    textAlign: 'center',
  },
  // Opções Styles
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out options
    alignItems: 'center',
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcaoText: {
    marginLeft: SPACING.small,
    color: COLORS.text.primary,
  },
  // Submit Styles
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
    marginHorizontal: SPACING.medium,
  },
  submitButton: {
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.medium, // Add some space before button
  },
});

// Removed the fallback FONTS definition

export default NovaOcorrenciaScreen;

