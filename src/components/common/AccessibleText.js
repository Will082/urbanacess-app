// components/common/AccessibleText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../../theme';

const AccessibleText = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
  ...props
}) => {
  return (
    <Text 
      style={[
        styles.text,
        styles[variant],
        styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`],
        style
      ]}
      accessibilityRole={variant.includes('title') ? 'header' : 'text'}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: FONTS.weights.normal,
  },
  titleLarge: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
    marginBottom: 8,
  },
  titleMedium: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold,
    marginBottom: 6,
  },
  titleSmall: {
    fontSize: FONTS.sizes.regular,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 4,
  },
  body: {
    fontSize: FONTS.sizes.regular,
  },
  bodySmall: {
    fontSize: FONTS.sizes.small,
  },
  caption: {
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.light,
  },
  colorPrimary: {
    color: COLORS.text.primary,
  },
  colorSecondary: {
    color: COLORS.text.secondary,
  },
  colorLight: {
    color: COLORS.text.light,
  },
  colorAccent: {
    color: COLORS.primary,
  },
  colorSuccess: {
    color: COLORS.accent.success,
  },
  colorError: {
    color: COLORS.accent.error,
  },
  colorWarning: {
    color: COLORS.accent.warning,
  },
});

export default AccessibleText;
