// components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../../theme';

const Button = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${type}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'primary' ? COLORS.secondary : COLORS.primary} 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  smallButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  mediumButton: {
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  largeButton: {
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.xlarge,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
  text: {
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.secondary,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  smallText: {
    fontSize: FONTS.sizes.small,
  },
  mediumText: {
    fontSize: FONTS.sizes.regular,
  },
  largeText: {
    fontSize: FONTS.sizes.medium,
  },
  disabledText: {
    color: COLORS.text.secondary,
  },
});

export default Button;
