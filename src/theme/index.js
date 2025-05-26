// theme/index.js
export const COLORS = {
  primary: '#2D6CC0',
  secondary: '#FFFFFF',
  background: {
    dark: '#1A2E4C',
    light: '#F5F5F5'
  },
  accent: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107'
  },
  text: {
    primary: '#000000',
    secondary: '#757575',
    light: '#FFFFFF'
  },
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

export const FONTS = {
  sizes: {
    large: 24,
    medium: 18,
    regular: 16,
    small: 14,
    tiny: 12
  },
  weights: {
    bold: 'bold',
    semiBold: '600',
    normal: 'normal',
    light: '300'
  }
};

export const SPACING = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48
};

export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 16,
  xlarge: 24,
  round: 50
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  strong: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  }
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS
};
