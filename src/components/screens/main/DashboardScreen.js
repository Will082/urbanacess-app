// components/screens/main/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
// Import the centralized geolocation utility
import { getCurrentLocation } from '../../../utils/geolocation';
import AccessibleText from '../../common/AccessibleText';
import Card from '../../common/Card';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme';
import { useApp } from '../../../context/AppContext';

const DashboardScreen = ({ navigation }) => {
  const { getOcorrenciasProximas } = useApp();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loadingOcorrencias, setLoadingOcorrencias] = useState(true);
  const [errorOcorrencias, setErrorOcorrencias] = useState('');
  // Keep location state, but it will be populated by the utility
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorLocation, setErrorLocation] = useState('');

  // Default region in case of errors or permission denial
  const defaultRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    const fetchLocationAndOcorrencias = async () => {
      setLoadingLocation(true);
      setErrorLocation('');
      setMapRegion(null); // Reset map region at the beginning

      // Use the centralized utility function
      const locationResult = await getCurrentLocation();

      let currentLatitude = defaultRegion.latitude;
      let currentLongitude = defaultRegion.longitude;

      if (locationResult.success) {
        const { latitude, longitude } = locationResult.data;
        currentLatitude = latitude;
        currentLongitude = longitude;
        setLocation({ coords: { latitude, longitude } }); // Store location data if needed elsewhere
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.01, // Zoom level
          longitudeDelta: 0.01,
        };
        setMapRegion(region);
      } else {
        setErrorLocation(locationResult.error || '');
        // Don't show alert here, handle display in the component
        // Alert.alert('Erro de Localização', locationResult.error || 'Não foi possível obter sua localização. Verifique as permissões e tente novamente.');
        // Set default location
        setLocation({ coords: { latitude: defaultRegion.latitude, longitude: defaultRegion.longitude } });
        setMapRegion(defaultRegion); // Set map to default region even on error
      }
      // Load occurrences based on the determined location (either real or default)
      await carregarOcorrencias(currentLatitude, currentLongitude);
      setLoadingLocation(false);
    };

    fetchLocationAndOcorrencias();
    // Dependency array is empty as we want this to run once on mount
  }, []);

  const carregarOcorrencias = async (latitude, longitude) => {
    setLoadingOcorrencias(true);
    setErrorOcorrencias('');
    try {
      // Add a small delay for testing loading indicator
      // await new Promise(resolve => setTimeout(resolve, 1000)); 
      const data = await getOcorrenciasProximas(latitude, longitude);
      setOcorrencias(data);
    } catch (err) {
      setErrorOcorrencias('Não foi possível carregar as ocorrências próximas');
      console.error('Error loading ocorrencias:', err);
    } finally {
      setLoadingOcorrencias(false);
    }
  };

  const renderOcorrenciaItem = (ocorrencia) => (
    // Added check for ocorrencia.id as key
    <Card key={ocorrencia.id || Math.random()} style={styles.ocorrenciaCard} onPress={() => navigation.navigate('DetalheOcorrencia', { id: ocorrencia.id })}> 
      <View style={styles.ocorrenciaHeader}>
        {/* Allow category text to shrink and wrap */}
        <AccessibleText variant="titleSmall" color="accent" style={styles.categoriaText} numberOfLines={2} ellipsizeMode="tail">
          {ocorrencia.categoria?.nome || 'Categoria não definida'}
        </AccessibleText>
        <AccessibleText variant="caption" color="secondary" style={styles.dateText}>
          {ocorrencia.dataCriacao ? new Date(ocorrencia.dataCriacao).toLocaleDateString() : ''}
        </AccessibleText>
      </View>

      <AccessibleText variant="body" numberOfLines={3} style={styles.descricao}> {/* Increased lines for description */}
        {ocorrencia.descricao}
      </AccessibleText>

      <View style={styles.ocorrenciaFooter}>
        {/* Allow address text to shrink */}
        <AccessibleText variant="bodySmall" color="secondary" style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
          {ocorrencia.endereco}
        </AccessibleText>

        {ocorrencia.urgente && (
          <View style={styles.urgenteBadge}>
            <AccessibleText variant="caption" color="light">
              Urgente
            </AccessibleText>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Removed redundant Title */}
        {/* <AccessibleText variant="titleMedium" color="accent" style={styles.title}>
          Tela Principal
        </AccessibleText> */}

        <View style={styles.mapContainer}>
          <Image
            source={require('../../../assets/images/static-map-placeholder.png')} // substitua pelo caminho real da sua imagem
            style={styles.staticMap}
          />
        </View>

        <View style={styles.ocorrenciasContainer}>
          <AccessibleText variant="titleSmall" color="primary" style={styles.sectionTitle}>
            Ocorrências Próximas
          </AccessibleText>

          {loadingOcorrencias ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{marginTop: SPACING.large}}/>
          ) : errorOcorrencias ? (
            <AccessibleText color="error" style={styles.listErrorText}>{errorOcorrencias}</AccessibleText>
          ) : ocorrencias.length === 0 ? (
            <AccessibleText style={styles.listEmptyText}>Nenhuma ocorrência encontrada nas proximidades</AccessibleText>
          ) : (
            // Use ScrollView for the list of occurrences
            <ScrollView showsVerticalScrollIndicator={false}>
              {ocorrencias.map(renderOcorrenciaItem)}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.medium, // Horizontal padding for content
    paddingTop: SPACING.medium, // Add top padding
  },
  // title: { // Removed title style
  //   marginBottom: SPACING.medium,
  // },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    marginBottom: SPACING.large, // Increased space below map
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.border, // Placeholder background
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapErrorContainer: {
    padding: SPACING.medium,
    alignItems: 'center',
  },
  mapErrorText: {
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
   mapErrorTextSmall: {
    textAlign: 'center',
    fontSize: 12, // Smaller font size for the hint
  },
  ocorrenciasContainer: {
    flex: 1, // Allow this section to take remaining space
  },
  sectionTitle: {
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.tiny, // Small horizontal padding for title
  },
   listErrorText: {
    textAlign: 'center',
    marginTop: SPACING.large,
    paddingHorizontal: SPACING.medium,
  },
  listEmptyText: {
    textAlign: 'center',
    marginTop: SPACING.large,
    color: COLORS.text.secondary,
    paddingHorizontal: SPACING.medium,
  },
  ocorrenciaCard: {
    marginBottom: SPACING.medium,
    // Removed padding from card itself, handled by content padding
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the start for wrapping
    marginBottom: SPACING.small,
  },
  categoriaText: {
    flex: 1, // Allow text to take available space and wrap
    marginRight: SPACING.small, // Space between category and date
    fontWeight: 'bold', // Make category stand out
  },
  dateText: {
    // No flex needed, let it take its own space
  },
  descricao: {
    marginBottom: SPACING.medium, // More space after description
    color: COLORS.text.secondary, // Softer color for description
  },
  ocorrenciaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.small, // Add space before footer
  },
  addressText: {
     flex: 1, // Allow address to take space
     marginRight: SPACING.small, // Space before badge if present
  },
  urgenteBadge: {
    backgroundColor: COLORS.accent.error,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: 'auto', // Push badge to the right if address is short
  },
});

export default DashboardScreen;

