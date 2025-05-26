// components/layout/Footer.js
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AccessibleText from '../common/AccessibleText';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const tabs = [
    {
      name: 'Dashboard',
      icon: 'home-outline',
      activeIcon: 'home',
      screen: 'Dashboard',
    },
    {
      name: 'Nova',
      icon: 'add-circle-outline',
      activeIcon: 'add-circle',
      screen: 'NovaOcorrencia',
    },
    {
      name: 'Minhas',
      icon: 'list-outline',
      activeIcon: 'list',
      screen: 'MinhasOcorrencias',
    },
    {
      name: 'Validar',
      icon: 'checkmark-circle-outline',
      activeIcon: 'checkmark-circle',
      screen: 'Validacao',
    },
    {
      name: 'Perfil',
      icon: 'person-outline',
      activeIcon: 'person',
      screen: 'Perfil',
    },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.screen;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.screen)}
            accessibilityRole="tab"
            accessibilityLabel={tab.name}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? COLORS.primary : COLORS.text.secondary}
            />
            <AccessibleText
              variant="caption"
              color={isActive ? 'accent' : 'secondary'}
              style={styles.tabText}
            >
              {tab.name}
            </AccessibleText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.small,
    ...SHADOWS.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.small,
  },
  tabText: {
    marginTop: SPACING.tiny,
  },
});

export default Footer;
